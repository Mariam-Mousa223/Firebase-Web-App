import { auth } from "./firebase-config.js";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const authForm = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("btn-submit");
const toggleBox = document.querySelector(".toggle-box");
const msgBox = document.getElementById("msg-box");

let isNewUser = false;

if (toggleBox) {
  toggleBox.addEventListener("click", (e) => {
    if (e.target && e.target.id === "toggle-link") {
      e.preventDefault();
      isNewUser = !isNewUser;
      if (msgBox) msgBox.textContent = "";

      if (isNewUser) {
        if (formTitle) formTitle.textContent = "Create Account";
        if (submitBtn) submitBtn.textContent = "Sign Up";
        toggleBox.innerHTML = '<p id="toggle-text">Already have an account? <a href="#" id="toggle-link">Sign In</a></p>';
      } else {
        if (formTitle) formTitle.textContent = "Sign In";
        if (submitBtn) submitBtn.textContent = "Sign In";
        toggleBox.innerHTML = '<p id="toggle-text">Don\'t have an account? <a href="#" id="toggle-link">Sign Up</a></p>';
      }
    }
  });
}

if (authForm) {
  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (msgBox) msgBox.textContent = "Loading...";

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      if (isNewUser) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Welcome back!");
      }
      window.location.href = "dashboard.html";
    } catch (err) {
      if (msgBox) msgBox.textContent = err.message;
    }
  });
}
