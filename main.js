/* ============================================
   Penghui China Wood — Main JavaScript
   Navigation · Animations · UI Interactions
   ============================================ */

"use strict";

// ── Page Router ───────────────────────────────────────────────
const router = {
  currentPage: "home",

  navigate(pageId) {
    // Hide all pages
    document.querySelectorAll(".page").forEach((p) => {
      p.classList.remove("active");
    });

    // Show target page
    const target = document.getElementById("page-" + pageId);
    if (target) {
      target.classList.add("active");
      this.currentPage = pageId;
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Update nav active state
      document.querySelectorAll(".nav__link[data-page]").forEach((link) => {
        link.classList.toggle(
          "nav__link--active",
          link.dataset.page === pageId,
        );
      });

      // Re-trigger reveal animations
      setTimeout(() => initReveal(), 100);
    }
  },
};

// Make navigate global for inline onclick handlers
window.navigateTo = (pageId) => router.navigate(pageId);

// ── Navigation ────────────────────────────────────────────────
function initNav() {
  const nav = document.querySelector(".nav");
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const mobileClose = document.getElementById("mobileCloseBtn");
  const mobileDropdownToggle = document.querySelector(
    ".nav__mobile-dropdown-toggle",
  );
  const mobileDropdown = document.querySelector(".nav__mobile-dropdown");

  // Scroll effect
  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    },
    { passive: true },
  );

  // Mobile menu toggle
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
      const isOpen = mobileNav.classList.contains("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen && mobileDropdown) {
        mobileDropdown.classList.remove("open");
        mobileDropdownToggle?.setAttribute("aria-expanded", "false");
        mobileDropdownToggle?.classList.remove("open");
      }
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
      if (mobileDropdown) {
        mobileDropdown.classList.remove("open");
        mobileDropdownToggle?.setAttribute("aria-expanded", "false");
        mobileDropdownToggle?.classList.remove("open");
      }
    });
  }

  if (mobileDropdownToggle && mobileDropdown) {
    mobileDropdownToggle.addEventListener("click", () => {
      const isOpen = mobileDropdown.classList.toggle("open");
      mobileDropdownToggle.setAttribute("aria-expanded", String(isOpen));
      mobileDropdownToggle.classList.toggle("open", isOpen);
    });
  }

  // Nav link clicks
  document.querySelectorAll("[data-page]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const page = el.dataset.page;
      router.navigate(page);
      if (mobileNav) {
        mobileNav.classList.remove("open");
      }
      if (mobileDropdown) {
        mobileDropdown.classList.remove("open");
        mobileDropdownToggle?.setAttribute("aria-expanded", "false");
        mobileDropdownToggle?.classList.remove("open");
      }
      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  });
}

