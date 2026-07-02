/* =====================================================
   Beginner → Builder  -  Main Script
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  /* ===== LIGHTWEIGHT STAR CANVAS ===== */
  const canvas = document.getElementById("bgCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d", { alpha: false });
    let particles = [];
    const PARTICLE_COUNT = isMobile ? 25 : 80;

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01,
        color: ["#3b82f6", "#22d3ee", "#a78bfa"][Math.floor(Math.random() * 3)]
      });
    }

    let lastTime = 0;
    const fpsInterval = 1000 / 60;

    function drawParticles(timestamp) {
      requestAnimationFrame(drawParticles);
      
      const elapsed = timestamp - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = timestamp - (elapsed % fpsInterval);

      // Clear with background color instead of clearRect for performance/alpha
      ctx.fillStyle = '#03050d';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        
        if (p.x < -10) p.x = window.innerWidth + 10;
        if (p.x > window.innerWidth + 10) p.x = -10;
        if (p.y < -10) p.y = window.innerHeight + 10;
        if (p.y > window.innerHeight + 10) p.y = -10;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.2 + 0.3 * Math.sin(timestamp * 0.001 * p.speed + p.phase);
        ctx.fill();
      }

      if (!isMobile) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 120) {
              ctx.beginPath();
              ctx.strokeStyle = particles[i].color;
              ctx.globalAlpha = (120 - dist) / 120 * 0.15;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(drawParticles);
  }

  /* ===== HERO TYPING EFFECT ===== */
  const heroCode = document.getElementById("heroTypingCode");
  if (heroCode) {
    const lines = [
      '# Day 1 — your first program',
      'print("Hello, world")',
      '',
      '# 20 days later...',
      '',
      'import sqlite3, requests',
      'from flask import Flask',
      '',
      '# you built something real.'
    ];

    let lineIdx = 0, charIdx = 0, currentText = "";

    function typeCode() {
      if (lineIdx >= lines.length) {
        // Stop animation after full text is shown, no loop.
        return;
      }

      const line = lines[lineIdx];

      if (charIdx < line.length) {
        currentText += line[charIdx];
        heroCode.textContent = currentText;
        charIdx++;
        setTimeout(typeCode, 40 + (Math.random() * 40 - 20)); // 40ms ± 20ms jitter
      } else {
        currentText += "\n";
        heroCode.textContent = currentText;
        lineIdx++;
        charIdx = 0;
        setTimeout(typeCode, 180);
      }
    }
    setTimeout(typeCode, 600);
  }

  /* ===== NAVBAR SCROLL ===== */
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 60) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    }, { passive: true });
  }

  /* ===== HAMBURGER MENU ===== */
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      mobileNav.classList.toggle("active");
      document.body.style.overflow = mobileNav.classList.contains("active") ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileNav.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  /* ===== LAZY OPEN ACCORDION & PROGRESS TRACKER ===== */
  const STORAGE_KEY = "py_completed_days";
  const DAY1_SESSION_KEY = "day1_opened";
  const LAST_OPEN_KEY = "py_last_open";
  
  const progressFill = document.getElementById("progressFill");
  const progressCount = document.getElementById("progressCount");
  
  let completed = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    completed = new Set(saved);
  } catch(e) {}

  function updateProgress() {
    const count = [...completed].filter(d => !isNaN(parseInt(d))).length;
    const pct = (count / 30) * 100;
    if (progressFill) progressFill.style.width = pct + "%";
    if (progressCount) progressCount.textContent = `${count} / 30 days`;
  }
  updateProgress();

  // Lazy load map
  const panelContents = {};
  document.querySelectorAll(".day-block").forEach(block => {
    const day = block.dataset.day;
    const panel = block.querySelector(".day-panel");
    if (panel) {
      panelContents[day] = panel.innerHTML;
      panel.innerHTML = "";
    }
    block.dataset.loaded = "false";

    // Set initial check marks
    const btn = block.querySelector(".day-check");
    if (btn && completed.has(day)) {
      btn.textContent = "✓";
      btn.classList.add("checked");
    }
  });

  function openDay(dayNum) {
    const block = document.querySelector(`.day-block[data-day="${dayNum}"]`);
    if (!block) return;
    
    const panel = block.querySelector(".day-panel");
    const wasOpen = block.classList.contains("is-open");

    // Close all others
    document.querySelectorAll(".day-block.is-open").forEach(b => {
      if (b !== block) {
        b.classList.remove("is-open");
        const p = b.querySelector(".day-panel");
        p.style.maxHeight = "0px";
      }
    });

    if (!wasOpen) {
      if (block.dataset.loaded === "false") {
        panel.innerHTML = panelContents[dayNum];
        block.dataset.loaded = "true";
      }
      
      block.classList.add("is-open");
      
      // Calculate scroll height
      panel.style.maxHeight = "none";
      const height = panel.scrollHeight;
      panel.style.maxHeight = "0px";
      
      // Force reflow
      void panel.offsetHeight;
      
      panel.style.maxHeight = height + "px";
      localStorage.setItem(LAST_OPEN_KEY, dayNum);
      
      setTimeout(() => {
        block.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 350);
    } else {
      block.classList.remove("is-open");
      panel.style.maxHeight = "0px";
      localStorage.removeItem(LAST_OPEN_KEY);
    }
  }

  // Handle auto-open logic
  if (!sessionStorage.getItem(DAY1_SESSION_KEY)) {
    sessionStorage.setItem(DAY1_SESSION_KEY, "true");
    setTimeout(() => {
      openDay("1");
    }, 800);
  } else {
    const lastOpen = localStorage.getItem(LAST_OPEN_KEY);
    if (lastOpen) {
      openDay(lastOpen);
    }
  }

  // Event Delegation for Accordion Toggles & Check Buttons
  document.getElementById("daysContainer")?.addEventListener("click", (e) => {
    // Check button click
    const checkBtn = e.target.closest(".day-check");
    if (checkBtn) {
      e.stopPropagation();
      const day = checkBtn.dataset.day;
      if (!day) return;

      if (completed.has(day)) {
        completed.delete(day);
        checkBtn.textContent = "○";
        checkBtn.classList.remove("checked");
      } else {
        completed.add(day);
        checkBtn.textContent = "✓";
        checkBtn.classList.add("checked");
        triggerConfetti(checkBtn);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
      updateProgress();
      return;
    }

    // Toggle click
    const toggle = e.target.closest(".day-toggle");
    if (toggle) {
      const block = toggle.closest(".day-block");
      openDay(block.dataset.day);
    }
  });

  function triggerConfetti(target) {
    const rect = target.getBoundingClientRect();
    for (let i = 0; i < 12; i++) {
      const el = document.createElement("div");
      el.style.cssText = `
        position:fixed;
        left:${rect.left + rect.width / 2}px;
        top:${rect.top + rect.height / 2}px;
        width:6px;height:6px;
        border-radius:50%;
        background:${["#3b82f6", "#22d3ee", "#34d399", "#f59e0b", "#a78bfa"][Math.floor(Math.random() * 5)]};
        pointer-events:none;
        z-index:9999;
        transition:all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
      `;
      document.body.appendChild(el);

      requestAnimationFrame(() => {
        el.style.transform = `translate(${(Math.random() - 0.5) * 120}px, ${-40 - Math.random() * 80}px)`;
        el.style.opacity = "0";
      });

      setTimeout(() => el.remove(), 900);
    }
  }

  /* ===== COPY BUTTONS ===== */
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("copy-btn")) return;

    const btn = e.target;
    const codeBlock = btn.closest(".code-block");
    const pre = codeBlock?.querySelector("pre");
    if (!pre) return;

    // Use innerText to strip HTML tags from highlighted spans
    const text = pre.innerText || pre.textContent;

    const showSuccess = () => {
      btn.textContent = "Copied ✓";
      btn.classList.add("copied");
      codeBlock.classList.add("flash-green");
      setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("copied");
        codeBlock.classList.remove("flash-green");
      }, 1500);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text.trim()).then(showSuccess).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }

    function fallbackCopy() {
      const ta = document.createElement("textarea");
      ta.value = text.trim();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showSuccess();
    }
  });

  /* ===== SEARCH WITH DEBOUNCE ===== */
  const searchInput = document.getElementById("searchInput");
  const searchClear = document.getElementById("searchClear");
  let searchTimeout;

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      const q = searchInput.value.toLowerCase().trim();
      
      if (searchClear) {
        if (q.length > 0) searchClear.classList.add("visible");
        else searchClear.classList.remove("visible");
      }

      searchTimeout = setTimeout(() => {
        document.querySelectorAll(".day-block").forEach(block => {
          if (!q) {
            block.style.display = "";
            return;
          }

          const tags = (block.dataset.tags || "").toLowerCase();
          const title = block.querySelector(".day-title")?.textContent.toLowerCase() || "";
          
          // Fallback to searching original content string if not loaded
          const panelContent = block.dataset.loaded === "true" 
            ? block.querySelector(".panel-content")?.textContent.toLowerCase() || ""
            : (panelContents[block.dataset.day] || "").toLowerCase();

          const matches = title.includes(q) || tags.includes(q) || panelContent.includes(q);
          block.style.display = matches ? "" : "none";
        });
      }, 120);
    });

    if (searchClear) {
      searchClear.addEventListener("click", () => {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input"));
        searchInput.focus();
      });
    }

    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }

  /* ===== AI PYTHON BUDDY (Claude API) ===== */
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");
  const suggestedQ = document.getElementById("suggestedQ");

  const systemPrompt = "You are APS, a premium Python learning buddy for a 30-day roadmap website built by Abhinay, a first-year CSE student. Be sleek, highly intelligent, and encouraging. Use concise, high-end formatting. Never say 'certainly', 'absolutely', 'great question'. Reference the roadmap days (1–30) when relevant. Keep it real. Format code in triple backticks.";
  let conversationHistory = [];

  function formatMarkdown(text) {
    // Basic markdown parsing for the chat
    let formatted = text.replace(/```python\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    return formatted.replace(/\n/g, '<br>');
  }

  function addMessage(text, role, isLoading = false) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${role}`;
    msg.id = isLoading ? "typingIndicator" : "";
    
    const avatar = document.createElement("span");
    avatar.className = "msg-avatar";
    avatar.textContent = role === "assistant" ? "🐍" : "👤";
    
    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    
    if (isLoading) {
      bubble.innerHTML = `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
    } else {
      bubble.innerHTML = role === "assistant" ? formatMarkdown(text) : text;
    }
    
    msg.appendChild(avatar);
    msg.appendChild(bubble);
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function sendMessage(userText) {
    if (!userText.trim() || chatSend.disabled) return;
    
    if (suggestedQ) suggestedQ.style.display = "none";
    addMessage(userText, "user");
    chatInput.value = "";
    
    chatSend.disabled = true;
    chatInput.disabled = true;
    addMessage("", "assistant", true); // Add typing indicator

    conversationHistory.push({ role: "user", content: userText });

    try {
      // Convert our conversation history to Gemini's format
      const geminiHistory = conversationHistory.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));

      // Replace YOUR_API_KEY_HERE with a free key from https://aistudio.google.com/
      const API_KEY = window.ENV_GEMINI_API_KEY || "YOUR_API_KEY_HERE";
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: geminiHistory
        })
      });

      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      
      // Extract the response text from Gemini's payload
      const assistantMessage = data.candidates[0].content.parts[0].text;
      
      document.getElementById("typingIndicator")?.remove();
      addMessage(assistantMessage, "assistant");
      conversationHistory.push({ role: "assistant", content: assistantMessage });
    } catch (err) {
      document.getElementById("typingIndicator")?.remove();
      addMessage("Connection issue — try again.", "assistant");
      conversationHistory.pop(); // Remove the failed message so they can retry
    } finally {
      chatSend.disabled = false;
      chatInput.disabled = false;
      chatInput.focus();
    }
  }

  if (chatSend && chatInput) {
    chatSend.addEventListener("click", () => sendMessage(chatInput.value));
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(chatInput.value);
      }
    });
    
    document.querySelectorAll(".sq-btn").forEach(btn => {
      btn.addEventListener("click", () => sendMessage(btn.textContent.trim()));
    });
  }

  /* ===== SCROLL REVEAL ===== */
  const observer = new IntersectionObserver((entries) => {
    let indexCount = 0;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, indexCount * 40);
        indexCount++;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".day-block, .ai-section, .connect-section").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  /* ===== SCROLL PROGRESS BAR ===== */
  const scrollProgress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = pct + "%";
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

});
