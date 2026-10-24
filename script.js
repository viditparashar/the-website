/**
 * Dynamic Interactions & Game Engine for Bubu & Vidit's Anniversary
 * Taylor Swift + The Big Bang Theory Themed
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Music Autoplay & Controls
  const bgAudio = document.getElementById('bg-audio');
  const musicToggle = document.getElementById('music-toggle');
  const audioBanner = document.getElementById('audio-banner');
  let isPlaying = false;

  function attemptPlayAudio() {
    bgAudio.play().then(() => {
      isPlaying = true;
      musicToggle.classList.add('playing');
      audioBanner.classList.add('hidden');
    }).catch(err => {
      // Autoplay blocked by browser policy, keep prompt banner visible
      console.log('Autoplay blocked initially, awaiting user gesture:', err);
    });
  }

  // Attempt initial play
  attemptPlayAudio();

  // Any first user click unlocks music seamlessly if blocked
  const userGestureUnlock = () => {
    if (!isPlaying) {
      attemptPlayAudio();
    }
    document.removeEventListener('click', userGestureUnlock);
    document.removeEventListener('keydown', userGestureUnlock);
    document.removeEventListener('touchstart', userGestureUnlock);
  };
  document.addEventListener('click', userGestureUnlock);
  document.addEventListener('keydown', userGestureUnlock);
  document.addEventListener('touchstart', userGestureUnlock);

  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      bgAudio.pause();
      isPlaying = false;
      musicToggle.classList.remove('playing');
    } else {
      bgAudio.play();
      isPlaying = true;
      musicToggle.classList.add('playing');
      audioBanner.classList.add('hidden');
    }
  });

  audioBanner.addEventListener('click', () => {
    attemptPlayAudio();
  });

  // 2. Sheldon Knocking Easter Egg: (Knock Knock Knock Bubu! Knock Knock Knock Miru! Knock Knock Knock Vaishnavi!)
  const sheldonKnockBtn = document.getElementById('sheldon-knock-btn');
  const knockModal = document.getElementById('knock-container');
  const knockStepText = document.getElementById('knock-step-text');
  const knockDots = document.querySelectorAll('.knock-dot');
  let knockCount = 0;
  let knockActive = false;

  const knocks = [
    { text: "✊ Knock knock knock... Bubu! ❤️", dot: 0 },
    { text: "✊ Knock knock knock... Miru! ✨", dot: 1 },
    { text: "✊ Knock knock knock... Vaishnavi! 🥰", dot: 2 },
    { text: "🎉 BAZINGA! Happy 6 Months to the love of my life! 💍", dot: -1 }
  ];

  sheldonKnockBtn.addEventListener('click', () => {
    if (knockActive) return;
    knockActive = true;
    knockCount = 0;
    knockModal.classList.add('active');
    triggerKnockSequence();
  });

  function triggerKnockSequence() {
    if (knockCount < knocks.length) {
      const current = knocks[knockCount];
      knockStepText.textContent = current.text;
      
      knockDots.forEach((dot, idx) => {
        if (idx <= current.dot) dot.classList.add('active');
        else dot.classList.remove('active');
      });

      // Play soft tap sound effect using Web Audio API
      playGentleKnockSound();

      if (knockCount === 3) {
        shootCelebrationConfetti();
      }

      knockCount++;
      setTimeout(triggerKnockSequence, 1400);
    } else {
      setTimeout(() => {
        knockModal.classList.remove('active');
        knockDots.forEach(dot => dot.classList.remove('active'));
        knockActive = false;
      }, 2500);
    }
  }

  function playGentleKnockSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch(e) {
      // AudioContext not allowed or unsupported
    }
  }

  // 3. Polaroid Lightbox
  const polaroids = document.querySelectorAll('.polaroid-card');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  polaroids.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.polaroid-caption');
      lightboxImg.src = img.src;
      lightboxCaption.textContent = caption ? caption.textContent : 'Bubu & Vidit ❤️';
      lightbox.classList.add('active');
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  // 4. Anniversary Trivia Quiz (TBBT + Taylor Swift + Us)
  const quizQuestions = [
    {
      label: "Question 1 of 5 • Our Cosmic Origin",
      question: "What was the first metro station we met at?",
      options: [
        { text: "Hauz Khas", key: "A" },
        { text: "Erragadda", key: "B" },
        { text: "Begumpet", key: "C" },
        { text: "Ameerpet", key: "D" }
      ],
      correctKey: "D",
      isCustomLove: false,
      wrongMsg: "Try Again yar! Ameerpet metro station bhool gayi kya Bubu? 🥺"
    },
    {
      label: "Question 2 of 5 • The Big Bang Theory Romantic Physics",
      question: "What deeply personal and romantic gesture does Sheldon make for Amy on their first Valentine's Day together on a train?",
      options: [
        { text: "He gives her a heartfelt kiss in the dining car.", key: "A" },
        { text: "He writes her a custom song on the ukulele.", key: "B" },
        { text: "He presents her with a signed vintage comic book.", key: "C" },
        { text: "He names a newly discovered asteroid after her.", key: "D" }
      ],
      correctKey: "A",
      isCustomLove: false,
      wrongMsg: "COME ON YAR! Sheldon Cooper stopped talking about trains and kissed Amy! 🚂💋"
    },
    {
      label: "Question 3 of 5 • Taylor Swift 'Lover' Lore",
      question: "In the song 'Lover,' Taylor Swift famously sings about trading her winter coats and cash, but what iconic home is she referring to when she says, 'We could leave the Christmas lights up 'til January'?",
      options: [
        { text: "A childhood bedroom", key: "A" },
        { text: "Her cozy apartment (creating a romantic sanctuary)", key: "B" },
        { text: "A rented beach house", key: "C" },
        { text: "An old country estate", key: "D" }
      ],
      correctKey: "B",
      isCustomLove: false,
      wrongMsg: "KOI NI I STILL LOVE YOU, but it's the cozy apartment sanctuary Swiftie Bubu! 🎄✨"
    },
    {
      label: "Question 4 of 5 • Crucial Life Inquiries",
      question: "Are you my pyaru bubu?",
      options: [
        { text: "No", key: "A" },
        { text: "Ba", key: "B" },
        { text: "Option A", key: "C" },
        { text: "YES YES YES ❤️", key: "D" }
      ],
      correctKey: "D",
      isCustomLove: false,
      wrongMsg: "BUBUUU KYA HAI I LOVE YOU NA! You have to click YES YES YES! 😤❤️"
    },
    {
      label: "Question 5 of 5 • The Quantum Boundless Equation",
      question: "How much do I love my bubu?",
      options: [
        { text: "47", key: "A" },
        { text: "50 Rupees", key: "B" },
        { text: "1 Tonne", key: "C" },
        { text: "360000000 Lakh Crore Pucchi Discount", key: "D" }
      ],
      correctKey: "ALL", // Any option is correct because love is infinite!
      isCustomLove: true,
      customMsg: "YAYYYYYYY WOOOO I LOVE YOUUU BAHAUT ZYADAAAAAAA * INFINITY * MORERER ❤️❤️❤️"
    }
  ];

  const correctRandomResponses = [
    "Arey wah! 🌟 Bubu is a genius!",
    "HIGH FIVE MERA BUBU! 🙌❤️",
    "OYE BAS KARO BHAI! Itna accurate?! 😍",
    "Bazinga! Sheldon would be proud of you Miru!"
  ];

  let currentQuestionIdx = 0;
  let score = 0;

  const quizCard = document.getElementById('quiz-box');
  const quizResults = document.getElementById('quiz-results');
  const qLabelEl = document.getElementById('q-label');
  const qTextEl = document.getElementById('q-text');
  const optionsGridEl = document.getElementById('options-grid');
  const quizFeedbackEl = document.getElementById('quiz-feedback');
  const nextQBtn = document.getElementById('next-q-btn');
  const quizProgressFill = document.getElementById('quiz-progress-fill');

  function renderQuestion(idx) {
    const q = quizQuestions[idx];
    qLabelEl.textContent = q.label;
    qTextEl.textContent = q.question;
    optionsGridEl.innerHTML = '';
    quizFeedbackEl.className = 'quiz-feedback-box';
    quizFeedbackEl.style.display = 'none';
    nextQBtn.style.display = 'none';

    quizProgressFill.style.width = `${((idx + 1) / quizQuestions.length) * 100}%`;

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="opt-prefix">${opt.key}</span> <span>${opt.text}</span>`;
      btn.addEventListener('click', () => handleOptionSelect(opt.key, btn, q));
      optionsGridEl.appendChild(btn);
    });
  }

  function handleOptionSelect(selectedKey, clickedBtn, q) {
    const allOptionBtns = optionsGridEl.querySelectorAll('.option-btn');
    
    if (q.isCustomLove) {
      // Any button triggers ultimate love victory
      clickedBtn.classList.add('correct');
      allOptionBtns.forEach(b => b.disabled = true);
      quizFeedbackEl.textContent = q.customMsg;
      quizFeedbackEl.className = 'quiz-feedback-box correct';
      quizFeedbackEl.style.display = 'block';
      nextQBtn.style.display = 'inline-block';
      nextQBtn.textContent = "Claim Relationship Certificate 📜";
      score++;
      shootCelebrationConfetti();
      return;
    }

    if (selectedKey === q.correctKey) {
      clickedBtn.classList.add('correct');
      allOptionBtns.forEach(b => b.disabled = true);
      const randomCheers = correctRandomResponses[Math.floor(Math.random() * correctRandomResponses.length)];
      quizFeedbackEl.textContent = randomCheers;
      quizFeedbackEl.className = 'quiz-feedback-box correct';
      quizFeedbackEl.style.display = 'block';
      nextQBtn.style.display = 'inline-block';
      nextQBtn.textContent = (currentQuestionIdx === quizQuestions.length - 1) ? "View Final Result 🎉" : "Next Question →";
      score++;
      shootCelebrationConfetti();
    } else {
      clickedBtn.classList.add('wrong');
      quizFeedbackEl.textContent = q.wrongMsg;
      quizFeedbackEl.className = 'quiz-feedback-box wrong';
      quizFeedbackEl.style.display = 'block';
      nextQBtn.style.display = 'none'; // NEVER show next button on wrong answer
    }
  }

  nextQBtn.addEventListener('click', () => {
    currentQuestionIdx++;
    if (currentQuestionIdx < quizQuestions.length) {
      renderQuestion(currentQuestionIdx);
    } else {
      // Show Final Certificate
      quizCard.style.display = 'none';
      quizResults.classList.add('active');
      shootCelebrationConfetti();
      setTimeout(shootCelebrationConfetti, 1000);
    }
  });

  // Retake quiz button
  document.getElementById('retake-quiz-btn').addEventListener('click', () => {
    currentQuestionIdx = 0;
    score = 0;
    quizResults.classList.remove('active');
    quizCard.style.display = 'block';
    renderQuestion(0);
  });

  // Initial render of Question 1
  renderQuestion(0);

  // 5. Canvas Floating Hearts & Starlight Particle Background
  initAmbientBackground();

  // 6. Confetti Cannon
  window.shootCelebrationConfetti = function() {
    createConfettiBurst();
  };
});

/**
 * Ambient Particle Background (Soft Green Hearts, Tiny Stars, Soft Circles)
 */
