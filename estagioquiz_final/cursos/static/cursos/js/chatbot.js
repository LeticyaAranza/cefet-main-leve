document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("chatbot-form");
    const input = document.getElementById("chatbot-input");
    const mensagens = document.getElementById("chatbot-mensagens");

    if (!form) {
        return;
    }

    const tokenInput = form.querySelector("[name=csrfmiddlewaretoken]");
    const csrfToken = tokenInput ? tokenInput.value : "";

    function adicionarMensagem(texto, autor) {
        const bolha = document.createElement("div");
        bolha.classList.add("chatbot-mensagem", `chatbot-mensagem--${autor}`);
        bolha.textContent = texto;
        mensagens.appendChild(bolha);
        mensagens.scrollTop = mensagens.scrollHeight;
        return bolha;
    }

    form.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const pergunta = input.value.trim();
        if (!pergunta) {
            return;
        }

        adicionarMensagem(pergunta, "usuario");
        input.value = "";
        input.disabled = true;

        const bolhaResposta = adicionarMensagem("Digitando...", "bot");

        try {
            const resposta = await fetch("/api/chatbot/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify({ pergunta: pergunta }),
            });

            const dados = await resposta.json();

            bolhaResposta.textContent =
                dados.resposta || dados.erro || "Algo deu errado, tente novamente.";
        } catch (erro) {
            bolhaResposta.textContent =
                "Não consegui me conectar ao assistente. Verifique sua conexão e tente novamente.";
        } finally {
            input.disabled = false;
            input.focus();
        }
    });
});
