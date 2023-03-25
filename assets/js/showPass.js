const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");
const password2 = document.querySelector("#password2");

togglePassword.addEventListener("click", () => {
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});

togglePassword.addEventListener("click", () => {
  const type =
    password2.getAttribute("type") === "password" ? "text" : "password";
  password2.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});