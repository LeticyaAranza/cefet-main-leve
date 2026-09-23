let QuestaoAtual = 1;
const TotalQuestoes = 5;

function enviarEventoGA(nome, parametros) {
    if (typeof gtag === "function") {
        gtag("event", nome, parametros);
    }
}

const pontuacao = {
    "Engenharia de Robótica": 0,
    "Automação e Controle Industrial": 0,
    "Engenharia Biomédica e Equipamentos Hospitalares": 0,
    "Manutenção Eletromecânica Avançada": 0,
    "Engenharia de Veículos Autônomos e Elétricos": 0,
    "Manufatura Aditiva Industrial (Impressão 3D Avançada)": 0,
    "Engenharia de Produção": 0,
    "Engenharia da Computação": 0,
    "Engenharia Mecânica": 0,
    "Engenharia Eletrônica": 0
};

const descricao = {
    "Engenharia de Robótica":
        "Você gosta de inovação tecnológica, programação de sistemas complexos, matemática avançada e criação de máquinas autônomas do zero.",

    "Automação e Controle Industrial":
        "Você gosta de lógica de programação industrial, otimização de processos de fabricação e controle de plantas fabris em grande escala.",

    "Engenharia Biomédica e Equipamentos Hospitalares":
        "Você tem forte interesse pela área da saúde, responsabilidade com equipamentos de salvamento de vidas e afinidade com eletrônica de precisão.",

    "Manutenção Eletromecânica Avançada":
        "Você é prático, gosta de colocar a mão na massa, tem raciocínio rápido para resolução de problemas e facilidade com ferramentas e instrumentos de medição.",

    "Engenharia de Veículos Autônomos e Elétricos":
        "Você gosta de eletrônica automotiva avançada, veículos do futuro, sistemas de navegação autônoma e alta tecnologia aplicada à mobilidade.",

    "Manufatura Aditiva Industrial (Impressão 3D Avançada)":
        "Você tem fascínio por novas tecnologias de fabricação, materiais avançados, prototipagem rápida e processos produtivos inovadores.",

    "Engenharia de Produção":
        "Você gosta de organização, melhoria contínua, análise de eficiência, redução de custos e liderança de equipes voltadas para resultados.",

    "Engenharia da Computação":
        "Você gosta de programação de baixo nível, arquitetura de sistemas, eletrônica digital e resolução de problemas lógicos estruturais.",

    "Engenharia Mecânica":
        "Você gosta de física aplicada, modelagem 3D, termodinâmica, resistência dos materiais e da criação física de mecanismos e equipamentos.",

    "Engenharia Eletrônica":
        "Você gosta de soldagem, testes de bancada com componentes, eletromagnetismo, circuitos integrados e sistemas de sinal analógico e digital."
};

const formulario = document.getElementById("quiz-form");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

if (nextBtn) {
    nextBtn.addEventListener("click", proximaQuestao);
}

if (restartBtn) {
    restartBtn.addEventListener("click", reiniciarQuiz);
}

if (formulario) {
    formulario.addEventListener("change", function () {
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    });
}

function atualizarProgresso() {
    const progresso = document.getElementById("progresso-preenchido");

    if (!progresso) {
        return;
    }

    const porcentagem =
        ((QuestaoAtual - 1) / TotalQuestoes) * 100;

    progresso.style.width = porcentagem + "%";
}

function proximaQuestao() {
    const opcaoSelecionada = document.querySelector(
        `input[name="q${QuestaoAtual}"]:checked`
    );

    if (!opcaoSelecionada) {
        return;
    }

    if (QuestaoAtual === 1) {
        enviarEventoGA("quiz_iniciado", { curso: "mecatronica" });
    }

    atribuirPontos(opcaoSelecionada.value);

    const questaoAtualElemento = document.querySelector(
        `.container-questao[data-question="${QuestaoAtual}"]`
    );

    if (questaoAtualElemento) {
        questaoAtualElemento.classList.remove("active");
    }

    QuestaoAtual++;

    if (QuestaoAtual <= TotalQuestoes) {
        const proximaQuestaoElemento = document.querySelector(
            `.container-questao[data-question="${QuestaoAtual}"]`
        );

        if (proximaQuestaoElemento) {
            proximaQuestaoElemento.classList.add("active");
        }

        if (nextBtn) {
            nextBtn.disabled = true;
        }

        atualizarProgresso();
    } else {
        const progresso = document.getElementById(
            "progresso-preenchido"
        );

        if (progresso) {
            progresso.style.width = "100%";
        }

        if (nextBtn) {
            nextBtn.style.display = "none";
        }

        mostrarResultado();
    }
}

