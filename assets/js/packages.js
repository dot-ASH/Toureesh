/*==================== PAC DETAILS ====================*/
const timelineB = document.getElementById("timelineB");
const includedB = document.getElementById("includedB");
const excludedB = document.getElementById("excludedB");
const priceB = document.getElementById("priceB");
const mapB = document.getElementById("mapB");
const revB = document.getElementById("revB");

const animation = document.getElementById("ani");

const included = document.getElementById("included");
const excluded = document.getElementById("excluded");
const price = document.getElementById("price");
const map_navigation = document.getElementById("map_navigation");
const reviews = document.getElementById("reviews");
const timeline = document.getElementById("timeline");

function hidden() {
  timeline.style.visibility = "hidden";
  included.style.visibility = "hidden";
  excluded.style.visibility = "hidden";
  price.style.visibility = "hidden";
  map_navigation.style.visibility = "hidden";
  reviews.style.visibility = "hidden";
}

function anim() {
  animation.style.top = "none";
}

timelineB.onclick = function () {
  hidden();
  if (timeline.style.visibility !== "visible") {
    timeline.style.visibility = "visible";
    animation.style.top = "60px";
  }
};

includedB.onclick = function () {
  hidden();
  if (included.style.visibility !== "visible") {
    included.style.visibility = "visible";
    animation.style.top = "140px";
  }
};

excludedB.onclick = function () {
  hidden();
  if (excluded.style.visibility !== "visible") {
    excluded.style.visibility = "visible";
    animation.style.top = "220px";
  }
};

priceB.onclick = function () {
  hidden();
  if (price.style.visibility !== "visible") {
    price.style.visibility = "visible";
    animation.style.top = "300px";
  }
};

mapB.onclick = function () {
  hidden();
  if (map_navigation.style.visibility !== "visible") {
    map_navigation.style.visibility = "visible";
    animation.style.top = "380px";
  }
};

revB.onclick = function () {
  hidden();
  reviews.style.visibility = "visible";
  animation.style.top = "460px";
  // if (reviews.style.visibility !== "visible") {
  //     reviews.visibility = "visible";
  // }
};

const ratingCount = document.getElementById("count");
const star = document.querySelectorAll(".star");
star.forEach((Element) => {
  Element.addEventListener("click", () => {
    ratingCount.setAttribute("value", Element.getAttribute("value"))
  })
});