function initAmbientBackground() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(35, Math.floor(width / 35));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 4,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -(Math.random() * 0.6 + 0.3),
      type: Math.random() > 0.4 ? 'heart' : 'circle',
      color: Math.random() > 0.5 ? 'rgba(82, 121, 111, 0.25)' : 'rgba(132, 169, 140, 0.35)',
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 0.02
    });
  }

  function drawHeart(ctx, x, y, size, color) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.scale(size / 14, size / 14);
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-5, -5, -10, 2, 0, 10);
    ctx.bezierCurveTo(10, 2, 5, -5, 0, 0);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.angle += p.spin;

      if (p.y < -20) {
        p.y = height + 20;
        p.x = Math.random() * width;
      }
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      if (p.type === 'heart') {
        drawHeart(ctx, p.x, p.y, p.size, p.color);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/**
 * Festive Confetti Cannon
 */
function createConfettiBurst() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiPieces = [];
  const colors = ['#3a7d44', '#84a98c', '#cad2c5', '#f5b041', '#ff6b8b', '#2c5e3b', '#fff'];

  for (let i = 0; i < 90; i++) {
    confettiPieces.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.45 + (Math.random() - 0.5) * 100,
      w: Math.random() * 9 + 4,
      h: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 1.2) * 16,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 14,
      gravity: 0.38,
      opacity: 1
    });
  }

  let frames = 0;
  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    confettiPieces.forEach(c => {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.rot += c.rotSpeed;
      c.opacity -= 0.009;

      if (c.opacity > 0 && c.y < canvas.height + 20) {
        activeCount++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, c.opacity);
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rot * Math.PI) / 180);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }
    });

    frames++;
    if (activeCount > 0 && frames < 150) {
      requestAnimationFrame(updateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  updateConfetti();
}