// ── Scroll Reveal ─────────────────────────────────────────────
function initReveal() {
  const elements = document.querySelectorAll(".reveal:not(.in-view)");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger delay based on siblings
            const siblings = entry.target.parentElement
              ? Array.from(entry.target.parentElement.children).filter((c) =>
                  c.classList.contains("reveal"),
                )
              : [];
            const index = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.08}s`;
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    elements.forEach((el) => observer.observe(el));
  } else {
    // Fallback
    elements.forEach((el) => el.classList.add("in-view"));
  }
}

// ── Quantity Controls ─────────────────────────────────────────
function initQtyControls() {
  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector(".qty-input");
      let val = parseInt(input.value) || 1;
      if (btn.dataset.action === "inc") val++;
      if (btn.dataset.action === "dec") val = Math.max(1, val - 1);
      input.value = val;
    });
  });
}

// ── Filter Chips ──────────────────────────────────────────────
function initFilterChips() {
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const group = chip.closest(".filter-chips");
      if (group) {
        group
          .querySelectorAll(".filter-chip")
          .forEach((c) => c.classList.remove("active"));
      }
      chip.classList.toggle("active");
    });
  });
}

// ── Gallery Thumbnails ────────────────────────────────────────
function initGallery() {
  document.querySelectorAll(".gallery-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const gallery = thumb.closest(".gallery-section");
      if (!gallery) return;

      // Update active thumb
      gallery
        .querySelectorAll(".gallery-thumb")
        .forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");

      // Update main image
      const main = gallery.querySelector(".gallery-main img");
      const thumbImg = thumb.querySelector("img");
      if (main && thumbImg) {
        main.style.opacity = "0";
        main.style.transition = "opacity 0.25s";
        setTimeout(() => {
          main.src = thumbImg.src;
          main.style.opacity = "1";
        }, 200);
      }
    });
  });
}

// ── Dashboard Sidebar Nav ─────────────────────────────────────
function initDashboardNav() {
  document.querySelectorAll(".dashboard-nav__item").forEach((item) => {
    item.addEventListener("click", () => {
      document
        .querySelectorAll(".dashboard-nav__item")
        .forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

// ── Form Interactions ─────────────────────────────────────────
function initForms() {
  // Prevent default submit and show a toast-like message
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (!btn) return;
      const original = btn.textContent;
      btn.textContent = "Sending…";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = "✓ Sent Successfully";
        btn.style.background = "#2C3E2D";
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          btn.style.background = "";
          form.reset();
        }, 2500);
      }, 1200);
    });
  });
}

// ── Notification Toast ────────────────────────────────────────
function showToast(message, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: ${type === "success" ? "#2C3E2D" : "#8B6A3E"};
    color: white;
    padding: 14px 24px;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 9999;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    white-space: nowrap;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
window.showToast = showToast;

// ── Product "Add to Quote" Interaction ────────────────────────
function initProductActions() {
  document.querySelectorAll('[data-action="quote"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      showToast("Added to quote request", "wood");
    });
  });

  document.querySelectorAll('[data-action="save"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const icon = btn.querySelector("svg");
      btn.style.color = "#8B6A3E";
      showToast("Product saved to your list");
    });
  });
}

// ── Hero Parallax (subtle) ────────────────────────────────────
function initParallax() {
  const heroBg = document.querySelector(".hero__bg");
  if (!heroBg) return;

  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    },
    { passive: true },
  );
}

// ── WhatsApp Float Button ─────────────────────────────────────
function createWhatsAppFloat() {
  const float = document.createElement("a");
  float.href = "#";
  float.className = "whatsapp-float";
  float.style.cssText = `
    position: fixed;
    bottom: 28px;
    right: 28px;
    width: 52px;
    height: 52px;
    background: #25D366;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(37,211,102,0.4);
    z-index: 998;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    color: white;
  `;
  float.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M11.975 0C5.367 0 0 5.373 0 11.988c0 2.107.549 4.09 1.508 5.815L.057 24l6.304-1.654C8.04 23.29 9.967 23.974 11.975 23.974 18.58 23.974 24 18.599 24 11.988 24 5.373 18.58 0 11.975 0zm0 21.951c-1.836 0-3.642-.494-5.218-1.427l-.374-.221-3.882 1.018 1.035-3.783-.244-.387C2.19 15.551 1.636 13.817 1.636 11.988c0-5.71 4.648-10.36 10.339-10.36 5.691 0 10.339 4.65 10.339 10.36 0 5.713-4.648 10.363-10.339 10.363z"/>
  </svg>`;

  float.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Opening WhatsApp chat…", "wood");
  });
  float.addEventListener("mouseenter", () => {
    float.style.transform = "scale(1.1)";
    float.style.boxShadow = "0 6px 28px rgba(37,211,102,0.55)";
  });
  float.addEventListener("mouseleave", () => {
    float.style.transform = "scale(1)";
    float.style.boxShadow = "0 4px 20px rgba(37,211,102,0.4)";
  });

  document.body.appendChild(float);
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveal();
  initQtyControls();
  initFilterChips();
  initGallery();
  initDashboardNav();
  initForms();
  initParallax();
  initProductActions();
  createWhatsAppFloat();

  // Start on home page
  router.navigate("home");
});
