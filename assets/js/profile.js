const editBtn = document.querySelector(".profile-edit");
const profileInput = document.querySelectorAll("#myprofile input");
const submitBtn = document.querySelector("#regBtn");
const profileInputPlaceholder = document.querySelector(
  "#myprofile input::placeholder"
);

var clicks = 0;

editBtn.addEventListener("click", () => {
  clicks += 1;
  if ((clicks + 2) % 2 === 1) {
    submitBtn.disabled = false;
    profileInput.forEach((el) => {
      el.readOnly = false;
      el.style.backgroundColor = "#fff";
      el.style.color = "hsla(42, 100%, 19%, 1)";
    });
  } else {
    submitBtn.disabled = true;
    profileInput.forEach((el) => {
      el.readOnly = true;
      el.style.backgroundColor = "#5b5b5b";
      el.style.color = "#fff";
    });
  }
});

//POPUP
const cancleBtn = document.querySelectorAll(".del");
const popup = document.getElementById("popup");
const popupYes = document.getElementById("popup-yes");
const popupNo = document.getElementById("popup-no");
cancleBtn.forEach(element => {
  element.addEventListener("click", () => {
  popup.style.display = "flex";
  popup.style.opacity = 1;
  popupYes.setAttribute("value",element.getAttribute('name'));
});
})


popupNo.addEventListener("click", ()=>{
  popup.style.display = "none";
  popup.style.opacity = 0;
})
