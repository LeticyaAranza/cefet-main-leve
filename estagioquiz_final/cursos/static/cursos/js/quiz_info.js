let QuestaoAtual = 1;
const TotalQuestoes = 5;

function enviarEventoGA(nome, parametros) {
    if (typeof gtag === "function") {
        gtag("event", nome, parametros);
    }
}

const pontuacao = {
    "Desenvolvimento de Software / Web e Mobile": 0,
    "Redes de Computadores e Infraestrutura": 0,
    "Cibersegurança": 0,
    "Banco de Dados": 0,
    "Hardware e Suporte Técnico": 0,
    "Inteligência Artificial e Ciência de Dados": 0,
    "Computação em Nuvem (Cloud Computing)": 0,
    "Internet das Coisas (IoT)": 0,
    "DevOps e Engenharia de Confiabilidade": 0,
    "Gestão de Projetos e Metodologias Ágeis": 0
};

const descricao = {
    "Desenvolvimento de Software / Web e Mobile":
        "Você gosta de criar coisas do zero, ver o resultado visual na tela, programar lógica de sistemas e construir aplicativos ou sites que as pessoas usam diretamente.",

    "Redes de Computadores e Infraestrutura":
        "Você tem interesse em como as coisas se conectam, garantindo tráfego estável de dados, cabos, roteadores e sistemas funcionando sem quedas.",

    "Cibersegurança":
        "Você tem o perfil de um investigador digital, focado em proteger sistemas, antecipar riscos, caçar falhas e blindar informações contra ataques virtuais.",

    "Banco de Dados":
        "Você gosta de organização estruturada de grandes volumes de informação, garantindo que consultas sejam rápidas, seguras e que os dados nunca se percam.",

    "Hardware e Suporte Técnico":
        "Você gosta do mundo físico da tecnologia: montar computadores, lidar com peças eletrônicas, resolver problemas práticos e ajudar diretamente os usuários.",

    "Inteligência Artificial e Ciência de Dados":
        "Você tem afinidade com lógica analítica, estatística e em transformar números e dados brutos em previsões inteligentes e soluções automatizadas.",

    "Computação em Nuvem (Cloud Computing)":
        "Você gosta de pensar grande, gerenciando servidores virtuais, arquiteturas escaláveis e recursos tecnológicos globais hospedados na internet.",

    "Internet das Coisas (IoT)":
        "Você adora misturar o mundo físico com o digital, programando microcontroladores e conectando sensores e objetos do dia a dia à rede.",

    "DevOps e Engenharia de Confiabilidade":
        "Você foca em automação e eficiência, criando pontes automatizadas para que softwares e infraestruturas rodem de forma estável e contínua.",

    "Gestão de Projetos e Metodologias Ágeis":
        "Você tem forte aptidão para liderança, organização de equipes, planejamento de prazos e alinhamento estratégico para que os projetos saiam do papel com sucesso."
};


const formulario = document.getElementById("quiz-form");

const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

nextBtn.addEventListener("click", proximaQuestao);
restartBtn.addEventListener("click", reiniciarQuiz);


// Ativa o botão quando uma alternativa for selecionada
formulario.addEventListener("change", () => {
    document.getElementById("next-btn").disabled = false;
});


function atualizarProgresso() {

    const porcentagem =
        ((QuestaoAtual - 1) / TotalQuestoes) * 100;

    document.getElementById("progresso-preenchido").style.width =
        porcentagem + "%";
}


function proximaQuestao() {

    if (QuestaoAtual === 1) {
        enviarEventoGA("quiz_iniciado", { curso: "informatica" });
    }

    const opcaoSelecionada = document.querySelector(
        `input[name="q${QuestaoAtual}"]:checked`
    );

    if (opcaoSelecionada) {
        atribuirPontos(opcaoSelecionada.value);
    }

    document
        .querySelector(
            `.container-questao[data-question="${QuestaoAtual}"]`
        )
        .classList.remove("active");

    QuestaoAtual++;

    if (QuestaoAtual <= TotalQuestoes) {

        document
            .querySelector(
                `.container-questao[data-question="${QuestaoAtual}"]`
            )
            .classList.add("active");


        document.getElementById("next-btn").disabled = true;

        atualizarProgresso();

    } else {

        document.getElementById("progresso-preenchido").style.width = "100%";

        document.getElementById("next-btn").style.display = "none";

        mostrarResultado();
    }
}

