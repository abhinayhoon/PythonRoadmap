document.addEventListener("DOMContentLoaded", () => {
  const accordions = document.querySelectorAll(".accordion");
  const panels = document.querySelectorAll(".panel");
  const searchInput = document.getElementById("searchInput");

  /* ===== ACCORDION + RESUME ===== */
  accordions.forEach((accordion, index) => {
    accordion.addEventListener("click", () => {
      const panel = accordion.nextElementSibling;
      const isOpen = panel.style.display === "block";

      panels.forEach(p => (p.style.display = "none"));

      if (!isOpen) {
        panel.style.display = "block";
        localStorage.setItem("lastOpenDay", index);
      } else {
        localStorage.removeItem("lastOpenDay");
      }
    });
  });

  const lastOpen = localStorage.getItem("lastOpenDay");
  if (lastOpen !== null && accordions[lastOpen]) {
    accordions[lastOpen].nextElementSibling.style.display = "block";
    accordions[lastOpen].scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ===== COPY BUTTON ===== */
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("copy-btn")) {
      const code = e.target.previousElementSibling.innerText;
      navigator.clipboard.writeText(code);
      e.target.innerText = "Copied!";
      setTimeout(() => (e.target.innerText = "Copy"), 1200);
    }
  });

  /* ===== SEARCH FUNCTIONALITY ===== */
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    accordions.forEach((accordion) => {
      const text = accordion.innerText.toLowerCase();
      const panel = accordion.nextElementSibling;

      if (text.includes(query)) {
        accordion.style.display = "block";
      } else {
        accordion.style.display = "none";
        panel.style.display = "none";
      }
    });
  });
});
/* ===============================
   Sticky Search Bar (Simple)
   =============================== */

const searchInput = document.querySelector('.search-input');

window.addEventListener('scroll', () => {
  if (window.scrollY > 120) {
    searchInput.classList.add('stuck');
  } else {
    searchInput.classList.remove('stuck');
  }
});
