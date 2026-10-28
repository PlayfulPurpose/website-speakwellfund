// Speak Well Fund: mobile menu, footer year and the sign-up form.

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.getElementById("site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Blocks fade and slide up as they scroll into view. Items in a grid follow each other
// a moment apart. Skipped for anyone who has reduced motion turned on.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const groupItems = ".card, .bubble, .steps li, .checklist li, .ways li, .person";
  const blocks = document.querySelectorAll(
    `main .section .container > :not(.card-grid):not(.bubbles):not(.steps):not(.checklist):not(.ways):not(.people), ${groupItems}`
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  document.documentElement.classList.add("js-reveal");
  blocks.forEach((block) => {
    block.classList.add("reveal");
    if (block.matches(groupItems)) {
      const position = [...block.parentElement.children].indexOf(block);
      block.style.transitionDelay = `${position * 90}ms`;
    }
    observer.observe(block);
  });
}

const form = document.getElementById("signup-form");

if (form) {
  const buildOnly = form.querySelector("[data-build-only]");
  const submitButton = form.querySelector('[type="submit"]');
  const errorBox = form.querySelector("[data-form-error]");
  const thanks = document.querySelector("[data-form-thanks]");

  const messages = {
    build: {
      label: "Count me in",
      title: "Thank you so much!",
      text: "We'll be in touch soon to chat about how you'd like to be involved.",
    },
    updates: {
      label: "Keep me posted",
      title: "You're on the list.",
      text: "We'll let you know as soon as there's news to share.",
    },
  };

  // The extra questions only apply to people who want to help build it,
  // so they're hidden and disabled (and not sent) on the "keep me posted" path.
  const setPath = (path) => {
    const isBuilding = path === "build";
    buildOnly.hidden = !isBuilding;
    buildOnly.querySelectorAll("input, textarea").forEach((field) => {
      field.disabled = !isBuilding;
    });
    submitButton.textContent = messages[path].label;
  };

  form.querySelectorAll('input[name="path"]').forEach((radio) => {
    radio.addEventListener("change", () => setPath(radio.value));
  });

  // Links like get-involved.html?path=updates open the form on the "keep me posted" option,
  // and ?role=fund (from The Fund page) pre-ticks "I've got ideas for the fund".
  const params = new URLSearchParams(window.location.search);
  const startingPath = params.get("path") === "updates" ? "updates" : "build";
  form.querySelector(`input[name="path"][value="${startingPath}"]`).checked = true;
  setPath(startingPath);

  if (params.get("role") === "fund") {
    form.querySelector('input[name="role"][value="Has ideas for the fund"]').checked = true;
  }

  const showThanks = (path) => {
    thanks.querySelector("[data-thanks-title]").textContent = messages[path].title;
    thanks.querySelector("[data-thanks-text]").textContent = messages[path].text;
    form.hidden = true;
    thanks.hidden = false;
    thanks.focus();
  };

  // Sign-ups go to the Formspree form in the form's action attribute (get-involved.html).
  // Sending it here keeps people on the page; without JavaScript the browser posts it there directly.
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const path = data.get("path");
    errorBox.hidden = true;

    submitButton.disabled = true;
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Form service replied ${response.status}`);
      showThanks(path);
    } catch (error) {
      console.error(error);
      errorBox.hidden = false;
      submitButton.disabled = false;
    }
  });
}
