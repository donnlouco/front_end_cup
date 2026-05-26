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
    if (window.scrollY > 650) {
        header.classList.add("scrolled");
        leftheader.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
        leftheader.classList.remove("scrolled");
    }
});


// ========== CARROSSEL DE FOTOS ==========
const track = document.querySelector('.carouselTrack');
const cards = document.querySelectorAll('.cardCarousel');
const prevBtn = document.querySelector('.prevBtnCarousel');
const nextBtn = document.querySelector('.nextBtnCarousel');
const dots = document.querySelectorAll('.indicatorsCarousel span');

let currentIndex = 0;
const totalImages = cards.length;

function moveNext() {
    track.style.opacity = 0; 
    
    // 2. Espera os 300ms para trocar a imagem enquanto está invisível
    setTimeout(() => {
        const firstCard = track.children[0];
        track.appendChild(firstCard);
        currentIndex = (currentIndex + 1) % totalImages;
        updateDots();
        
        // 3. Volta a opacidade para exibir a nova imagem suavemente
        track.style.opacity = 1; 
    }, 300);
}

function movePrev() {
    const lastCard = track.children[track.children.length - 1];
    track.prepend(lastCard);
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateDots();
}

function updateDots() {
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

updateDots();

if (prevBtn) prevBtn.addEventListener('click', movePrev);
if (nextBtn) nextBtn.addEventListener('click', moveNext);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        track.style.opacity = 0;
        
        setTimeout(() => {
            let rotationNeeded = (index - currentIndex + totalImages) % totalImages;
            for(let i = 0; i < rotationNeeded; i++) {
                const firstCard = track.children[0];
                track.appendChild(firstCard);
            }
            currentIndex = index;
            updateDots();
            track.style.opacity = 1;
        }, 300);
    });
});

// Suporte a Toque (Swipe) para Mobile
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


// ========== SEDES - VER MAIS ==========
(function initSedesVerMais() {
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
})();

// ========== TIMES - EXPANDIR/COLAPSAR ==========
(function initTeamsToggle() {
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
    
    counter.addEventListener("click", (e) => {
      e.stopPropagation();
      teamsContainer.classList.toggle("active");
    });
    
    banner.addEventListener("click", () => {
      teamsContainer.classList.toggle("active");
    });
  });
})();