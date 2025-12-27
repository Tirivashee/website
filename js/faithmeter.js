// BALLYLIKE Faith Meter
// Values alignment assessment

(function() {
  'use strict';

  // Assessment Questions (10 questions)
  const questions = [
    {
      id: 1,
      text: "How important is faith in your daily decision-making?",
      options: [
        { text: "It guides every choice I make", value: 10 },
        { text: "Very important, influences most decisions", value: 8 },
        { text: "Somewhat important, I consider it", value: 5 },
        { text: "Occasionally think about it", value: 3 },
        { text: "Not a major factor", value: 1 }
      ],
      pillar: 'faith'
    },
    {
      id: 2,
      text: "How do you view your personal style and fashion choices?",
      options: [
        { text: "As an expression of my faith and values", value: 10 },
        { text: "Should reflect who I am spiritually", value: 8 },
        { text: "Important but separate from faith", value: 5 },
        { text: "Mainly about trends and aesthetics", value: 3 },
        { text: "Just clothing, no deeper meaning", value: 1 }
      ],
      pillar: 'purpose'
    },
    {
      id: 3,
      text: "How often do you seek to inspire or uplift others?",
      options: [
        { text: "Daily, it's part of my mission", value: 10 },
        { text: "Frequently, when opportunities arise", value: 8 },
        { text: "Sometimes, if I remember", value: 5 },
        { text: "Rarely, not a priority", value: 3 },
        { text: "Not something I focus on", value: 1 }
      ],
      pillar: 'community'
    },
    {
      id: 4,
      text: "When facing challenges, where do you find strength?",
      options: [
        { text: "Through prayer and faith", value: 10 },
        { text: "Faith combined with action", value: 8 },
        { text: "Mix of faith and self-reliance", value: 5 },
        { text: "Mostly within myself", value: 3 },
        { text: "External circumstances and luck", value: 1 }
      ],
      pillar: 'faith'
    },
    {
      id: 5,
      text: "How do you define 'success' in life?",
      options: [
        { text: "Living in alignment with God's purpose", value: 10 },
        { text: "Making a positive impact on others", value: 8 },
        { text: "Balance of personal and spiritual growth", value: 6 },
        { text: "Achieving personal goals and dreams", value: 3 },
        { text: "Financial stability and comfort", value: 1 }
      ],
      pillar: 'purpose'
    },
    {
      id: 6,
      text: "How important is community and connection in your life?",
      options: [
        { text: "Essential, we're stronger together", value: 10 },
        { text: "Very important, I prioritize relationships", value: 8 },
        { text: "Important but I value independence too", value: 5 },
        { text: "Somewhat important", value: 3 },
        { text: "I prefer solitude", value: 1 }
      ],
      pillar: 'community'
    },
    {
      id: 7,
      text: "How do you approach giving back or helping others?",
      options: [
        { text: "It's a calling, I do it regularly", value: 10 },
        { text: "Important priority in my life", value: 8 },
        { text: "Try to help when I can", value: 5 },
        { text: "Occasionally, if convenient", value: 3 },
        { text: "Focus on my own needs first", value: 1 }
      ],
      pillar: 'community'
    },
    {
      id: 8,
      text: "What role does authenticity play in how you present yourself?",
      options: [
        { text: "Being genuine is non-negotiable", value: 10 },
        { text: "Very important, guides my choices", value: 8 },
        { text: "Important but I adapt to situations", value: 5 },
        { text: "Depends on the context", value: 3 },
        { text: "Image matters more than authenticity", value: 1 }
      ],
      pillar: 'authenticity'
    },
    {
      id: 9,
      text: "How do you view the connection between faith and creativity?",
      options: [
        { text: "My creativity is a gift to honor God", value: 10 },
        { text: "Faith deeply inspires my expression", value: 8 },
        { text: "They can coexist harmoniously", value: 5 },
        { text: "They're separate aspects of life", value: 3 },
        { text: "Creativity is purely self-driven", value: 1 }
      ],
      pillar: 'purpose'
    },
    {
      id: 10,
      text: "What motivates you to be your best self?",
      options: [
        { text: "Desire to honor God in all I do", value: 10 },
        { text: "Living out my faith and purpose", value: 8 },
        { text: "Personal growth and self-improvement", value: 5 },
        { text: "Achieving recognition and success", value: 3 },
        { text: "Meeting basic expectations", value: 1 }
      ],
      pillar: 'faith'
    }
  ];

  // Alignment levels
  const alignmentLevels = [
    {
      min: 90,
      max: 100,
      title: "FAITH CHAMPION",
      description: "Your values are deeply aligned with BALLYLIKE's mission. You live with purpose, lead with faith, and inspire others through authentic expression. Your commitment to faith-driven living is exemplary, and you understand that fashion can be a powerful testimony. You're not just wearing clothes—you're wearing your values."
    },
    {
      min: 75,
      max: 89,
      title: "PURPOSE WARRIOR",
      description: "You have strong alignment with faith-centered values and understand the importance of living with intention. Your faith guides many of your choices, and you recognize the connection between what you wear and who you are. You're on a meaningful journey of faith and self-expression."
    },
    {
      min: 60,
      max: 74,
      title: "GROWING BELIEVER",
      description: "You're developing a faith-driven approach to life and style. While you value authenticity and purpose, there's room to deepen your connection between faith and daily choices. You're open to exploring how your values can shape your expression and impact."
    },
    {
      min: 40,
      max: 59,
      title: "SEEKER",
      description: "You're exploring the intersection of faith, values, and personal expression. While some aspects resonate with you, you're still discovering how to integrate purpose-driven living into your daily life. This is a great time to reflect on what truly matters to you."
    },
    {
      min: 0,
      max: 39,
      title: "EXPLORER",
      description: "You're at the beginning of your journey toward faith-centered living. There's significant opportunity to explore how values, purpose, and authenticity can enrich your life. Consider taking time to reflect on what matters most and how your choices can reflect your deeper beliefs."
    }
  ];

  // Value Pillars
  const pillars = {
    faith: { name: 'Faith Foundation', icon: '✝️' },
    purpose: { name: 'Purpose Driven', icon: '🎯' },
    community: { name: 'Community Heart', icon: '🤝' },
    authenticity: { name: 'Authentic Self', icon: '💎' }
  };

  // DOM Elements
  const startSection = document.getElementById('startSection');
  const questionsSection = document.getElementById('questionsSection');
  const resultsSection = document.getElementById('resultsSection');
  const startBtn = document.getElementById('startBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const retakeBtn = document.getElementById('retakeBtn');
  const shareBtn = document.getElementById('shareBtn');
  const progressBar = document.getElementById('progressBar');
  const questionCard = document.getElementById('questionCard');

  // State
  let currentQuestion = 0;
  let answers = [];
  let pillarScores = {
    faith: 0,
    purpose: 0,
    community: 0,
    authenticity: 0
  };
  let pillarCounts = {
    faith: 0,
    purpose: 0,
    community: 0,
    authenticity: 0
  };

  // Initialize
  function init() {
    startBtn.addEventListener('click', startAssessment);
    prevBtn.addEventListener('click', previousQuestion);
    nextBtn.addEventListener('click', nextQuestion);
    retakeBtn.addEventListener('click', resetAssessment);
    shareBtn.addEventListener('click', shareResult);
  }

  // Start assessment
  function startAssessment() {
    startSection.classList.remove('active');
    questionsSection.classList.add('active');
    renderQuestion();
    updateProgress();
  }

  // Render current question
  function renderQuestion() {
    const question = questions[currentQuestion];
    
    questionCard.innerHTML = `
      <div class="question-badge">${currentQuestion + 1}/${questions.length}</div>
      <div class="question-title">${question.text}</div>
      <div class="scale-container">
        ${question.options.map((option, index) => `
          <div class="scale-option ${answers[currentQuestion] === index ? 'selected' : ''}" 
               data-index="${index}">
            <div class="scale-radio"></div>
            <div class="scale-text">${option.text}</div>
          </div>
        `).join('')}
      </div>
    `;

    // Add click handlers
    document.querySelectorAll('.scale-option').forEach(option => {
      option.addEventListener('click', function() {
        selectAnswer(parseInt(this.dataset.index));
      });
    });

    updateButtons();
  }

  // Select answer
  function selectAnswer(index) {
    const question = questions[currentQuestion];
    const oldAnswer = answers[currentQuestion];
    
    // Remove old score if changing answer
    if (oldAnswer !== undefined) {
      const oldOption = question.options[oldAnswer];
      pillarScores[question.pillar] -= oldOption.value;
    }
    
    // Store new answer
    answers[currentQuestion] = index;
    
    // Add new score
    const newOption = question.options[index];
    pillarScores[question.pillar] += newOption.value;
    
    // Update pillar count (for first-time answers)
    if (oldAnswer === undefined) {
      pillarCounts[question.pillar]++;
    }
    
    // Update visual selection
    document.querySelectorAll('.scale-option').forEach((option, i) => {
      if (i === index) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
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
      questionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      questionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Update progress bar
  function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // Show results
  function showResults() {
    // Calculate overall alignment percentage
    const totalPossible = questions.length * 10;
    const totalScore = Object.values(pillarScores).reduce((a, b) => a + b, 0);
    const alignmentPercent = Math.round((totalScore / totalPossible) * 100);
    
    // Find alignment level
    const level = alignmentLevels.find(l => alignmentPercent >= l.min && alignmentPercent <= l.max);
    
    // Update certificate
    document.getElementById('alignmentScore').textContent = `${alignmentPercent}%`;
    document.getElementById('alignmentTitle').textContent = level.title;
    document.getElementById('alignmentDescription').textContent = level.description;
    
    // Calculate individual pillar percentages
    const pillarPercentages = {};
    Object.keys(pillarScores).forEach(pillar => {
      const maxScore = pillarCounts[pillar] * 10;
      pillarPercentages[pillar] = maxScore > 0 ? Math.round((pillarScores[pillar] / maxScore) * 100) : 0;
    });
    
    // Render value pillars
    const pillarsHtml = Object.keys(pillars).map(key => `
      <div class="pillar-item">
        <div class="pillar-icon">${pillars[key].icon}</div>
        <div class="pillar-name">${pillars[key].name}</div>
        <div class="pillar-score">${pillarPercentages[key]}%</div>
      </div>
    `).join('');
    document.getElementById('valuePillars').innerHTML = pillarsHtml;
    
    // Product recommendations based on score
    const products = getRecommendedProducts(alignmentPercent);
    const productsHtml = products.map(product => `
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
    
    // Save result to localStorage (for future rewards system)
    localStorage.setItem('ballylike_faith_meter_score', alignmentPercent);
    localStorage.setItem('ballylike_faith_meter_completed', 'true');
  }

  // Get recommended products based on score
  function getRecommendedProducts(score) {
    if (score >= 75) {
      // High alignment: faith-focused products
      return ['prod-t.jpg', 'prod-c.jpg', 'prod-bcsb.jpg', 'prod-bcs.jpg'];
    } else if (score >= 50) {
      // Medium alignment: balanced selection
      return ['prod-bcs.jpg', 'prod-hpb.jpg', 'prod-t.jpg', 'prod-c.jpg'];
    } else {
      // Lower alignment: accessible entry products
      return ['prod-c.jpg', 'prod-hpb.jpg', 'prod-bcsb.jpg', 'prod-ocs.jpg'];
    }
  }

  // Reset assessment
  function resetAssessment() {
    currentQuestion = 0;
    answers = [];
    pillarScores = {
      faith: 0,
      purpose: 0,
      community: 0,
      authenticity: 0
    };
    pillarCounts = {
      faith: 0,
      purpose: 0,
      community: 0,
      authenticity: 0
    };
    
    resultsSection.classList.remove('active');
    startSection.classList.add('active');
    progressBar.style.width = '0%';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Share result
  function shareResult() {
    const score = document.getElementById('alignmentScore').textContent;
    const title = document.getElementById('alignmentTitle').textContent;
    const text = `I scored ${score} on the BALLYLIKE Faith Meter!\n\nMy alignment: ${title}\n\nDiscover your values alignment at ballylike.co.zw/faithmeter.html`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My BALLYLIKE Faith Meter Result',
        text: text,
        url: window.location.href
      }).catch(err => console.log('Share cancelled'));
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('Result copied to clipboard! Share it on social media 🙏');
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
