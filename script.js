
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


// ========== CARROSSEL DE FOTOS (COVERFLOW) ==========
const track = document.querySelector('.carouselTrack');
const cards = Array.from(document.querySelectorAll('.cardCarousel'));
const prevBtn = document.querySelector('.prevBtnCarousel');
const nextBtn = document.querySelector('.nextBtnCarousel');

const currentSlideElement = document.getElementById("currentSlide");
const totalSlidesElement = document.getElementById("totalSlides");

let currentIndex = 0;
const totalImages = cards.length;

const POSITION_CLASSES = ['is-prev2', 'is-prev', 'is-center', 'is-next', 'is-next2'];

if (totalSlidesElement) {
    totalSlidesElement.textContent = totalImages;
}

function updateCarousel() {
    cards.forEach((card, i) => {
        // Remove todas as classes de posição
        card.classList.remove(...POSITION_CLASSES);

        // Calcula offset circular em relação ao card central
        let offset = i - currentIndex;

        // Corrige para envolver circularmente no menor caminho
        if (offset > totalImages / 2)  offset -= totalImages;
        if (offset < -totalImages / 2) offset += totalImages;

        if      (offset === -2) card.classList.add('is-prev2');
        else if (offset === -1) card.classList.add('is-prev');
        else if (offset ===  0) card.classList.add('is-center');
        else if (offset ===  1) card.classList.add('is-next');
        else if (offset ===  2) card.classList.add('is-next2');
        // fora do range de ±2: nenhuma classe → fica invisível
    });

    if (currentSlideElement) {
        currentSlideElement.textContent = currentIndex + 1;
    }
}

function moveNext() {
    currentIndex = (currentIndex + 1) % totalImages;
    updateCarousel();
}

function movePrev() {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateCarousel();
}

// Clique nas fotos laterais avança/retrocede
cards.forEach((card, i) => {
    card.addEventListener('click', () => {
        if (card.classList.contains('is-prev') || card.classList.contains('is-prev2')) movePrev();
        if (card.classList.contains('is-next') || card.classList.contains('is-next2')) moveNext();
    });
});

// Inicializa
updateCarousel();

if (prevBtn) prevBtn.addEventListener('click', movePrev);
if (nextBtn) nextBtn.addEventListener('click', moveNext);

// Touch swipe
let startX = 0;
let endX = 0;

if (track) {
    track.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const threshold = 50;
        if (startX > endX + threshold) moveNext();
        if (startX < endX - threshold) movePrev();
    }, { passive: true });
}





