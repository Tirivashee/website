// BALLYLIKE Style Quiz
// Discover your urban fashion archetype

(function() {
  'use strict';

  // Quiz Data
  const questions = [
    {
      id: 1,
      text: "What's your go-to weekend activity?",
      answers: [
        { text: "Church service & community events", emoji: "⛪", scores: { faith: 3, culture: 1, creative: 1 } },
        { text: "Exploring street art & urban scenes", emoji: "🎨", scores: { creative: 3, culture: 2, faith: 0 } },
        { text: "Hitting the gym or sports court", emoji: "💪", scores: { performance: 3, culture: 1, faith: 1 } },
        { text: "Vibing at local music events", emoji: "🎵", scores: { culture: 3, creative: 2, faith: 0 } }
      ]
    },
    {
      id: 2,
      text: "Pick your ideal outfit vibe:",
      answers: [
        { text: "Clean, minimal, with purpose", emoji: "🤍", scores: { faith: 2, minimalist: 3, performance: 1 } },
        { text: "Bold colors & statement pieces", emoji: "🔥", scores: { creative: 3, culture: 2, faith: 0 } },
        { text: "Comfortable & functional", emoji: "👟", scores: { performance: 3, culture: 1, creative: 1 } },
        { text: "Mix of vintage & modern", emoji: "✨", scores: { culture: 2, creative: 3, faith: 1 } }
      ]
    },
    {
      id: 3,
      text: "What inspires your fashion choices?",
      answers: [
        { text: "Faith & spiritual values", emoji: "🙏", scores: { faith: 3, culture: 0, creative: 1 } },
        { text: "Street culture & trends", emoji: "🛹", scores: { culture: 3, creative: 1, faith: 0 } },
        { text: "Artistic expression & creativity", emoji: "🎭", scores: { creative: 3, culture: 1, faith: 1 } },
        { text: "Function & performance", emoji: "⚡", scores: { performance: 3, culture: 1, creative: 0 } }
      ]
    },
    {
      id: 4,
      text: "Your dream collaboration brand:",
      answers: [
        { text: "Mission-driven faith brand", emoji: "✝️", scores: { faith: 3, minimalist: 1, culture: 0 } },
        { text: "High-end streetwear label", emoji: "💎", scores: { culture: 3, creative: 2, faith: 0 } },
        { text: "Independent art collective", emoji: "🖼️", scores: { creative: 3, culture: 1, faith: 1 } },
        { text: "Performance sportswear", emoji: "🏃", scores: { performance: 3, culture: 1, creative: 0 } }
      ]
    },
    {
      id: 5,
      text: "What's in your daily carry?",
      answers: [
        { text: "Bible, journal, simple essentials", emoji: "📖", scores: { faith: 3, minimalist: 2, culture: 0 } },
        { text: "Sketchbook, headphones, camera", emoji: "📷", scores: { creative: 3, culture: 1, faith: 0 } },
        { text: "Water bottle, gym gear, protein", emoji: "💧", scores: { performance: 3, culture: 0, creative: 0 } },
        { text: "Phone, wallet, statement accessories", emoji: "📱", scores: { culture: 2, creative: 2, faith: 0 } }
      ]
    },
    {
      id: 6,
      text: "Choose your color palette:",
      answers: [
        { text: "Earth tones & neutral whites", emoji: "🤎", scores: { faith: 2, minimalist: 3, creative: 0 } },
        { text: "Bold black & white contrast", emoji: "⚫", scores: { culture: 2, minimalist: 2, creative: 1 } },
        { text: "Vibrant oranges & energetic hues", emoji: "🧡", scores: { creative: 3, culture: 2, faith: 0 } },
        { text: "Technical grays & performance colors", emoji: "⚪", scores: { performance: 3, minimalist: 1, culture: 0 } }
      ]
    },
    {
      id: 7,
      text: "Your fashion role model:",
      answers: [
        { text: "Someone with strong values & purpose", emoji: "🌟", scores: { faith: 3, culture: 1, creative: 0 } },
        { text: "Bold artist who breaks boundaries", emoji: "🎨", scores: { creative: 3, culture: 2, faith: 0 } },
        { text: "Street style icon with authenticity", emoji: "🔥", scores: { culture: 3, creative: 1, faith: 1 } },
        { text: "Athlete with performance-driven style", emoji: "🏆", scores: { performance: 3, culture: 1, creative: 0 } }
      ]
    },
    {
      id: 8,
      text: "Complete this phrase: Fashion is...",
      answers: [
        { text: "A form of worship & testimony", emoji: "✨", scores: { faith: 3, culture: 0, creative: 1 } },
        { text: "Self-expression & storytelling", emoji: "📝", scores: { creative: 3, culture: 1, faith: 1 } },
        { text: "Cultural identity & connection", emoji: "🌍", scores: { culture: 3, creative: 1, faith: 1 } },
        { text: "Functional art for movement", emoji: "🏃", scores: { performance: 3, creative: 1, culture: 0 } }
      ]
    }
  ];

  // Style Archetypes
  const archetypes = {
    faith: {
      title: "FAITH WARRIOR",
      subtitle: "The Purpose-Driven Dresser",
      icon: "✝️",
      description: "You dress with intention and purpose. Every piece in your wardrobe tells a story of faith, values, and conviction. You believe fashion is a form of testimony—simple, meaningful, and impactful. Your style is clean, purposeful, and rooted in something greater than trends.",
      traits: [
        { label: "Style Philosophy", value: "Purpose Over Trends" },
        { label: "Core Value", value: "Authenticity" },
        { label: "Vibe", value: "Intentional & Grounded" },
        { label: "Shopping Style", value: "Quality Investments" }
      ],
      products: ['prod-t.jpg', 'prod-c.jpg', 'prod-bcsb.jpg', 'prod-bcs.jpg']
    },
    creative: {
      title: "CREATIVE SOUL",
      subtitle: "The Artistic Visionary",
      icon: "🎨",
      description: "You see fashion as your canvas. Bold colors, unique combinations, and artistic expression define your style. You're not afraid to experiment, mix patterns, or stand out. Your wardrobe is an ever-evolving gallery of your creative journey.",
      traits: [
        { label: "Style Philosophy", value: "Fashion As Art" },
        { label: "Core Value", value: "Self-Expression" },
        { label: "Vibe", value: "Bold & Original" },
        { label: "Shopping Style", value: "Unique Finds" }
      ],
      products: ['prod-hpo.jpg', 'prod-ocsb.jpg', 'prod-ocs.jpg', 'prod-hpy.jpg']
    },
    culture: {
      title: "STREET PROPHET",
      subtitle: "The Urban Storyteller",
      icon: "🌍",
      description: "You embody the spirit of the streets. Your style blends global influences with local pride, creating a unique urban narrative. You're connected to your roots while staying current with street culture. Fashion for you is about community, authenticity, and cultural pride.",
      traits: [
        { label: "Style Philosophy", value: "Culture First" },
        { label: "Core Value", value: "Authenticity" },
        { label: "Vibe", value: "Urban & Connected" },
        { label: "Shopping Style", value: "Streetwear Essentials" }
      ],
      products: ['prod-bcs.jpg', 'prod-t.jpg', 'prod-bcsb.jpg', 'prod-c.jpg']
    },
    performance: {
      title: "PERFORMANCE PIONEER",
      subtitle: "The Functional Stylist",
      icon: "⚡",
      description: "Function meets fashion in your world. You value comfort, durability, and performance without sacrificing style. Versatile wear is your foundation, and you elevate it for any occasion. Your style is about being ready for anything while looking sharp.",
      traits: [
        { label: "Style Philosophy", value: "Form Follows Function" },
        { label: "Core Value", value: "Versatility" },
        { label: "Vibe", value: "Active & Sharp" },
        { label: "Shopping Style", value: "Performance First" }
      ],
      products: ['prod-c.jpg', 'prod-bcs.jpg', 'prod-t.jpg', 'prod-hpb.jpg']
    },
    minimalist: {
      title: "MINIMALIST MAVEN",
      subtitle: "The Refined Essential",
      icon: "⚪",
      description: "Less is more in your wardrobe. You believe in quality over quantity, clean lines over chaos, and timeless pieces over fleeting trends. Your style is sophisticated, intentional, and effortlessly put together. Every piece has purpose.",
      traits: [
        { label: "Style Philosophy", value: "Quality Over Quantity" },
        { label: "Core Value", value: "Simplicity" },
        { label: "Vibe", value: "Refined & Timeless" },
        { label: "Shopping Style", value: "Curated Essentials" }
      ],
      products: ['prod-bcsb.jpg', 'prod-hpb.jpg', 'prod-c.jpg', 'prod-bcs.jpg']
    }
  };

  // DOM Elements
  const startSection = document.getElementById('startSection');
  const questionsSection = document.getElementById('questionsSection');
  const resultsSection = document.getElementById('resultsSection');
  const startBtn = document.getElementById('startBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const retakeBtn = document.getElementById('retakeBtn');
  const shareResultBtn = document.getElementById('shareResultBtn');
  const progressBar = document.getElementById('progressBar');
  const questionContainer = document.getElementById('questionContainer');

  // State
  let currentQuestion = 0;
  let answers = [];
  let scores = {
    faith: 0,
    creative: 0,
    culture: 0,
    performance: 0,
    minimalist: 0
  };

  // Initialize
  function init() {
    startBtn.addEventListener('click', startQuiz);
    prevBtn.addEventListener('click', previousQuestion);
    nextBtn.addEventListener('click', nextQuestion);
    retakeBtn.addEventListener('click', resetQuiz);
    shareResultBtn.addEventListener('click', shareResult);
  }

  // Start quiz
  function startQuiz() {
    startSection.classList.remove('active');
    questionsSection.classList.add('active');
    renderQuestion();
    updateProgress();
  }

  // Render current question
  function renderQuestion() {
    const question = questions[currentQuestion];
    
    questionContainer.innerHTML = `
      <div class="question-number">QUESTION ${currentQuestion + 1} OF ${questions.length}</div>
      <div class="question-text">${question.text}</div>
      <div class="answers-grid">
        ${question.answers.map((answer, index) => `
          <div class="answer-option ${answers[currentQuestion] === index ? 'selected' : ''}" 
               data-index="${index}">
            <span class="answer-emoji">${answer.emoji}</span>
            <div class="answer-text">${answer.text}</div>
          </div>
        `).join('')}
      </div>
    `;

    // Add click handlers
    document.querySelectorAll('.answer-option').forEach(option => {
      option.addEventListener('click', function() {
        selectAnswer(parseInt(this.dataset.index));
      });
    });

    updateButtons();
  }

  // Select answer
  function selectAnswer(index) {
    answers[currentQuestion] = index;
    
    // Update visual selection
    document.querySelectorAll('.answer-option').forEach((option, i) => {
      if (i === index) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });

    // Calculate scores
    const question = questions[currentQuestion];
    const selectedAnswer = question.answers[index];
    
    // Clear previous scores for this question
    if (currentQuestion > 0) {
      const prevAnswer = questions[currentQuestion].answers[answers[currentQuestion]];
      if (prevAnswer) {
        Object.keys(prevAnswer.scores).forEach(key => {
          scores[key] = Math.max(0, scores[key] - prevAnswer.scores[key]);
        });
      }
    }
    
    // Add new scores
    Object.keys(selectedAnswer.scores).forEach(key => {
      scores[key] += selectedAnswer.scores[key];
    });

    updateButtons();
  }

  // Update navigation buttons
  function updateButtons() {
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.disabled = answers[currentQuestion] === undefined;
    
    if (currentQuestion === questions.length - 1 && answers[currentQuestion] !== undefined) {
      nextBtn.textContent = 'SEE RESULTS →';
    } else {
      nextBtn.textContent = 'NEXT →';
    }
  }

  // Next question
  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion();
      updateProgress();
      questionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      showResults();
    }
  }

  // Previous question
  function previousQuestion() {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion();
      updateProgress();
      questionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Update progress bar
  function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // Show results
  function showResults() {
    // Calculate dominant archetype
    const dominantType = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );
    
    const archetype = archetypes[dominantType];
    
    // Update results display
    document.getElementById('resultIcon').textContent = archetype.icon;
    document.getElementById('resultTitle').textContent = archetype.title;
    document.getElementById('resultSubtitle').textContent = archetype.subtitle;
    document.getElementById('resultDescription').textContent = archetype.description;
    
    // Render traits
    const traitsHtml = archetype.traits.map(trait => `
      <div class="trait-item">
        <div class="trait-label">${trait.label}</div>
        <div class="trait-value">${trait.value}</div>
      </div>
    `).join('');
    document.getElementById('resultTraits').innerHTML = traitsHtml;
    
    // Render product recommendations
    const productsHtml = archetype.products.map(product => `
      <a href="shop.html" class="card product-card">
        <div class="card-image-wrapper">
          <img src="assets/images/products/${product}" alt="Recommended product" class="card-image" loading="lazy">
          <div class="product-overlay">
            <button class="btn btn-secondary">SHOP</button>
          </div>
        </div>
      </a>
    `).join('');
    document.getElementById('recommendedProducts').innerHTML = productsHtml;
    
    // Show results section
    questionsSection.classList.remove('active');
    resultsSection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Reset quiz
  function resetQuiz() {
    currentQuestion = 0;
    answers = [];
    scores = {
      faith: 0,
      creative: 0,
      culture: 0,
      performance: 0,
      minimalist: 0
    };
    
    resultsSection.classList.remove('active');
    startSection.classList.add('active');
    progressBar.style.width = '0%';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Share result
  function shareResult() {
    const title = document.getElementById('resultTitle').textContent;
    const subtitle = document.getElementById('resultSubtitle').textContent;
    const text = `I'm a ${title} - ${subtitle}! 🔥\n\nFind your BALLYLIKE style archetype at ballylike.co.zw/quiz.html`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My BALLYLIKE Style',
        text: text,
        url: window.location.href
      }).catch(err => console.log('Share cancelled'));
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('Result copied to clipboard! Share it on social media 🔥');
      }).catch(() => {
        alert('Share: ' + text);
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
