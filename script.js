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

    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    }
    else{
        header.classList.remove("scrolled");
    }
})
