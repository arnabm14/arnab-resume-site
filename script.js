// === Navbar scroll effect ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// === Mobile menu ===
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// === Scroll reveal ===
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// === Typing effect (Arnab's actual titles) ===
const typedEl = document.getElementById('typed');
const titles = [
  'Data Engineer @ Google Cloud',
  'Google Cloud Data Engineer Certified',
  'AWS Data Engineer Associate',
  'AWS Solutions Architect Associate',
  '6+ Years in Big Data',
  'Petabyte-Scale Pipeline Architect',
  'PySpark · Kafka · Airflow · Terraform'
];
let titleIdx = 0, charIdx = 0, deleting = false;
function typeLoop() {
  const current = titles[titleIdx];
  typedEl.textContent = current.substring(0, charIdx);
  if (!deleting) {
    charIdx++;
    if (charIdx > current.length) { setTimeout(() => { deleting = true; typeLoop(); }, 2000); return; }
  } else {
    charIdx--;
    if (charIdx === 0) { deleting = false; titleIdx = (titleIdx + 1) % titles.length; }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

// === Animated stat counters ===
const stats = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = +entry.target.dataset.target;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 50));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        entry.target.textContent = current + (target >= 100 ? '+' : '+');
      }, 30);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
stats.forEach(s => statObserver.observe(s));

// === Skill bar animation ===
const skillBars = document.querySelectorAll('.skill-bar-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(bar => skillObserver.observe(bar));

// === Skills Radar Chart ===
let chartRendered = false;
const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !chartRendered) {
      renderRadarChart();
      chartRendered = true;
    }
  });
}, { threshold: 0.3 });

const chartCanvas = document.getElementById('skillsRadarChart');
if (chartCanvas) chartObserver.observe(chartCanvas);

function renderRadarChart() {
  const ctx = document.getElementById('skillsRadarChart').getContext('2d');
  
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)'); // --accent
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)'); // --primary
  
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        'Data Warehousing', 
        'Data Pipelines', 
        'Cloud Infrastructure', 
        'Real-time Streaming', 
        'Data Modeling', 
        'Performance Tuning'
      ],
      datasets: [{
        label: 'Proficiency',
        data: [100, 99, 98, 97, 96, 98],
        backgroundColor: gradient,
        borderColor: '#06b6d4',
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#06b6d4',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10, 15, 30, 0.9)',
          titleFont: { family: 'Outfit', size: 14 },
          bodyFont: { family: 'Inter', size: 13 },
          padding: 12,
          borderColor: 'rgba(65,83,140,0.3)',
          borderWidth: 1
        }
      },
      scales: {
        r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          pointLabels: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 12, weight: '500' }
          },
          ticks: { display: false, min: 0, max: 100 }
        }
      }
    }
  });
}

// === Canvas particle background ===
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.4 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// === Smooth anchor scrolling ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// === AI CHATBOT LOGIC ===
const chatToggle = document.getElementById('chat-toggle');
const chatWidget = document.getElementById('chat-widget');
const closeChat = document.getElementById('close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

chatToggle.addEventListener('click', () => {
  chatWidget.classList.add('active');
  chatToggle.classList.add('hidden');
  setTimeout(() => chatInput.focus(), 300);
});

closeChat.addEventListener('click', () => {
  chatWidget.classList.remove('active');
  chatToggle.classList.remove('hidden');
});

const knowledgeBase = [
  { keywords: ['hi', 'hello', 'hey', 'greetings'], response: "Hello! I'm Arnab's AI assistant. How can I help you today?" },
  { keywords: ['who are you', 'what are you'], response: "I'm a custom AI assistant built directly into Arnab's portfolio. I can answer questions about his experience and skills!" },
  { keywords: ['experience', 'work', 'job'], response: "Arnab has over 6 years of experience. He's currently a Data Engineer at Google Cloud. Before that, he was a Senior Data Engineer II at UsefulBI and a Senior Data Engineer at phData." },
  { keywords: ['google', 'gcp'], response: "At Google Cloud, Arnab engineered real-time data ingestion pipelines into BigQuery for Vertex AI, developed a scalable DAG Factory using Airflow, and deployed complete IaC solutions using Terraform." },
  { keywords: ['usefulbi', 'useful bi'], response: "At UsefulBI, he migrated 15TB of healthcare data to AWS, built pipelines processing 8.5M patient records daily (99.99% uptime), and optimized Databricks clusters to save $200K annually." },
  { keywords: ['phdata', 'migration', 'snowflake'], response: "At phData, Arnab led a massive 400+ Terabyte migration from a Legacy Data Warehouse to Snowflake. He also built a custom migration validation tool to prevent data loss." },
  { keywords: ['skills', 'tech', 'stack'], response: "Arnab is an expert in Cloud (GCP, AWS, Azure), Data Warehousing (BigQuery, Snowflake, Databricks), Languages (Python, PySpark, SQL), and Big Data (Kafka, Airflow, Terraform)." },
  { keywords: ['certification', 'certs', 'certified'], response: "Arnab is triple-certified! He holds the Google Cloud Professional Data Engineer, AWS Data Engineer Associate, and AWS Solutions Architect Associate certifications." },
  { keywords: ['education', 'degree', 'college'], response: "Arnab holds a Bachelor of Technology in Computer Science & Engineering from the Institute of Engineering and Management, Kolkata, graduating with an 8.45 CGPA." },
  { keywords: ['contact', 'email', 'phone', 'hire', 'reach'], response: "You can reach Arnab via email at arnavm014@gmail.com, call him at +91 6290729774, or connect with him on LinkedIn!" },
  { keywords: ['kafka', 'spark', 'airflow', 'dbt', 'terraform'], response: "Yes, Arnab has extensive hands-on experience with modern data stack tools including Kafka, PySpark, Airflow, dbt, and Terraform. Check out his Skills section for more!" }
];

function getBotResponse(input) {
  const normalized = input.toLowerCase();
  for (const item of knowledgeBase) {
    if (item.keywords.some(kw => normalized.includes(kw))) return item.response;
  }
  return "That's a great question! While I don't have the exact answer in my memory bank, Arnab would be happy to discuss it. Feel free to email him at arnavm014@gmail.com!";
}

function addMessage(text, isUser = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
  msgDiv.innerHTML = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message ai-message message-typing';
  typingDiv.id = 'typing-indicator';
  typingDiv.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

function handleSend() {
  const text = chatInput.value.trim();
  if (!text) return;
  
  addMessage(text, true);
  chatInput.value = '';
  
  showTypingIndicator();
  
  setTimeout(() => {
    removeTypingIndicator();
    const response = getBotResponse(text);
    addMessage(response, false);
  }, 1000 + Math.random() * 1000);
}

sendBtn.addEventListener('click', handleSend);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSend();
});
