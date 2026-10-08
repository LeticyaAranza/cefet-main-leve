let QuestaoAtual = 1;
const TotalQuestoes = 5;

function enviarEventoGA(nome, parametros) {
    if (typeof gtag === "function") {
        gtag("event", nome, parametros);
    }
}

const pontuacao = {
    "Projeto Arquitetônico e Desenho Técnico": 0,
    "Estruturas e Resistência dos Materiais": 0,
    "Gerenciamento de Obras e Orçamento": 0,
    "Topografia e Geodésia Aplicada": 0,
    "Instalações Prediais (Hidrossanitárias e Elétricas)": 0,
    "Patologia das Construções e Perícias": 0,
    "Construção Sustentável e Eficiência Energética": 0
};

const descricao = {
    "Projeto Arquitetônico e Desenho Técnico":
        "Você tem grande afinidade com a criação estética e funcional dos espaços. Gosta de desenhar, planejar plantas baixas, volumetrias e garantir que os ambientes atendam perfeitamente às necessidades dos usuários.",

    "Estruturas e Resistência dos Materiais":
        "Você possui um perfil analítico e voltado para a solidez das obras. Gosta de calcular cargas, entender o comportamento do concreto e do aço, e garantir a segurança estrutural de ponta a ponta.",

    "Gerenciamento de Obras e Orçamento":
        "Você tem forte aptidão para liderança, planejamento estratégico e controle financeiro. Gosta de organizar cronogramas, coordenar equipes e garantir que a obra saia no prazo e sem desperdícios.",

    "Topografia e Geodésia Aplicada":
        "Você gosta de precisão técnica e de trabalhos práticos externos. Tem facilidade com medições de terrenos, orientações espaciais e nivelamentos essenciais para iniciar qualquer construção.",

    "Instalações Prediais (Hidrossanitárias e Elétricas)":
        "Você se interessa pela infraestrutura interna que dá vida ao edifício. Gosta de estudar o fluxo de água, esgoto, eletricidade e sistemas que garantem o conforto e a habitabilidade do imóvel.",

    "Patologia das Construções e Perícias":
        "Você age como um 'investigador' da construção civil. Gosta de identificar a raiz de falhas, trincas, umidade e desgastes em edificações antigas ou mal executadas, propondo soluções corretivas eficazes.",

    "Construção Sustentável e Eficiência Energética":
        "Você se preocupa com o futuro do planeta e com inovações na construção civil. Gosta de pesquisar materiais ecológicos, aproveitamento de recursos naturais e redução do impacto ambiental dos edifícios."
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

    const opcaoSelecionada = document.querySelector(
        `input[name="q${QuestaoAtual}"]:checked`
    );

    if (!opcaoSelecionada) {
        return;
    }

    if (QuestaoAtual === 1) {
        enviarEventoGA("quiz_iniciado", {
            curso: "edificacoes"
        });
    }

    atribuirPontos(opcaoSelecionada.value);

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

        case "arq":
        case "arq_desenho":
            pontuacao["Projeto Arquitetônico e Desenho Técnico"] += 5;
            break;

        case "struct_geo":
        case "struct":
            pontuacao["Estruturas e Resistência dos Materiais"] += 3;
            pontuacao["Topografia e Geodésia Aplicada"] += 2;
            break;

        case "inst":
            pontuacao["Instalações Prediais (Hidrossanitárias e Elétricas)"] += 5;
            break;

        case "sustainability":
            pontuacao["Construção Sustentável e Eficiência Energética"] += 5;
            break;

        case "gestao":
        case "gestao_orc":
        case "gestao_canteiro":
            pontuacao["Gerenciamento de Obras e Orçamento"] += 5;
            break;

        case "topo":
            pontuacao["Topografia e Geodésia Aplicada"] += 5;
            break;

        case "patologia":
            pontuacao["Patologia das Construções e Perícias"] += 5;
            break;

        case "struct_patologia":
            pontuacao["Estruturas e Resistência dos Materiais"] += 3;
            pontuacao["Patologia das Construções e Perícias"] += 2;
            break;

        case "topo_inst":
            pontuacao["Topografia e Geodésia Aplicada"] += 3;
            pontuacao["Instalações Prediais (Hidrossanitárias e Elétricas)"] += 2;
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

    // Mostra o resultado
    document.getElementById("container-resultado").style.display = "block";

    document.getElementById("result-title").innerText = melhorArea;

    document.getElementById("result-description").innerText =
        descricao[melhorArea];

    enviarEventoGA("quiz_finalizado", {
        curso: "edificacoes",
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
