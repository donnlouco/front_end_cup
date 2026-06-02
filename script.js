// ========== COUNTDOWN ==========
const eventDate = new Date("Jun 15, 2026 00:00:00").getTime();

const updateCountdown = setInterval(function() {
  const now = new Date().getTime();
  const distance = eventDate - now;

  const d = Math.floor(distance / (1000 * 60 * 60 * 24));
  const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = d;
  document.getElementById("hours").innerText = h;
  document.getElementById("minutes").innerText = m;
  document.getElementById("seconds").innerText = s;

  if (distance < 0) {
    clearInterval(updateCountdown);
    document.querySelector(".timer").innerHTML = "<h3>O evento começou!</h3>";
  }
}, 1000);

// ========== HEADER SCROLL ==========
window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    const leftheader = document.querySelector(".leftHeader");
    const titulo = document.querySelector(".titulo-header-fixo")
    if (window.scrollY > 650) {
        header.classList.add("scrolled");
        leftheader.classList.add("scrolled");
        titulo.classList.add("scrolled");

    } else {
        header.classList.remove("scrolled");
        leftheader.classList.remove("scrolled");
        titulo.classList.remove("scrolled");

    }
});


// ========== CARROSSEL DE FOTOS ==========
const track = document.querySelector('.carouselTrack');
const cards = document.querySelectorAll('.cardCarousel');
const prevBtn = document.querySelector('.prevBtnCarousel');
const nextBtn = document.querySelector('.nextBtnCarousel');

const currentSlideElement = document.getElementById("currentSlide");
const totalSlidesElement = document.getElementById("totalSlides")

let currentIndex = 0;
const totalImages = cards.length;

if (totalSlidesElement) {
    totalSlidesElement.textContent = totalImages;
}

function moveNext() {
    track.style.opacity = 0; 
    
    setTimeout(() => {
        const firstCard = track.children[0];
        track.appendChild(firstCard);
        currentIndex = (currentIndex + 1) % totalImages;

        updateCounter();
        
        track.style.opacity = 1; 
    }, 0);
}

function movePrev() {
    const lastCard = track.children[track.children.length - 1];
    track.prepend(lastCard);
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateCounter();
}

function updateCounter() {
    if (currentSlideElement) {
        currentSlideElement.textContent = currentIndex + 1;
    }
}

updateCounter();

if (prevBtn) prevBtn.addEventListener('click', movePrev);
if (nextBtn) nextBtn.addEventListener('click', moveNext);


let startX = 0;
let endX = 0;

if (track) {
    track.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].clientX;
    }, false);

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const threshold = 50;
        
        if (startX > endX + threshold) {
            moveNext();
        }
        if (startX < endX - threshold) {
            movePrev();
        }
    }, false);
}





// ========== INICIALIZAR BOTÃO VER MAIS ==========
function initSedesVerMais() {
  const sedesRow = document.getElementById("sedesBannerRow");
  const sedesWrap = document.querySelector(".sedesBannerWrap");
  const verMaisBtn = document.getElementById("sedesVerMaisBtn");
  const SEDES_VISIVEIS = 3;

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
}

// ========== INICIALIZAR TOGGLES DE TIMES ==========
function initTeamsToggle() {
  const banners = document.querySelectorAll(".sedeBanner");
  
  banners.forEach(banner => {
    const counter = banner.querySelector(".sedeBannerTeamsCounter");
    const teamsContainer = banner.querySelector(".sedeBannerTeams");
    const teamsCountSpan = banner.querySelector(".teamsCount");
    
    if (!counter || !teamsContainer) return;
    
    const teamCount = teamsContainer.querySelectorAll(".team").length;
    if (teamsCountSpan) {
      teamsCountSpan.textContent = `${teamCount} time${teamCount !== 1 ? 's' : ''}`;
    }
    
    const toggleTeams = (e) => {
      e.preventDefault();
      e.stopPropagation(); // Impede que o clique suba ou duplique
      teamsContainer.classList.toggle("active");
    };

    // Ouvindo o clique no contador de times
    counter.addEventListener("click", toggleTeams);
    
    // Se o usuário clicar no corpo do banner (mas não nos times em si)
    banner.addEventListener("click", (e) => {
      // Evita fechar o menu se o usuário clicar dentro da lista de times já aberta
      if (!teamsContainer.contains(e.target) && e.target !== counter) {
        toggleTeams(e);
      }
    });
  });
}


