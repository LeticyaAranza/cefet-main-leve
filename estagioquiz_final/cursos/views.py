import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST

from . import rag_service


def home(request):
    return render(request, 'cursos/index.html')

def informatica(request):
    return render(request, 'cursos/informatica.html')

def mecatronica(request):
    return render(request, 'cursos/mecatronica.html')

def edificacoes(request):
    return render(request, 'cursos/edificacoes.html')

@csrf_protect
@require_POST
def chatbot_api(request):
    try:
        dados = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"erro": "Requisição inválida."}, status=400)

    pergunta = dados.get("pergunta", "")

    try:
        resposta = rag_service.responder_pergunta(pergunta)
    except Exception:
        return JsonResponse(
            {"erro": "Não foi possível gerar uma resposta agora. Tente novamente em instantes."},
            status=500,
        )

    return JsonResponse({"resposta": resposta})