// ========== INICIALIZAR BOTÃO VER MAIS ==========
function initSedesVerMais() {
  const sedesRow = document.getElementById("sedesBannerRow");
  const sedesWrap = document.querySelector(".sedesBannerWrap");
  const verMaisBtn = document.getElementById("sedesVerMaisBtn");
  const SEDES_VISIVEIS = 2;

  if (!sedesRow || !verMaisBtn) return;

  const banners = sedesRow.querySelectorAll(".sedeBanner");

  if (banners.length <= SEDES_VISIVEIS) {
    verMaisBtn.style.display = "none";
    sedesRow.classList.remove("is-expanded");
    sedesWrap?.classList.remove("is-expanded");
    return;
  }

  verMaisBtn.style.display = "block";

  verMaisBtn.replaceWith(verMaisBtn.cloneNode(true));

  const novoVerMaisBtn = document.getElementById("sedesVerMaisBtn");

  novoVerMaisBtn.addEventListener("click", () => {
    const expanded = sedesRow.classList.toggle("is-expanded");
    sedesWrap?.classList.toggle("is-expanded", expanded);
    verMaisBtn.setAttribute("aria-expanded", String(expanded));
    novoVerMaisBtn.textContent = expanded ? "ver menos" : "ver mais";
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
const API_URL = 'https://frontendteamscup.com.br/api/eventos/2/sedes-times';

async function carregarSedes() {
    const container = document.getElementById('sedesBannerRow');
    if (!container) {
        console.error('Container #sedesBannerRow não encontrado no HTML');
        return;
    }

    try {
        const response = await fetch(`${API_URL}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer frontendteamscup-front-token-2026'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const dados = await response.json();

        // TRATAMENTO DO RETORNO:
        // Garante que pega 'dados.sedes' se existir ou o próprio 'dados' se for um Array direto
        const sedes = Array.isArray(dados) ? dados : (dados.sedes || []);

        if (!sedes || sedes.length === 0) {
            console.warn('Nenhuma sede retornada da API');
            return;
        }

        const sedesFrag = document.createDocumentFragment();

        sedes.forEach(sede => {
            // Ignora itens com dados genéricos/mocks tipo "string" se desejar
            if (sede.nome_campus === 'string') return;

            let htmlDosTimes = '';
            
            if (sede.times && Array.isArray(sede.times)) {
                sede.times.forEach(time => {
                    
                    // 1. Mapeia os integrantes APENAS como texto (Nome e Função)
                    const htmlDosMembros = time.integrantes && Array.isArray(time.integrantes) && time.integrantes.length > 0
                        ? time.integrantes.map(membro => {
        
                            const formatarNome = (nomeCompleto) => {
                                if (!nomeCompleto) return '';
                                const excecoes = ['de', 'di', 'do', 'da', 'dos', 'das', 'e'];
                                return nomeCompleto
                                    .toLowerCase()
                                    .split(' ')
                                    .filter(palavra => palavra !== '')
                                    .map((palavra, index) => {
                                        if (excecoes.includes(palavra) && index > 0) return palavra;
                                        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
                                    })
                                    .join(' ');
                            };

                            const formatarFuncao = (funcao) => {
                                if (!funcao) return 'Membro';
                                const f = funcao.trim().toLowerCase();
                                if (f === 'líder' || f === 'lider') return 'Líder';
                                if (f === 'membro' || f === 'integrante') return 'Membro';
                                return funcao;
                            };

                            return `
                                <li>
                                    <strong>${formatarNome(membro.nome)}</strong> 
                                    <small>(${formatarFuncao(membro.funcao)})</small>
                                </li>
                            `;
                    }).join('')
                    : '<li>Nenhum integrante cadastrado</li>';
                    
                    htmlDosTimes += `
                        <div class="team">
                            <h4>${time.nome}</h4>
                            <ul>
                                ${htmlDosMembros}
                            </ul>
                        </div>
                    `;
                });
            }

            // 2. Cria o Card principal da Sede (com imagem inclusa)
            const article = document.createElement('article');
            article.className = 'sedeBanner';
            article.setAttribute('role', 'listitem');

            // Caso a API envie o link da imagem, aplicamos como fundo ou imagem de destaque
            const imagemSede = sede.imagem_sede || '';

            article.innerHTML = `
                <div class="sedeBannerBody">
                    <h3 class="sedeBannerName">${sede.nome_campus || `${sede.instituicao} - Campus ${sede.campus}`}</h3>
                    <p class="sedeBannerInstitution"><i class="fa-solid fa-building"></i> ${sede.instituicao}</p>
                    <p class="sedeBannerMeta"><i class="fa-solid fa-location-dot"></i> ${sede.uf}</p>
                    <p class="sedeBannerCity">${sede.local || sede.cidade}</p>
                    <div class="sedeBannerTeamsCounter">
                        <span class="teamsCount">${sede.quantidade_times || (sede.times ? sede.times.length : 0)} times</span>
                    </div>
                    ${sede.imagem_sede ? `
                        <div class="sedeBannerThumb">
                            <img src="${sede.imagem_sede}" alt="${sede.nome_campus}">
                        </div>
                    ` : ''}
                </div>
                <div class="sedeBannerTeams">
                    ${htmlDosTimes}
                </div>
            `;

            sedesFrag.appendChild(article);
        });

        container.innerHTML = '';
        container.appendChild(sedesFrag);

        // Reinicializa as interações da página
        if (typeof initTeamsToggle === 'function') initTeamsToggle();
        if (typeof initSedesVerMais === 'function') initSedesVerMais();
        if (typeof initBusca === 'function') initBusca();

    } catch (error) {
        console.error('Erro ao carregar as sedes da API:', error);
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
            const instituicao = card.querySelector('.sedeBannerInstitution')?.textContent.toLowerCase() || '';
            const localidade = card.querySelector('.sedeBannerCity')?.textContent.toLowerCase() || '';
            const estadoLocalidade = card.querySelector('.sedeBannerMeta')?.textContent.toLowerCase() || '';

            if (nome.includes(termoBuscar) || instituicao.includes(termoBuscar) || localidade.includes(termoBuscar) || estadoLocalidade.includes(termoBuscar)) {
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


// ========== CARROSSEL DE TUTORIAL ==========
const tracktutorial = document.querySelector('.tutoriaisCarouselTrack');
const cardstutorial = document.querySelectorAll('.tutorialCard');
const prevBtntutorial = document.querySelector('.prevBtnTutorial');
const nextBtntutorial = document.querySelector('.nextBtnTutorial');

const currentSlideElementtutorial = document.getElementById("currentTutorial");
const totalSlidesElementtutorial = document.getElementById("totalTutorials")

let currentIndextutorial = 0;
const totalImagestutorial = cardstutorial.length;

if (totalSlidesElementtutorial) {
    totalSlidesElementtutorial.textContent = totalImagestutorial;
}

function moveNexttutorial() {
    tracktutorial.style.opacity = 0; 
    
    setTimeout(() => {
        const firstCardtutorial = tracktutorial.children[0];
        tracktutorial.appendChild(firstCardtutorial);
        currentIndextutorial = (currentIndextutorial + 1) % totalImagestutorial;

        updateCountertutorial();
        
        tracktutorial.style.opacity = 1; 
    }, 0);
}

function movePrevtutorial() {
    const lastCardtutorial = tracktutorial.children[tracktutorial.children.length - 1];
    tracktutorial.prepend(lastCardtutorial);
    currentIndextutorial = (currentIndextutorial - 1 + totalImagestutorial) % totalImagestutorial;
    updateCountertutorial();
}

function updateCountertutorial() {
    if (currentSlideElementtutorial) {
        currentSlideElementtutorial.textContent = currentIndextutorial + 1;
    }
}

updateCountertutorial();

if (prevBtntutorial) prevBtntutorial.addEventListener('click', movePrevtutorial);
if (nextBtntutorial) nextBtntutorial.addEventListener('click', moveNexttutorial);


let startXtutorial = 0;
let endXtutorial = 0;

if (tracktutorial) {
    tracktutorial.addEventListener('touchstart', (e) => {
        startXtutorial = e.changedTouches[0].clientX;
    }, false);

    tracktutorial.addEventListener('touchend', (e) => {
        endXtutorial = e.changedTouches[0].clientX;
        const threshold = 50;
        
        if (startXtutorial > endXtutorial + threshold) {
            moveNexttutorial();
        }
        if (startXtutorial < endXtutorial - threshold) {
            movePrevtutorial();
        }
    }, false);
}

// ========== INICIALIZAR BOTÃO VER MAIS (DESENVOLVEDORES) ==========
function initDevsVerMais() {
  const devTrack = document.getElementById("devTrack");
  const devWrap = document.getElementById("devWrap");
  const verMaisBtn = document.getElementById("devVerMaisBtn");
  
  // Define quantos cards formam a primeira linha (já que seu grid tem 5 colunas)
  const DEVS_VISIVEIS = 5; 

  if (!devTrack || !verMaisBtn) return;

  const cards = devTrack.querySelectorAll(".devCard");
  
  // Se tiver 5 ou menos desenvolvedores, esconde o botão "Ver mais"
  if (cards.length <= DEVS_VISIVEIS) {
    verMaisBtn.hidden = true;
    return;
  }

  verMaisBtn.addEventListener("click", () => {
    const expanded = devTrack.classList.toggle("is-expanded");
    if (devWrap) {
        devWrap.classList.toggle("is-expanded", expanded);
    }
    verMaisBtn.setAttribute("aria-expanded", String(expanded));
    verMaisBtn.textContent = expanded ? "ver menos" : "ver mais";
  });
}

// Não esqueça de chamar a função para ela rodar!
initDevsVerMais();

function initOrgaVerMais(){
    const orgGrid = document.querySelector(".organizadoresGrid");
    const btnOrg = document.getElementById("btnOrgVer");

    const limite = 4;

    if (!orgGrid || !btnOrg) return;

    const cardsOrg = document.querySelectorAll(".organizadorCard");

    if(cardsOrg <= limite){
        btnOrg.hidden = true;
        return
    }

    btnOrg.addEventListener('click', () => {
        const expanded = orgGrid.classList.toggle("is-expanded");

        btnOrg.setAttribute("aria-expanded", String(expanded));
        btnOrg.textContent = expanded ? "ver menos" : "ver mais";
    })}


initOrgaVerMais();

// ========== FUNCIONALIDADE VER MAIS PARA BLOCOS DE HISTÓRIA ==========
function initHistoryVerMais() {
  const historyBtns = document.querySelectorAll('.historyBlockBtnMais');
  
  historyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Encontra o container de texto mais próximo
      const textContent = btn.previousElementSibling;
      
      if (textContent && textContent.classList.contains('historyBlockTextContent')) {
        const isExpanded = textContent.classList.contains('expanded');
        
        // Toggle da classe expanded
        textContent.classList.toggle('expanded');
        
        // Muda o texto do botão
        btn.textContent = isExpanded ? 'VER MAIS' : 'VER MENOS';
        btn.classList.toggle('active', !isExpanded);
        
        // Smooth scroll suave para o elemento (opcional)
        if (!isExpanded) {
          textContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  });
}

// Executa quando o DOM está pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHistoryVerMais);
} else {
  initHistoryVerMais();
}