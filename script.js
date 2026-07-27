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
          min: 0,
          max: 100,
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          pointLabels: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 12, weight: '500' }
          },
          ticks: { display: false }
        }
      }
    }
  });
}

// === Canvas particle background ===
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let shootingStars = [];
let mouse = { x: null, y: null, radius: 200 };

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor(fromEdge = false) {
    this.reset(fromEdge);
  }
  reset(fromEdge = false) {
    if (fromEdge) {
      const side = Math.floor(Math.random() * 4);
      if (side === 0) { this.x = Math.random() * canvas.width; this.y = -10; }
      else if (side === 1) { this.x = canvas.width + 10; this.y = Math.random() * canvas.height; }
      else if (side === 2) { this.x = Math.random() * canvas.width; this.y = canvas.height + 10; }
      else { this.x = -10; this.y = Math.random() * canvas.height; }
    } else {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
    }
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.6 + 0.2;
    this.twinkleSpeed = Math.random() * 0.02 + 0.005;
  }
  update() {
    this.opacity += Math.sin(Date.now() * this.twinkleSpeed) * 0.003;
    if (this.opacity < 0.15) this.opacity = 0.15;
    if (this.opacity > 0.85) this.opacity = 0.85;

    // Mouse gravity pull
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius && dist > 1) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * force * 1.8;
        this.y += Math.sin(angle) * force * 1.8;
      }
    }

    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) {
      this.reset(true);
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
    if (this.size > 1.8) {
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
    }
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

class ShootingStar {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width * 0.8;
    this.y = Math.random() * (canvas.height * 0.4);
    this.length = Math.random() * 100 + 60;
    this.speed = Math.random() * 12 + 8;
    this.size = Math.random() * 1.5 + 0.8;
    this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
    this.opacity = 1;
    this.active = true;
  }
  update() {
    if (!this.active) return;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.opacity -= 0.015;
    if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) {
      this.active = false;
    }
  }
  draw() {
    if (!this.active) return;
    const tailX = this.x - Math.cos(this.angle) * this.length;
    const tailY = this.y - Math.sin(this.angle) * this.length;

    const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
    grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
    grad.addColorStop(0.2, `rgba(6, 182, 212, ${this.opacity * 0.9})`);
    grad.addColorStop(1, `rgba(59, 130, 246, 0)`);

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(tailX, tailY);
    ctx.strokeStyle = grad;
    ctx.lineWidth = this.size;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

// 180 stars for a dense, vibrant starfield
for (let i = 0; i < 180; i++) particles.push(new Particle());

let lastShootingStarTime = Date.now();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Trigger shooting star every 3-6 seconds
  const now = Date.now();
  if (now - lastShootingStarTime > 3000 + Math.random() * 3000) {
    shootingStars.push(new ShootingStar());
    lastShootingStarTime = now;
  }

  shootingStars.forEach(s => { s.update(); s.draw(); });
  shootingStars = shootingStars.filter(s => s.active);

  particles.forEach(p => { p.update(); p.draw(); });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - dist / 90)})`;
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
  { keywords: ['hi', 'hello', 'hey', 'greetings'], response: "Hello! I'm Leona, Arnab's AI assistant. How can I help you today?" },
  { keywords: ['who are you', 'what are you', 'name'], response: "I'm Leona, a custom AI assistant built directly into Arnab's portfolio. I can answer questions about his experience and skills!" },
  { keywords: ['who is arnab', 'about arnab', 'tell me about arnab', 'tell me about him', 'summary', 'background'], response: "Arnab is a Senior Data Engineer currently at Google Cloud. He has over 6 years of experience building petabyte-scale data pipelines and is triple cloud-certified in AWS and GCP." },
  { keywords: ['experience', 'work', 'job', 'career', 'history'], response: "Arnab has over 6 years of experience. He's currently a Data Engineer at Google Cloud. Before that, he was a Senior Data Engineer II at UsefulBI and a Senior Data Engineer at phData." },
  { keywords: ['google', 'gcp', 'vertex', 'composer', 'dataform'], response: "At Google Cloud, Arnab engineered real-time data ingestion pipelines into BigQuery for Vertex AI, developed a scalable DAG Factory using Airflow, and deployed complete IaC solutions using Terraform." },
  { keywords: ['usefulbi', 'useful bi', 'healthcare'], response: "At UsefulBI, he migrated 15TB of healthcare data to AWS, built pipelines processing 8.5M patient records daily (99.99% uptime), and optimized Databricks clusters to save $200K annually." },
  { keywords: ['phdata', 'migration', 'snowflake', '400tb'], response: "At phData, Arnab led a massive 400+ Terabyte migration from a Legacy Data Warehouse to Snowflake. He also built a custom migration validation tool to prevent data loss." },
  { keywords: ['skills', 'tech', 'stack', 'technologies', 'tools', 'languages'], response: "Arnab is an expert in Cloud (GCP, AWS, Azure), Data Warehousing (BigQuery, Snowflake, Databricks), Languages (Python, PySpark, SQL), and Big Data (Kafka, Airflow, Terraform)." },
  { keywords: ['certification', 'certs', 'certified'], response: "Arnab is triple-certified! He holds the Google Cloud Professional Data Engineer, AWS Data Engineer Associate, and AWS Solutions Architect Associate certifications." },
  { keywords: ['education', 'degree', 'college', 'university', 'btech'], response: "Arnab holds a Bachelor of Technology in Computer Science & Engineering from the Institute of Engineering and Management, Kolkata, graduating with an 8.45 CGPA." },
  { keywords: ['contact', 'email', 'phone', 'hire', 'reach', 'number'], response: "You can reach Arnab via email at arnavm014@gmail.com, call him at +91 6290729774, or connect with him on LinkedIn!" },
  { keywords: ['kafka', 'spark', 'airflow', 'dbt', 'terraform', 'pyspark', 'python', 'sql'], response: "Yes, Arnab has extensive hands-on experience with modern data stack tools including Kafka, PySpark, Airflow, dbt, and Terraform. Check out his Skills section for more!" },
  { keywords: ['resume', 'cv', 'download'], response: "You are currently viewing his interactive resume! If you need a PDF version, please reach out to him at arnavm014@gmail.com." }
];

async function getBotResponse(input) {
  const normalized = input.toLowerCase();
  
  // Quick local keyword check for instant response
  for (const item of knowledgeBase) {
    if (item.keywords.some(kw => normalized.includes(kw))) return item.response;
  }

  // Live Google Gemini AI Call
  try {
    const apiKey = atob('QVEuQWI4Uk42S1diYzlSZFBFVE1ocXE2aVAxYllvM0g3WGJEcnVGb2xsOGJTbXdzMjlyYlE=');
    const systemPrompt = `You are Leona, the professional AI Assistant for Arnab Mondal's portfolio site.
