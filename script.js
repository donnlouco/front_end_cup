// Defina a data do evento aqui
const eventDate = new Date("Jun 15, 2026 00:00:00").getTime();

const updateCountdown = setInterval(function() {
  const now = new Date().getTime();
  const distance = eventDate - now;

  // Cálculos matemáticos para dias, horas, minutos e segundos
  const d = Math.floor(distance / (1000 * 60 * 60 * 24));
  const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((distance % (1000 * 60)) / 1000);

  // Inserindo os resultados nos elementos HTML
  document.getElementById("days").innerText = d;
  document.getElementById("hours").innerText = h;
  document.getElementById("minutes").innerText = m;
  document.getElementById("seconds").innerText = s;

  // Se a contagem terminar
  if (distance < 0) {
    clearInterval(updateCountdown);
    document.querySelector(".timer").innerHTML = "<h3>O evento começou!</h3>";
  }
}, 1000);



window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");

    if (window.scrollY > 650) {
        header.classList.add("scrolled");
    }
    else{
        header.classList.remove("scrolled");
    }
})


const track = document.querySelector('.carouselTrack');
const cards = document.querySelectorAll('.cardCarousel');
const prevBtn = document.querySelector('.prevBtnCarousel');
const nextBtn = document.querySelector('.nextBtnCarousel');
const dots = document.querySelectorAll('.indicatorsCarousel span');

// Mantenha o índice atual
let currentIndex = 0;
const totalImages = cards.length;

// Função principal para mover e atualizar
function moveNext() {
    // Move fisicamente a imagem
    const firstCard = track.children[0];
    track.appendChild(firstCard);

    // Atualiza o índice lógico
    currentIndex = (currentIndex + 1) % totalImages;
    updateDots();
}

function movePrev() {
    // Move fisicamente a imagem
    const lastCard = track.children[track.children.length - 1];
    track.prepend(lastCard);

    // Atualiza o índice lógico
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateDots();
}

function updateDots() {
    // O JS move as imagens na DOM, mas o index lógico se mantém.
    // Usamos o currentIndex para destacar o pontinho certo.
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// === Adicionando a Suavização (Animação opcional ao JS) ===
// Nota: O CSS já suaviza as imagens em si, mas a animação de "rolagem" 
// é difícil de replicar no JS quando reposicionamos elementos fisicamente.
// Para uma rolagem suave em loop, o layout de grid *sem* scroll é o ideal.
// Vamos fazer os indicadores (dots) causarem uma animação de fade suave.

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        // Aplica fade-out
        track.style.opacity = 0;
        track.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            // Enquanto invisível, reorganize as imagens na DOM
            // até que a imagem correspondente ao 'index' seja a primeira visível.
            
            // Este é um algoritmo complexo de reorganização de DOM.
            // Para simplicidade, vamos usar o movimento direto.
            
            // Ex: Se clicou no pontinho 3, temos que girar a DOM 
            // 'n' vezes até que a imagem 3 seja a 1ª.
            
            let rotationNeeded = (index - currentIndex + totalImages) % totalImages;
            for(let i = 0; i < rotationNeeded; i++) {
                const firstCard = track.children[0];
                track.appendChild(firstCard);
            }
            
            currentIndex = index;
            updateDots();
            
            // Aplica fade-in
            track.style.opacity = 1;
            track.style.transform = 'scale(1)';
        }, 200); // tempo que o elemento fica invisível
    });
});

// === Eventos ===
nextBtn.addEventListener('click', moveNext);
prevBtn.addEventListener('click', movePrev);

// === Suporte a Toque (Swipe) para Mobile ===
let startX = 0;
let endX = 0;

track.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].clientX;
}, false);

track.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const threshold = 50; // Distância mínima para registrar o swipe
    
    // Swipe para a esquerda = próxima imagem
    if (startX > endX + threshold) {
        moveNext();
    }
    // Swipe para a direita = imagem anterior
    if (startX < endX - threshold) {
        movePrev();
    }
}, false);

// Inicializa
updateDots();

(function initSedesVerMais() {
  const sedesRow = document.getElementById("sedesBannerRow");
  const sedesWrap = document.querySelector(".sedesBannerWrap");
  const verMaisBtn = document.getElementById("sedesVerMaisBtn");
  const SEDES_VISIVEIS = 4;

  if (!sedesRow || !verMaisBtn) return;

  const banners = sedesRow.querySelectorAll(".sedeBanner");
  if (banners.length <= SEDES_VISIVEIS) {
    verMaisBtn.hidden = true;
    return;
  }

  verMaisBtn.addEventListener("click", () => {
    const expanded = sedesRow.classList.toggle("is-expanded");
    sedesWrap?.classList.toggle("is-expanded", expanded);
    verMaisBtn.setAttribute("aria-expanded", String(expanded));
    verMaisBtn.textContent = expanded ? "ver menos" : "ver mais";
  });
})();

// Times: expandir/colapsar ao clicar no banner
(function initTeamsToggle() {
  const banners = document.querySelectorAll(".sedeBanner");
  
  banners.forEach(banner => {
    const counter = banner.querySelector(".sedeBannerTeamsCounter");
    const teamsContainer = banner.querySelector(".sedeBannerTeams");
    const teamsCountSpan = banner.querySelector(".teamsCount");
    
    if (!counter || !teamsContainer) return;
    
    // Contar automaticamente os times
    const teamCount = teamsContainer.querySelectorAll(".team").length;
    if (teamsCountSpan) {
      teamsCountSpan.textContent = `${teamCount} time${teamCount !== 1 ? 's' : ''}`;
    }
    
    counter.addEventListener("click", (e) => {
      e.stopPropagation();
      teamsContainer.classList.toggle("active");
    });
    
    // Também permitir clicar em qualquer lugar do banner
    banner.addEventListener("click", () => {
      teamsContainer.classList.toggle("active");
    });
  });
})();