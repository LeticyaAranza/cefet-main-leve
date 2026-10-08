# CEFET-MG — Mostra de Cursos

Aplicação Django leve para apresentar os cursos técnicos de Informática,
Edificações e Mecatrônica do CEFET-MG Campus Varginha.

## O que foi deixado mais leve

A versão anterior usava LangChain, FAISS, sentence-transformers e PyTorch.
Isso podia instalar bibliotecas de IA/CUDA muito pesadas para uma instância
gratuita do Render.

Esta versão usa somente:
- Django;
- Gunicorn;
- WhiteNoise;
- pypdf;
- API da Groq via HTTP, sem instalar um modelo local.

O chatbot continua usando os documentos da pasta `documentos/`, mas a busca
dos trechos é feita por palavras-chave antes de enviar o contexto para a Groq.

## Rodar localmente

```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Variáveis de ambiente

Crie um `.env` local a partir de `.env.example`:

```env
GROQ_API_KEY=sua_chave
GROQ_MODEL=openai/gpt-oss-20b
GA_MEASUREMENT_ID=G-XXXXXXXXXX
DEBUG=False
```

## Google Analytics 4

O site já possui o código do GA4 no `base.html`.
Basta colocar o ID de medição em `GA_MEASUREMENT_ID`.

Os quizzes já enviam eventos:
- `quiz_iniciado`
- `quiz_finalizado`

No evento `quiz_finalizado`, são enviados:
- `curso`
- `resultado`

No Google Analytics, esses eventos podem ser consultados em
Relatórios/Engajamento/Eventos. Para usar `curso` e `resultado` como
dimensões personalizadas em relatórios, cadastre-os como dimensões
personalizadas na interface do GA4.

## Render

Build Command:

```bash
./build.sh
```

Start Command:

```bash
gunicorn projeto.wsgi:application --bind 0.0.0.0:$PORT --workers 1 --threads 2 --timeout 120 --access-logfile - --error-logfile -
```

Variáveis no Render:
- `GROQ_API_KEY`
- `GA_MEASUREMENT_ID`
- `GROQ_MODEL=openai/gpt-oss-20b`
- `DEBUG=False`

A instância usa apenas um worker para reduzir o consumo de RAM.