// ========== CARREGAR SEDES E TIMES DA API ===========
const API_URL = 'http://localhost:8000/api';

async function carregarSedes() {
    // 1. Valida se o container existe
    const container = document.getElementById('sedesBannerRow');
    if (!container) {
        console.error('Container #sedesBannerRow não encontrado no HTML');
        return;
    }

    try {
        // 2. Faz a requisição com headers apropriados
        const response = await fetch(`${API_URL}/sedes`, {
            headers: { 'Content-Type': 'application/json' }
        });

        // 3. Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const sedes = await response.json();

        // 4. Valida se recebeu dados
        if (!sedes || sedes.length === 0) {
            console.warn('Nenhuma sede retornada da API');
            return;
        }

        // 5. Cria um container temporário para as sedes
        const sedesFrag = document.createDocumentFragment();

        // 6. Percorre cada sede vinda do banco de dados
        sedes.forEach(sede => {
            
            // 6. Monta o HTML dos times
            let htmlDosTimes = '';
            sede.times.forEach(time => {
                // Cria as tags <li> para cada membro do time
                const htmlDosMembros = time.membros.map(membro => `<li>${membro}</li>`).join('');
                
                // Monta o bloquinho do time
                htmlDosTimes += `
                    <div class="team">
                        <h4>${time.nome}</h4>
                        <ul>
                            ${htmlDosMembros}
                        </ul>
                    </div>
                `;
            });

            // 7. Cria o "Card" (article) principal da sede
            const article = document.createElement('article');
            article.className = 'sedeBanner';
            article.setAttribute('role', 'listitem');

            // 8. Injeta o HTML da Sede e embute os times
            article.innerHTML = `
                <div class="sedeBannerBody">
                    <h3 class="sedeBannerName">${sede.nome_campus}</h3>
                    <p class="sedeBannerMeta"><i class="fa-solid fa-location-dot"></i> ${sede.local}</p>
                    <div class="sedeBannerTeamsCounter">
                        <span class="teamsCount">${sede.quantidade_times} times</span>
                    </div>
                </div>
                <div class="sedeBannerTeams">
                    ${htmlDosTimes}
                </div>
            `;

            // 10. Adiciona o artigo no fragment
            sedesFrag.appendChild(article);
        });

        // 11. SÓ AGORA limpa o container e injeta todos os dados de uma vez
        container.innerHTML = '';
        container.appendChild(sedesFrag);

        // 12. Reinicializa os listeners após carregar os dados
        initTeamsToggle();
        initSedesVerMais();
        
        // 13. Inicializa a busca com os dados carregados
        initBusca();

    } catch (error) {
        // Se houver erro, mantém os dados estáticos (não limpa, não mostra erro)
        console.error('Erro ao carregar as sedes da API:', error);
        // Apenas loga o erro no console para debug, sem afetar a página
    }
}

// ========== FUNÇÃO DE BUSCA ==========
function initBusca() {
    const buscaCampo = document.getElementById("campoBusca");
    if (!buscaCampo) return;

    buscaCampo.addEventListener("input", () => {
        const termoBuscar = buscaCampo.value.toLowerCase().trim();
        const sedes = document.querySelectorAll('.sedeBanner'); // ← Pega os cards ATUAIS

        sedes.forEach((card) => {
            const nome = card.querySelector('.sedeBannerName')?.textContent.toLowerCase() || '';
            const cidade = card.querySelector('.sedeBannerMeta')?.textContent.toLowerCase() || '';

            if (nome.includes(termoBuscar) || cidade.includes(termoBuscar)) {
                card.classList.remove('esconderCard');
            } else {
                card.classList.add('esconderCard');
                // IMPORTANTE: Se o card for escondido, fechamos os times dele
                const teamsContainer = card.querySelector(".sedeBannerTeams");
                teamsContainer?.classList.remove("active");
            }
        });
    });
}

// 14. Executa assim que a página carregar
document.addEventListener('DOMContentLoaded', () => {
    // Primeiro inicializa os listeners para dados estáticos
    initTeamsToggle();
    initSedesVerMais();
    initBusca();
    
    // Depois tenta carregar dados da API (que vai reinicializar os listeners)
    carregarSedes();
});