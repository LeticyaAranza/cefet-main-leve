"""
Chatbot leve para o site do CEFET-MG.

A versão anterior usava LangChain + sentence-transformers + FAISS.
Essas bibliotecas puxavam PyTorch/CUDA e deixavam o serviço pesado para
uma instância gratuita do Render.

Aqui usamos:
- pypdf para ler PDFs;
- uma busca lexical simples para recuperar os trechos mais relevantes;
- a API da Groq para gerar a resposta.

Assim não há modelo de embeddings, PyTorch ou CUDA no servidor.
"""

import json
import os
import re
import unicodedata
import urllib.error
import urllib.request
from pathlib import Path

from django.conf import settings
from pypdf import PdfReader


BASE_DIR = Path(__file__).resolve().parent.parent
DOCUMENTOS_DIR = BASE_DIR / "documentos"

_DOCUMENTOS = None
_CHUNKS = None

PROMPT_TEMPLATE = """Você é o assistente virtual do CEFET-MG Campus Varginha.
Seu papel é responder dúvidas dos visitantes sobre a instituição, os cursos
técnicos de Informática, Edificações e Mecatrônica, o processo de ingresso e
a Mostra de Cursos.

Use somente as informações presentes no CONTEXTO.
Se o contexto não tiver a resposta, diga que não encontrou essa informação
na base de conhecimento e recomende consultar os canais oficiais do CEFET-MG.
Não invente datas, valores, documentos, notas ou exigências.

Responda em português do Brasil, de forma clara e curta.

CONTEXTO:
{contexto}

PERGUNTA:
{pergunta}

RESPOSTA:
"""


def _normalizar(texto):
    texto = unicodedata.normalize("NFKD", texto or "")
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    return texto.lower()


def _palavras(texto):
    return set(re.findall(r"[a-z0-9]{2,}", _normalizar(texto)))


def _ler_documentos():
    documentos = []

    if not DOCUMENTOS_DIR.exists():
        return documentos

    for arquivo in sorted(DOCUMENTOS_DIR.iterdir()):
        try:
            if arquivo.suffix.lower() == ".txt":
                texto = arquivo.read_text(encoding="utf-8", errors="ignore")
                if texto.strip():
                    documentos.append((arquivo.name, texto))

            elif arquivo.suffix.lower() == ".pdf":
                leitor = PdfReader(str(arquivo))
                texto = "\n".join((pagina.extract_text() or "") for pagina in leitor.pages)
                if texto.strip():
                    documentos.append((arquivo.name, texto))
        except Exception:
            # Um documento com erro não derruba o chatbot.
            continue

    return documentos


def _quebrar_texto(texto, tamanho=1000, sobreposicao=120):
    texto = re.sub(r"\s+", " ", texto).strip()
    if not texto:
        return []

    partes = []
    inicio = 0

    while inicio < len(texto):
        fim = min(inicio + tamanho, len(texto))

        if fim < len(texto):
            corte = texto.rfind(" ", inicio, fim)
            if corte > inicio + 400:
                fim = corte

        partes.append(texto[inicio:fim].strip())

        if fim >= len(texto):
            break

        inicio = max(fim - sobreposicao, inicio + 1)

    return partes


def _obter_chunks():
    global _DOCUMENTOS, _CHUNKS

    if _CHUNKS is not None:
        return _CHUNKS

    _DOCUMENTOS = _ler_documentos()
    chunks = []

    for nome_arquivo, texto in _DOCUMENTOS:
        for trecho in _quebrar_texto(texto):
            chunks.append(
                {
                    "arquivo": nome_arquivo,
                    "texto": trecho,
                    "palavras": _palavras(trecho),
                }
            )

    if not chunks:
        chunks = [
            {
                "arquivo": "base",
                "texto": "Ainda não há documentos cadastrados na base de conhecimento.",
                "palavras": _palavras(
                    "Ainda não há documentos cadastrados na base de conhecimento."
                ),
            }
        ]

    _CHUNKS = chunks
    return _CHUNKS


def _buscar_contexto(pergunta, limite=4):
    palavras_pergunta = _palavras(pergunta)
    chunks = _obter_chunks()

    resultados = []

    for chunk in chunks:
        intersecao = palavras_pergunta.intersection(chunk["palavras"])

        # Dá mais peso para palavras mais específicas e evita que trechos
        # enormes dominem a busca.
        pontuacao = len(intersecao)

        if pontuacao:
            resultados.append((pontuacao, chunk))

    resultados.sort(key=lambda item: item[0], reverse=True)

    if not resultados:
        return "\n\n".join(
            f"[{chunk['arquivo']}]\n{chunk['texto']}" for chunk in chunks[:limite]
        )

    return "\n\n".join(
        f"[{chunk['arquivo']}]\n{chunk['texto']}"
        for _, chunk in resultados[:limite]
    )


def _chamar_groq(pergunta, contexto):
    api_key = os.environ.get("GROQ_API_KEY", "").strip()

    if not api_key:
        return (
            "O assistente ainda não está configurado. "
            "Adicione a variável GROQ_API_KEY no Render."
        )

    modelo = os.environ.get("GROQ_MODEL", "openai/gpt-oss-20b")

    payload = {
        "model": modelo,
        "temperature": 0.2,
        "max_tokens": 2000,
        "reasoning_effort": "low",
        "messages": [
            {
                "role": "system",
                "content": PROMPT_TEMPLATE.format(
                    contexto=contexto,
                    pergunta=pergunta,
                ),
            }
        ],
    }

    dados = json.dumps(payload).encode("utf-8")

    requisicao = urllib.request.Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=dados,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(requisicao, timeout=45) as resposta:
            resultado = json.loads(resposta.read().decode("utf-8"))

        escolha = resultado.get("choices", [{}])[0]
        texto = (escolha.get("message", {}).get("content") or "").strip()

        if not texto:
            print(f"[chatbot] resposta vazia da Groq. finish_reason={escolha.get('finish_reason')}")
            return "Não consegui gerar uma resposta agora."

        return texto

    except urllib.error.HTTPError as erro:
        try:
            print(f"[chatbot] erro HTTP {erro.code} da Groq: {erro.read().decode('utf-8', 'ignore')[:500]}")
        except Exception:
            pass
        if erro.code in (401, 403):
            return "A chave da Groq configurada no servidor é inválida."
        if erro.code == 429:
            return "O assistente atingiu o limite de requisições. Tente novamente em alguns instantes."
        return "O serviço de IA não respondeu corretamente. Tente novamente."

    except (urllib.error.URLError, TimeoutError):
        return "Não consegui conectar ao serviço de IA. Tente novamente em alguns instantes."

    except (json.JSONDecodeError, KeyError, IndexError, TypeError):
        return "Recebi uma resposta inválida do serviço de IA. Tente novamente."


def responder_pergunta(pergunta: str) -> str:
    pergunta = (pergunta or "").strip()

    if not pergunta:
        return "Pode repetir sua pergunta? Não recebi nenhum texto."

    if len(pergunta) > 500:
        return "Sua pergunta é muito longa. Tente resumir a dúvida em até 500 caracteres."

    contexto = _buscar_contexto(pergunta)
    return _chamar_groq(pergunta, contexto)
