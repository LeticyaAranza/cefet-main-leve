const header = document.getElementById("header");
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

let ultimaPosicao = window.scrollY;

window.addEventListener("scroll", () => {
    const posicaoAtual = window.scrollY;

    if (posicaoAtual > ultimaPosicao && posicaoAtual > 100) {
        header.classList.add("hide");
    } else {
        header.classList.remove("hide");
    }

    ultimaPosicao = posicaoAtual;
});

if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
        const aberto = menu.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", aberto ? "true" : "false");
        menuToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menu.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menu");
        });
    });
}
