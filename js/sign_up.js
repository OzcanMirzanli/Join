document.addEventListener("DOMContentLoaded", function () {
  let confirmPasswordInput = document.getElementById("confirm-password");
  confirmPasswordInput.addEventListener("input", handleConfirmPasswordChange);
  document
    .getElementById("password")
    .addEventListener("input", confirmPassword);
  document
    .getElementById("confirm-password")
    .addEventListener("input", confirmPassword);
  loadUsers();
});

let users = [];

let userName = document.getElementById("user-name");
let email = document.getElementById("email");
let password = document.getElementById("password");

async function init() {
  loadUsers();
}

async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function signUp() {
  let signUpBtn = document.getElementById("sign-up-btn");

  signUpBtn.disabled = true;
  let userNameValue = userName.value;

  localStorage.setItem("userName", userNameValue);

  users.push({
    userName: userName.value,
    email: email.value,
    password: password.value,
  });

  await setItem("users", JSON.stringify(users));
  resetForm();
}

function resetForm() {
  let signUpBtn = document.getElementById("sign-up-btn");

  userName.value = "";
  email.value = "";
  password.value = "";
  signUpBtn.disabled = false;
}

function confirmPassword() {
  let signUpBtn = document.getElementById("sign-up-btn");
  let wrongPassword = document.getElementById("wrong-password");
  let confirmPassword = document.getElementById("confirm-password");
  let confirmPasswordInput = document.querySelector(".confirm-password-input");

  let passwordsMatch = password.value === confirmPassword.value;
  let isFormValid = userName.value && passwordsMatch && password.value;

  if (password.value != confirmPassword.value) {
    wrongPassword.style.display = "block";
    confirmPasswordInput.style.border = "1px solid red";
  } else {
    wrongPassword.style.display = "none";
    confirmPasswordInput.style.border = "";
  }

  signUpBtn.disabled = !isFormValid;
}

const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get("msg");
let signUpBox = document.getElementById("signed-up-success-container");

if (msg) {
  signUpBox.innerHTML = msg;
} else {
  signUpBox.display.style = "none";
}

function handleConfirmPasswordChange() {
  let confirmPasswordInput = document.getElementById("confirm-password");
  let confirmPasswordLogo = document.getElementById("confirm-password-logo");

  if (confirmPasswordInput.value.length > 0) {
    confirmPasswordLogo.src = "assets/img/password-hide.png";
  } else {
    confirmPasswordLogo.src = "assets/img/lock.png";
  }
}

function toggleConfirmPassword() {
  let confirmPasswordInput = document.getElementById("confirm-password");
  let confirmPasswordLogo = document.getElementById("confirm-password-logo");

  if (
    confirmPasswordInput.type === "password" &&
    confirmPasswordInput.value.length > 0
  ) {
    confirmPasswordLogo.src = "assets/img/password-visible.png";
    confirmPasswordInput.type = "text";
  } else if (
    confirmPasswordInput.type === "text" &&
    confirmPasswordInput.value.length > 0
  ) {
    confirmPasswordLogo.src = "assets/img/password-hide.png";
    confirmPasswordInput.type = "password";
  } else {
    confirmPasswordLogo.src = "assets/img/lock.png";
  }
}
