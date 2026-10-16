
// ==========================================================
// MOKSHITHA N.J — PORTFOLIO INTERACTIONS
// Vanilla JavaScript: no libraries or backend required.
// ==========================================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // --------------------------------------------------------
  // 1. LOADING SCREEN
  // --------------------------------------------------------
  const loader = $("#loader");

  const hideLoader = () => {
    if (loader) loader.classList.add("loaded");
  };

  // Hide when the page finishes loading, with a safe fallback.
  if (document.readyState === "complete") {
    window.setTimeout(hideLoader, 350);
  } else {
    window.addEventListener("load", () => {
      window.setTimeout(hideLoader, 350);
    }, { once: true });
  }

  // Safety fallback if a remote font or asset loads slowly.
  window.setTimeout(hideLoader, 2500);

  // --------------------------------------------------------
  // 2. CURRENT YEAR
  // --------------------------------------------------------
  const yearElement = $("#current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------
  // 3. MOBILE NAVIGATION
  // --------------------------------------------------------
  const menuToggle = $("#menu-toggle");
  const navLinks = $("#nav-links");
  const navItems = $$(".nav-link");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation menu" : "Close navigation menu"
      );
      navLinks.classList.toggle("open", !isOpen);
    });

    navItems.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    // Close the menu when clicking outside it.
    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Restore normal navigation after resizing to desktop.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) closeMenu();
    });
  }

  // --------------------------------------------------------
  // 4. SMOOTH SCROLLING FOR INTERNAL LINKS
  // --------------------------------------------------------
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  // --------------------------------------------------------
  // 5. ANIMATED TYPING INTRODUCTION
  // --------------------------------------------------------
  const typedText = $("#typed-text");
  const phrases = [
    "Software Development",
    "Web Development",
    "Problem Solving",
    "Data Visualization",
    "Continuous Learning"
  ];

  let phraseIndex = 0;
  let characterIndex = 0;
  let deleting = false;
  let typingTimer = null;

  function typeNext() {
    if (!typedText) return;

    const phrase = phrases[phraseIndex];

    if (deleting) {
      characterIndex--;
    } else {
      characterIndex++;
    }

    typedText.textContent = phrase.slice(0, characterIndex);

    let delay = deleting ? 38 : 75;

    if (!deleting && characterIndex === phrase.length) {
      deleting = true;
      delay = 1450;
    } else if (deleting && characterIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    }

    typingTimer = window.setTimeout(typeNext, delay);
  }

  if (typedText) {
    if (reduceMotion) {
      typedText.textContent = phrases[0];
    } else {
      typingTimer = window.setTimeout(typeNext, 500);
    }
  }

  // --------------------------------------------------------
  // 6. SCROLL REVEAL ANIMATIONS
  // --------------------------------------------------------
  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  // --------------------------------------------------------
  // 7. ANIMATED SKILL BARS
  // --------------------------------------------------------
  const skillBars = $$(".skill-track span");

  function animateSkillBars() {
    skillBars.forEach((bar) => {
      const level = Number(bar.dataset.level);
      if (Number.isFinite(level)) {
        bar.style.width = `${Math.min(100, Math.max(0, level))}%`;
      }
    });
  }

  const skillSection = $("#skills");

  if (skillSection && "IntersectionObserver" in window && !reduceMotion) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkillBars();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    skillsObserver.observe(skillSection);
  } else {
    animateSkillBars();
  }

  // --------------------------------------------------------
  // 8. ACTIVE NAVIGATION LINK
  // --------------------------------------------------------
  const sections = $$("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navItems.forEach((link) => {
          const isActive =
            link.getAttribute("href") === `#${entry.target.id}`;

          link.classList.toggle("active", isActive);

          if (isActive) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, {
      rootMargin: "-25% 0px -60% 0px",
      threshold: 0
    });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // --------------------------------------------------------
  // 9. 3D CARD TILT AND GLOW
  // --------------------------------------------------------
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (finePointer && !reduceMotion) {
    $$(".tilt-card").forEach((card) => {
      let frame = null;

      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const normalizedX = (x / rect.width - 0.5) * 2;
        const normalizedY = (y / rect.height - 0.5) * 2;

        if (frame) cancelAnimationFrame(frame);

        frame = requestAnimationFrame(() => {
          const tiltX = -normalizedY * 4;
          const tiltY = normalizedX * 5;

          card.style.transform =
            `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-3px)`;

          card.style.setProperty("--mx", `${x}px`);
          card.style.setProperty("--my", `${y}px`);
        });
      });

      card.addEventListener("pointerleave", () => {
        if (frame) cancelAnimationFrame(frame);
        card.style.transform = "";
        card.style.removeProperty("--mx");
        card.style.removeProperty("--my");
      });
    });
  }

  // --------------------------------------------------------
  // 10. POINTER GLOW
  // --------------------------------------------------------
  const cursorGlow = $("#cursor-glow");

  if (cursorGlow && finePointer && !reduceMotion) {
    let glowFrame = null;

    document.addEventListener("pointermove", (event) => {
      if (glowFrame) cancelAnimationFrame(glowFrame);

      glowFrame = requestAnimationFrame(() => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
        cursorGlow.style.opacity = "1";
      });
    });

    document.addEventListener("pointerleave", () => {
      cursorGlow.style.opacity = "0";
    });
  }

  // --------------------------------------------------------
  // 11. SUBTLE HERO PARALLAX
  // --------------------------------------------------------
  const heroVisual = $("#hero-visual");

  if (heroVisual && finePointer && !reduceMotion) {
    heroVisual.addEventListener("pointermove", (event) => {
      const rect = heroVisual.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      heroVisual.style.setProperty("--parallax-x", `${x * 8}px`);
      heroVisual.style.setProperty("--parallax-y", `${y * 8}px`);
    });

    heroVisual.addEventListener("pointerleave", () => {
      heroVisual.style.setProperty("--parallax-x", "0px");
      heroVisual.style.setProperty("--parallax-y", "0px");
    });
  }

  // --------------------------------------------------------
  // 12. LIGHTWEIGHT ANIMATED PARTICLE BACKGROUND
  // --------------------------------------------------------
  const canvas = $("#particle-canvas");
  const context = canvas ? canvas.getContext("2d") : null;

  if (canvas && context && !reduceMotion) {
    let particles = [];
    let width = 0;
    let height = 0;
    let animationFrame = null;
    let lastFrame = 0;
    let running = !document.hidden;

    const particleCount = () =>
      Math.min(65, Math.max(22, Math.floor(window.innerWidth / 19)));

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = particleCount();

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.5 + 0.4
      }));
    }

    function drawParticles(timestamp) {
      animationFrame = null;

      if (!running) return;

      // Cap particle rendering at roughly 30 frames per second.
      if (timestamp - lastFrame < 32) {
        animationFrame = requestAnimationFrame(drawParticles);
        return;
      }

      lastFrame = timestamp;
      context.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(177, 166, 255, 0.58)";
        context.fill();

        // Connect only nearby particles.
        for (let j = index + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < 95 * 95) {
            const alpha = (1 - Math.sqrt(distanceSquared) / 95) * 0.12;

            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(117, 146, 255, ${alpha})`;
            context.lineWidth = 0.6;
            context.stroke();
          }
        }
      });

      animationFrame = requestAnimationFrame(drawParticles);
    }

    function startParticles() {
      if (running && !animationFrame) {
        animationFrame = requestAnimationFrame(drawParticles);
      }
    }

    function stopParticles() {
      running = false;

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopParticles();
      } else {
        running = true;
        startParticles();
      }
    });

    window.addEventListener("resize", resizeCanvas, { passive: true });

    resizeCanvas();
    startParticles();
  }

  // --------------------------------------------------------
  // 13. PROJECT DETAIL DIALOGS
  // --------------------------------------------------------
  const projectData = {
    energy: {
      kicker: "DATA / 001",
      title: "Energy Consumption Analysis",
      description:
        "An academic project concept focused on analysing energy consumption " +
        "patterns using timestamped usage data. Potential features include " +
        "hourly and daily comparisons, monthly trends, data cleaning, and " +
        "visual charts using Python. The final implementation and findings " +
        "should be added once the project is completed.",
      tags: ["Python", "Pandas", "Data visualization"]
    },
    portfolio: {
      kicker: "WEB / 002",
      title: "Personal Portfolio",
      description:
        "A responsive personal website concept presenting education, " +
        "technical skills, certifications, and project interests. The design " +
        "uses semantic HTML, custom CSS, and JavaScript for interactions, " +
        "scroll animations, and responsive navigation.",
      tags: ["HTML", "CSS", "JavaScript", "Responsive UI"]
    },
    programming: {
      kicker: "CS / 003",
      title: "Programming Practice Lab",
      description:
        "A growing collection of coding exercises and academic solutions " +
        "covering algorithms, data structures, object-oriented programming, " +
        "and foundational programming. Add selected examples, explanations, " +
        "test cases, and source-code links as the collection grows.",
      tags: ["C", "C++", "Python", "Algorithms"]
    }
  };

  const projectDialog = $("#project-dialog");
  const dialogTitle = $("#dialog-title");
  const dialogDescription = $("#dialog-description");
  const dialogKicker = $("#dialog-kicker");
  const dialogTags = $("#dialog-tags");
  const dialogClose = $("#dialog-close");

  function closeProjectDialog() {
    if (!projectDialog) return;

    if (typeof projectDialog.close === "function") {
      projectDialog.close();
    } else {
      projectDialog.removeAttribute("open");
    }
  }

  $$(".project-details").forEach((button) => {
    button.addEventListener("click", () => {
      const project = projectData[button.dataset.project];
      if (!project || !projectDialog) return;

      dialogKicker.textContent = project.kicker;
      dialogTitle.textContent = project.title;
      dialogDescription.textContent = project.description;

      dialogTags.replaceChildren();

      project.tags.forEach((tag) => {
        const span = document.createElement("span");
        span.textContent = tag;
        dialogTags.appendChild(span);
      });

      if (typeof projectDialog.showModal === "function") {
        projectDialog.showModal();
      } else {
        projectDialog.setAttribute("open", "");
      }
    });
  });

  if (dialogClose) {
    dialogClose.addEventListener("click", closeProjectDialog);
  }

  if (projectDialog) {
    projectDialog.addEventListener("click", (event) => {
      // Close when clicking the backdrop outside the dialog box.
      if (event.target === projectDialog) closeProjectDialog();
    });
  }

  // --------------------------------------------------------
  // 14. DOWNLOAD CV — PRINT OR SAVE AS PDF
  // --------------------------------------------------------
  const downloadButton = $("#download-cv");

  if (downloadButton) {
    downloadButton.addEventListener("click", () => {
      closeMenu();

      // The print stylesheet hides navigation and decorations,
      // then formats the portfolio into printable CV sections.
      window.print();
    });
  }

  // --------------------------------------------------------
  // 15. BACK TO TOP
  // --------------------------------------------------------
  const backToTop = $("#back-to-top");

  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle("show", window.scrollY > 500);
  }

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  }

  // --------------------------------------------------------
  // 16. CLEAN UP ON PAGE EXIT
  // --------------------------------------------------------
  window.addEventListener("pagehide", () => {
    if (typingTimer) window.clearTimeout(typingTimer);
  }, { once: true });
});