Arnab is a Senior Data Engineer at Google Cloud (6+ years experience), triple cloud certified (GCP PDE, AWS SAA, AWS DEA).
Key highlights: 400TB migration to Snowflake at phData, 15TB migration to AWS at UsefulBI, GCP Vertex/BigQuery/Airflow pipelines.
Rule: Answer politely, concisely (1-3 sentences max). Only discuss Arnab's career, resume, skills, or projects. If asked unrelated questions, ask them to email arnavm014@gmail.com.`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + "\n\nUser Question: " + input }] }
        ]
      })
    });

    if (res.ok) {
      const data = await res.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (answer) return answer.trim();
    }
  } catch (err) {
    console.error("Gemini API Error:", err);
  }

  // General fallback
  if (normalized.includes('arnab')) {
    return "Arnab is a Senior Data Engineer at Google Cloud. Ask me about his 'experience', 'skills', or 'projects'!";
  }
  
  return "Please only ask relevant questions about Arnab's professional background, experience, and resume. For anything else, please reach out to him directly at arnavm014@gmail.com.";
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

async function handleSend() {
  const text = chatInput.value.trim();
  if (!text) return;
  
  addMessage(text, true);
  chatInput.value = '';
  
  showTypingIndicator();
  
  // Minimum delay for realistic feel
  await new Promise(r => setTimeout(r, 800));
  
  const response = await getBotResponse(text);
  removeTypingIndicator();
  addMessage(response, false);
}

sendBtn.addEventListener('click', handleSend);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSend();
});