function atribuirPontos(valor) {
    switch (valor) {
        case "mecanica_manut":
            pontuacao["Engenharia Mecânica"] += 3;
            pontuacao["Manutenção Eletromecânica Avançada"] += 2;
            break;

        case "robotica_comp":
            pontuacao["Engenharia de Robótica"] += 3;
            pontuacao["Engenharia da Computação"] += 2;
            break;

        case "automacao":
            pontuacao["Automação e Controle Industrial"] += 5;
            break;

        case "producao":
            pontuacao["Engenharia de Produção"] += 5;
            break;

        case "eletronica_biomed":
            pontuacao["Engenharia Eletrônica"] += 3;
            pontuacao["Engenharia Biomédica e Equipamentos Hospitalares"] += 2;
            break;

        case "robotica":
            pontuacao["Engenharia de Robótica"] += 5;
            break;

        case "automacao_manufatura":
            pontuacao["Automação e Controle Industrial"] += 3;
            pontuacao["Manufatura Aditiva Industrial (Impressão 3D Avançada)"] += 2;
            break;

        case "biomedica":
            pontuacao["Engenharia Biomédica e Equipamentos Hospitalares"] += 5;
            break;

        case "veiculos":
            pontuacao["Engenharia de Veículos Autônomos e Elétricos"] += 5;
            break;

        case "impressao3d":
            pontuacao["Manufatura Aditiva Industrial (Impressão 3D Avançada)"] += 5;
            break;

        case "manutencao":
            pontuacao["Manutenção Eletromecânica Avançada"] += 5;
            break;

        case "pesquisa":
            pontuacao["Engenharia de Robótica"] += 3;
            pontuacao["Engenharia da Computação"] += 2;
            break;

        case "eletronica":
            pontuacao["Engenharia Eletrônica"] += 5;
            break;

        case "comp":
            pontuacao["Engenharia da Computação"] += 5;
            break;

        case "mecanica_cad":
            pontuacao["Engenharia Mecânica"] += 3;
            pontuacao["Manufatura Aditiva Industrial (Impressão 3D Avançada)"] += 2;
            break;

        case "robotica_automacao":
            pontuacao["Engenharia de Robótica"] += 3;
            pontuacao["Automação e Controle Industrial"] += 2;
            break;

        case "comp_ind4":
            pontuacao["Engenharia da Computação"] += 3;
            pontuacao["Automação e Controle Industrial"] += 2;
            break;

        case "fabrica":
            pontuacao["Automação e Controle Industrial"] += 3;
            pontuacao["Engenharia de Produção"] += 2;
            break;

        case "mecanica":
            pontuacao["Engenharia Mecânica"] += 5;
            break;
    }
}

function mostrarResultado() {
    let melhorArea = "";
    let maiorPontuacao = -1;

    for (let area in pontuacao) {
        if (pontuacao[area] > maiorPontuacao) {
            maiorPontuacao = pontuacao[area];
            melhorArea = area;
        }
    }

    if (formulario) {
        formulario.style.display = "none";
    }

    const containerResultado =
        document.getElementById("container-resultado");

    const resultTitle =
        document.getElementById("result-title");

    const resultDescription =
        document.getElementById("result-description");

    if (containerResultado) {
        containerResultado.style.display = "block";
    }

    if (resultTitle) {
        resultTitle.innerText = melhorArea;
    }

    if (resultDescription) {
        resultDescription.innerText =
            descricao[melhorArea] || "";
    }

    enviarEventoGA("quiz_finalizado", {
        curso: "mecatronica",
        resultado: melhorArea,
    });
}

function reiniciarQuiz() {
    QuestaoAtual = 1;

    if (formulario) {
        formulario.reset();
    }

    for (let area in pontuacao) {
        pontuacao[area] = 0;
    }

    const containerResultado =
        document.getElementById("container-resultado");

    if (containerResultado) {
        containerResultado.style.display = "none";
    }

    if (formulario) {
        formulario.style.display = "block";
    }

    if (nextBtn) {
        nextBtn.style.display = "block";
        nextBtn.disabled = true;
    }

    document.querySelectorAll(
        ".container-questao"
    ).forEach(function (elemento) {
        elemento.classList.remove("active");
    });

    const primeiraQuestao =
        document.querySelector(
            '.container-questao[data-question="1"]'
        );

    if (primeiraQuestao) {
        primeiraQuestao.classList.add("active");
    }

    atualizarProgresso();
}

atualizarProgresso();
