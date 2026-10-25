
"use strict";

// 1. Automatically update the copyright year.
document.querySelectorAll(".year").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

// 2. Mobile navigation menu.
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
const themeToggle = document.getElementById("themeToggle");

// Save ki hui theme load karo
const savedTheme = localStorage.getItem("webcraft-theme");

if (savedTheme === "light") {
    document.body.classList.add("light-mode");
}

function updateThemeButton() {
    const isLight = document.body.classList.contains("light-mode");

    themeToggle.textContent = isLight
        ? "🌙 Dark Mode"
        : "☀️ Light Mode";
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    const isLight = document.body.classList.contains("light-mode");

    localStorage.setItem(
        "webcraft-theme",
        isLight ? "light" : "dark"
    );

    updateThemeButton();
});

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "✕" : "☰";
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
    });
  });
}

// 3. Read the selected package from the pricing page URL.
const planField = document.querySelector("#plan");

if (planField) {
  const params = new URLSearchParams(window.location.search);
  const selectedPlan = params.get("plan");

  const allowedPlans = ["Basic", "Professional", "Business", "Custom"];

  if (selectedPlan && allowedPlans.includes(selectedPlan)) {
    planField.value = selectedPlan;
  }
}

// 4. Prepare a project inquiry for WhatsApp.
const projectForm = document.querySelector("#projectForm");
const formStatus = document.querySelector("#formStatus");

// IMPORTANT: Replace this with your own WhatsApp number.
// Use country code + number, digits only, without + or spaces.
// Example format for India: 91XXXXXXXXXX
const WHATSAPP_NUMBER = "919870332418";

if (projectForm) {
  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!projectForm.reportValidity()) return;

    const formData = new FormData(projectForm);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const websiteType = String(formData.get("websiteType") || "");
    const budget = String(formData.get("budget") || "Not specified");
    const plan = String(formData.get("plan") || "Not selected");
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !websiteType || !message) {
      formStatus.textContent = "Please complete all required fields.";
      return;
    }

    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
      formStatus.textContent =
        "Please add your real WhatsApp number in script.js first.";
      return;
    }

    const inquiry = [
      "Hello WebCraft Studio!",
      "",
      "I would like to discuss a website project.",
      "",
      "Name: " + name,
      "Email: " + email,
      "Website Type: " + websiteType,
      "Budget: " + budget,
      "Package: " + plan,
      "",
      "Project Details:",
      message
    ].join("\n");

    const whatsappURL =
      "https://wa.me/" + WHATSAPP_NUMBER +
      "?text=" + encodeURIComponent(inquiry);

    formStatus.textContent =
      "Opening WhatsApp. Review your message and send it when ready.";

    const whatsappWindow = window.open(
      whatsappURL,
      "_blank",
      "noopener,noreferrer"
    );

    if (!whatsappWindow) {
      // Fallback if the browser blocks the new tab.
      window.location.href = whatsappURL;
    }
  });
}
