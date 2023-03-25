const logoW = document.getElementById("white");
const logoB = document.getElementById("black");

function scrollHeader() {
  const header = document.getElementById("header");
  if (this.scrollY >= 100) {
    header.classList.add("scroll-header");
    logoW.style.display = "none";
    logoB.style.display = "block";
  } else {
    header.classList.remove("scroll-header");
    logoW.style.display = "block";
    logoB.style.display = "none";
  }
}
window.addEventListener("scroll", scrollHeader);

console.log("gjgjgj");
const sr = ScrollReveal({
  distance: "60px",
  duration: 2800,
  // reset: true,
});

sr.reveal(`.reg`, {
  origin: "left",
  interval: 100,
});

const flash = document.querySelector(".flash-container");
if (flash) {
  flash.style.top = "30px";
  flash.style.opacity = "0.9";
}

setTimeout(() => {
  flash.style.top = "-100px";
  flash.style.opacity = "0";
}, 3000);
