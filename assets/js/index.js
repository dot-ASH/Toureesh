
const flash = document.querySelector(".flash-container");
if(flash){
  flash.style.top = "30px";
  flash.style.opacity = "0.9"
  flash.style.zIndex= "5000";
}

setTimeout(() => {
  if(flash){
  flash.style.top = "-100px";
  flash.style.opacity = "0";
  }
}, 3000);


/*==================== SHOW MENU ====================*/
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show-menu");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*==================== CHANGE BACKGROUND HEADER ====================*/

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

/*==================== SHOW SCROLL UP ====================*/

function scrollUp() {
  const scrollUp = document.getElementById("scroll-up");
  if (this.scrollY >= 200) scrollUp.classList.add("show-scroll");
  else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

// /*==================== SCROLL SECTIONS ACTIVE LINK ====================*/

const sections = document.querySelectorAll("section");


function scrollActive() {

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    var sectionId = current.getAttribute("id");
    const navLi =       document
.querySelector(".nav__menu a[href*=" + sectionId + "]")

    if (window.pageYOffset > sectionTop && window.pageYOffset <= sectionTop + sectionHeight) {
      if(navLi){
        navLi.classList.add("active-link");
      }
        
    } else {
      if(navLi){
        navLi.classList.remove("active-link");
      }
    }
  });
}
window.addEventListener("scroll", scrollActive);

/*==================== SCROLL REVEAL ANIMATION ====================*/
const sr = ScrollReveal({
  distance: "60px",
  duration: 2800,
  // reset: true,
});

sr.reveal(
  `.home__data, .home__social-link, .home__info,
           .place__container,
           .experience__data, .experience__overlay,
           .package__card,
           .sponsor__content,
           .login__container,
           .footer__data, .footer__rights`,
  {
    origin: "top",
    interval: 100,
  }
);

sr.reveal(
  `.about__data,
            .discounts,
           .discounts__data,
           .subscribe__description`,
  {
    origin: "left",
  }
);
sr.reveal(`.exp__art`, {
  origin: "left",
  interval: 100,
});

sr.reveal(
  `.about__img-overlay,
            .hotels__container,
           .subscribe__form`,
  {
    origin: "right",
    interval: 100,
  }
);

// SIDEBAR
const profileLink = document.querySelector("#navLinkMe");
const sideBarOption = document.querySelector("#sidebarOption");
const closeButton = document.querySelector(".account-close");
const loginBtn = document.querySelector(".booking-class");

profileLink.addEventListener("click", () => {
  sideBarOption.classList.add("div-close");
});

closeButton.addEventListener("click", () => {
  sideBarOption.classList.remove("div-close");
});

loginBtn.addEventListener("click", () => {
  sideBarOption.classList.remove("div-close");
});

// EDIT