function atribuirPontos(valor) {

    switch (valor) {

        case "dev":
            pontuacao["Desenvolvimento de Software / Web e Mobile"] += 5;
            break;

        case "sec_db":
            pontuacao["Cibersegurança"] += 3;
            pontuacao["Banco de Dados"] += 2;
            break;

        case "net_hw":
            pontuacao["Redes de Computadores e Infraestrutura"] += 3;
            pontuacao["Hardware e Suporte Técnico"] += 2;
            break;

        case "ai":
            pontuacao["Inteligência Artificial e Ciência de Dados"] += 5;
            break;

        case "gestao":
            pontuacao["Gestão de Projetos e Metodologias Ágeis"] += 5;
            break;

        case "hw":
            pontuacao["Hardware e Suporte Técnico"] += 5;
            break;

        case "net":
            pontuacao["Redes de Computadores e Infraestrutura"] += 5;
            break;

        case "dev_devops":
            pontuacao["Desenvolvimento de Software / Web e Mobile"] += 3;
            pontuacao["DevOps e Engenharia de Confiabilidade"] += 2;
            break;

        case "iot":
            pontuacao["Internet das Coisas (IoT)"] += 5;
            break;

        case "hw_iot":
            pontuacao["Hardware e Suporte Técnico"] += 3;
            pontuacao["Internet das Coisas (IoT)"] += 2;
            break;

        case "cloud_devops":
            pontuacao["Computação em Nuvem (Cloud Computing)"] += 3;
            pontuacao["DevOps e Engenharia de Confiabilidade"] += 2;
            break;

        case "dev_cloud":
            pontuacao["Desenvolvimento de Software / Web e Mobile"] += 3;
            pontuacao["Computação em Nuvem (Cloud Computing)"] += 2;
            break;

        case "support_gestao":
            pontuacao["Hardware e Suporte Técnico"] += 3;
            pontuacao["Gestão de Projetos e Metodologias Ágeis"] += 2;
            break;

        case "net_hw_iot":
            pontuacao["Redes de Computadores e Infraestrutura"] += 2;
            pontuacao["Hardware e Suporte Técnico"] += 2;
            pontuacao["Internet das Coisas (IoT)"] += 1;
            break;

        case "sec":
            pontuacao["Cibersegurança"] += 5;
            break;

        case "net_cloud_devops":
            pontuacao["Redes de Computadores e Infraestrutura"] += 2;
            pontuacao["Computação em Nuvem (Cloud Computing)"] += 2;
            pontuacao["DevOps e Engenharia de Confiabilidade"] += 1;
            break;

        case "ai_db":
            pontuacao["Inteligência Artificial e Ciência de Dados"] += 3;
            pontuacao["Banco de Dados"] += 2;
            break;

        case "iot_hw":
            pontuacao["Internet das Coisas (IoT)"] += 3;
            pontuacao["Hardware e Suporte Técnico"] += 2;
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

    formulario.style.display = "none";
//mostra o resultado
    document.getElementById("container-resultado").style.display = "block";

    document.getElementById("result-title").innerText = melhorArea;

    document.getElementById("result-description").innerText =
        descricao[melhorArea];

    enviarEventoGA("quiz_finalizado", {
        curso: "informatica",
        resultado: melhorArea,
    });
}

function reiniciarQuiz() {

    QuestaoAtual = 1;
    formulario.reset();

    for (let area in pontuacao) {
        pontuacao[area] = 0;
    }

    document.getElementById("container-resultado").style.display = "none";

    formulario.style.display = "block";

    document.getElementById("next-btn").style.display = "block";

    document.getElementById("next-btn").disabled = true;

    // Esconde todas as questões
    document.querySelectorAll(".container-questao").forEach(elemento => {
        elemento.classList.remove("active");
    });

    // Mostra a primeira questão
    document
        .querySelector('.container-questao[data-question="1"]')
        .classList.add("active");


    atualizarProgresso();
}


atualizarProgresso();