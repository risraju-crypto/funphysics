// Simple sound system
window.playSound = function(type) {
  if (!window.soundEnabled) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  if (type === 'correct') {
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
  } else if (type === 'wrong') {
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
  } else if (type === 'drop') {
    osc.frequency.setValueAtTime(400, ctx.currentTime);
  }
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
};

window.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  document.getElementById('theme-btn').textContent = isLight ? '🌙' : '☀️';
}

// Reset progress
function resetProgress() {
  if (confirm('Reset all progress? This cannot be undone.')) {
    state.points = 0;
    state.completedSims = [];
    state.quizScores = {};
    localStorage.clear();
    updateStats();
    renderSimList();
    renderQuizList();
    renderAchievements();
    alert('Progress reset!');
  }
}

// App State
let state = {
  points: parseInt(localStorage.getItem('points') || '0'),
  completedSims: JSON.parse(localStorage.getItem('completedSims') || '[]'),
  quizScores: JSON.parse(localStorage.getItem('quizScores') || '{}'),
  level: 1
};

// Update UI
function updateStats() {
  document.getElementById('points').textContent = `⭐ ${state.points}`;
  state.level = Math.floor(state.points / 100) + 1;
  document.getElementById('level').textContent = `Lv ${state.level}`;
  document.getElementById('total-points').textContent = state.points;
  document.getElementById('completed-sims').textContent = state.completedSims.length;
  
  const scores = Object.values(state.quizScores);
  const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
  document.getElementById('quiz-score').textContent = avg + '%';
  
  localStorage.setItem('points', state.points);
  localStorage.setItem('completedSims', JSON.stringify(state.completedSims));
  localStorage.setItem('quizScores', JSON.stringify(state.quizScores));
}

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showSection(btn.dataset.section);
  });
});

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'simulations') renderSimList();
  if (id === 'quizzes') renderQuizList();
  if (id === 'progress') renderAchievements();
  if (id === 'home') renderTopics();
}

// Topics for home
const topics = [
  { emoji: '🍎', title: 'Newton\'s Laws', desc: 'Forces, motion & inertia' },
  { emoji: '🌍', title: 'Gravity', desc: 'Falling objects & orbits' },
  { emoji: '🎯', title: 'Projectile Motion', desc: 'Angles, speed & trajectory' },
  { emoji: '⏰', title: 'Pendulum', desc: 'Simple harmonic motion' },
  { emoji: '💡', title: 'Electricity', desc: 'Circuits & Ohm\'s Law' },
  { emoji: '🌈', title: 'Light & Optics', desc: 'Reflection & refraction' }
];

function renderTopics() {
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = topics.map(t => `
    <div class="topic-card" onclick="showSection('simulations')">
      <span class="emoji">${t.emoji}</span>
      <h3>${t.title}</h3>
      <p>${t.desc}</p>
    </div>
  `).join('');
}

// Simulations
const simulations = [
  {
    id: 'freefall',
    title: 'Free Fall Lab',
    desc: 'Drop objects and watch gravity in action',
    emoji: '🍎',
    run: runFreeFall
  },
  {
    id: 'projectile',
    title: 'Projectile Motion',
    desc: 'Launch projectiles at different angles',
    emoji: '🎯',
    run: runProjectile
  },
  {
    id: 'pendulum',
    title: 'Pendulum Swing',
    desc: 'Explore simple harmonic motion',
    emoji: '⏰',
    run: runPendulum
  },
  {
    id: 'newton',
    title: 'Newton\'s Laws Demo',
    desc: 'See forces and acceleration',
    emoji: '🚀',
    run: runNewton
  },
  {
    id: 'circuit',
    title: 'Simple Circuit',
    desc: 'Explore Ohm\'s Law: V = IR',
    emoji: '💡',
    run: runCircuit
  },
  {
    id: 'optics',
    title: 'Light Reflection',
    desc: 'See how light reflects off a mirror',
    emoji: '🌈',
    run: runOptics
  },
  {
    id: 'waves',
    title: 'Wave Motion',
    desc: 'Amplitude and frequency of waves',
    emoji: '🌊',
    run: runWaves
  }
];

function renderSimList() {
  const list = document.getElementById('sim-list');
  list.innerHTML = simulations.map(s => `
    <div class="sim-card" onclick="openSim('${s.id}')">
      <div style="font-size:2rem">${s.emoji}</div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
      ${state.completedSims.includes(s.id) ? '<span style="color:#10b981">✓ Completed</span>' : ''}
    </div>
  `).join('');
}

function openSim(id) {
  const sim = simulations.find(s => s.id === id);
  document.getElementById('sim-list').classList.add('hidden');
  document.getElementById('sim-container').classList.remove('hidden');
  document.getElementById('sim-title').textContent = sim.title;
  sim.run();
  if (!state.completedSims.includes(id)) {
    state.completedSims.push(id);
    state.points += 25;
    updateStats();
  }
}

function closeSim() {
  document.getElementById('sim-list').classList.remove('hidden');
  document.getElementById('sim-container').classList.add('hidden');
  // Stop any running animations
  if (window.animId) cancelAnimationFrame(window.animId);
}

// ===== SIMULATIONS =====

function runFreeFall() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <label>Gravity: <input type="range" id="g-slider" min="1" max="20" value="10"></label>
    <label>Air Resistance: <input type="checkbox" id="air"></label>
    <button class="btn" onclick="dropBall()">Drop Ball</button>
    <button class="btn" onclick="resetFreeFall()">Reset</button>
  `;
  
  explanation.innerHTML = `<strong>What's happening?</strong> All objects fall at the same rate in vacuum (ignoring air resistance). Heavier objects don't fall faster! Toggle air resistance to see how it affects lighter objects more.`;

  let balls = [];
  let g = 10;
  let air = false;

  function resize() {
    canvas.width = canvas.parentElement.clientWidth - 20;
    canvas.height = 400;
  }
  resize();
  window.addEventListener('resize', resize);

  document.getElementById('g-slider').oninput = (e) => g = parseFloat(e.target.value);
  document.getElementById('air').onchange = (e) => air = e.target.checked;

  window.dropBall = function() {
    balls.push({
      x: canvas.width / 2 + (Math.random()-0.5)*100,
      y: 30,
      vy: 0,
      r: 15 + Math.random()*10,
      color: `hsl(${Math.random()*360}, 80%, 60%)`
    });
  };

  window.resetFreeFall = function() {
    balls = [];
  };

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Ground
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    balls.forEach(b => {
      b.vy += g * 0.1;
      if (air) b.vy *= 0.98;
      b.y += b.vy;
      
      if (b.y > canvas.height - 20 - b.r) {
        b.y = canvas.height - 20 - b.r;
        b.vy *= -0.6; // bounce
      }
      
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      ctx.fillStyle = b.color;
      ctx.fill();
    });

    window.animId = requestAnimationFrame(animate);
  }
  animate();
}

function runProjectile() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <label>Angle: <input type="range" id="angle" min="10" max="80" value="45"> <span id="angle-val">45°</span></label>
    <label>Speed: <input type="range" id="speed" min="5" max="30" value="15"> <span id="speed-val">15</span></label>
    <button class="btn" onclick="launch()">Launch!</button>
    <button class="btn" onclick="clearTraj()">Clear</button>
  `;
  
  explanation.innerHTML = `<strong>Key insight:</strong> 45° gives the maximum range (on flat ground, no air). Try different angles and speeds!`;

  let projectiles = [];
  let angle = 45, speed = 15;

  document.getElementById('angle').oninput = (e) => {
    angle = e.target.value;
    document.getElementById('angle-val').textContent = angle + '°';
  };
  document.getElementById('speed').oninput = (e) => {
    speed = e.target.value;
    document.getElementById('speed-val').textContent = speed;
  };

  canvas.width = canvas.parentElement.clientWidth - 20;
  canvas.height = 400;

  window.launch = function() {
    const rad = angle * Math.PI / 180;
    projectiles.push({
      x: 50,
      y: canvas.height - 40,
      vx: speed * Math.cos(rad),
      vy: -speed * Math.sin(rad),
      trail: []
    });
  };

  window.clearTraj = () => projectiles = [];

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    projectiles.forEach(p => {
      p.vy += 0.3; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.trail.push({x: p.x, y: p.y});
      if (p.trail.length > 50) p.trail.shift();

      // Draw trail
      ctx.beginPath();
      p.trail.forEach((t, i) => {
        if (i === 0) ctx.moveTo(t.x, t.y);
        else ctx.lineTo(t.x, t.y);
      });
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Projectile
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI*2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
    });

    window.animId = requestAnimationFrame(animate);
  }
  animate();
}

function runPendulum() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <label>Length: <input type="range" id="length" min="80" max="250" value="150"></label>
    <label>Amplitude: <input type="range" id="amp" min="10" max="70" value="40"></label>
    <button class="btn" onclick="startPend()">Start</button>
    <button class="btn" onclick="pausePend()">Pause</button>
  `;
  
  explanation.innerHTML = `<strong>Fun fact:</strong> The period of a simple pendulum depends mainly on length and gravity, not on mass or (small) amplitude!`;

  let angle = 0.7, angVel = 0, length = 150, running = true;
  const origin = { x: canvas.width/2 || 300, y: 50 };

  canvas.width = canvas.parentElement.clientWidth - 20;
  canvas.height = 400;

  document.getElementById('length').oninput = (e) => length = +e.target.value;
  document.getElementById('amp').oninput = (e) => angle = (+e.target.value) * Math.PI / 180;

  window.startPend = () => running = true;
  window.pausePend = () => running = false;

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (running) {
      const g = 0.4;
      const acc = -g / length * Math.sin(angle);
      angVel += acc;
      angVel *= 0.999; // slight damping
      angle += angVel;
    }

    const x = origin.x + length * Math.sin(angle);
    const y = origin.y + length * Math.cos(angle);

    // String
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Bob
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI*2);
    ctx.fillStyle = '#6366f1';
    ctx.fill();

    window.animId = requestAnimationFrame(animate);
  }
  animate();
}

function runNewton() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <label>Force: <input type="range" id="force" min="0" max="5" value="1" step="0.1"></label>
    <label>Mass: <input type="range" id="mass" min="1" max="10" value="2"></label>
    <button class="btn" onclick="applyForce()">Apply Force</button>
    <button class="btn" onclick="resetNewton()">Reset</button>
  `;
  
  explanation.innerHTML = `<strong>Newton's 2nd Law:</strong> F = ma. More force → more acceleration. More mass → less acceleration for the same force.`;

  let pos = 100, vel = 0, force = 1, mass = 2;

  canvas.width = canvas.parentElement.clientWidth - 20;
  canvas.height = 400;

  document.getElementById('force').oninput = (e) => force = +e.target.value;
  document.getElementById('mass').oninput = (e) => mass = +e.target.value;

  window.applyForce = () => {
    // continuous in animate
  };
  window.resetNewton = () => { pos = 100; vel = 0; };

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, canvas.height/2 + 30, canvas.width, 4);

    const acc = force / mass;
    vel += acc * 0.1;
    pos += vel;

    if (pos > canvas.width - 40) { pos = canvas.width - 40; vel = 0; }
    if (pos < 40) { pos = 40; vel = 0; }

    // Box
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(pos - 25, canvas.height/2 - 25, 50, 50);
    ctx.fillStyle = 'white';
    ctx.font = '14px Inter';
    ctx.fillText(`m=${mass}`, pos-15, canvas.height/2);

    // Force arrow
    if (force > 0) {
      ctx.beginPath();
      ctx.moveTo(pos + 30, canvas.height/2);
      ctx.lineTo(pos + 30 + force*20, canvas.height/2);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    window.animId = requestAnimationFrame(animate);
  }
  animate();
}

function runCircuit() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <label>Voltage (V): <input type="range" id="voltage" min="1" max="24" value="12"> <span id="v-val">12</span></label>
    <label>Resistance (Ω): <input type="range" id="resistance" min="1" max="100" value="10"> <span id="r-val">10</span></label>
    <button class="btn" onclick="if(window.playSound) window.playSound('drop')">Test Sound</button>
  `;
  
  explanation.innerHTML = `<strong>Ohm's Law:</strong> Current (I) = Voltage (V) / Resistance (R). Higher voltage or lower resistance means more current.`;

  let V = 12, R = 10;

  canvas.width = canvas.parentElement.clientWidth - 20;
  canvas.height = 400;

  document.getElementById('voltage').oninput = (e) => {
    V = +e.target.value;
    document.getElementById('v-val').textContent = V;
  };
  document.getElementById('resistance').oninput = (e) => {
    R = +e.target.value;
    document.getElementById('r-val').textContent = R;
  };

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const I = (V / R).toFixed(2);

    // Simple circuit visual
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(100, 100, 300, 150);
    
    // Battery
    ctx.fillStyle = '#10b981';
    ctx.fillRect(90, 160, 20, 30);
    ctx.fillStyle = 'white';
    ctx.font = '12px Inter';
    ctx.fillText(V + 'V', 70, 180);

    // Resistor
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(230, 90, 40, 20);
    ctx.fillStyle = 'white';
    ctx.fillText(R + 'Ω', 235, 105);

    // Current label
    ctx.fillStyle = '#6366f1';
    ctx.font = '20px Poppins';
    ctx.fillText('Current: ' + I + ' A', canvas.width/2 - 80, 320);

    window.animId = requestAnimationFrame(animate);
  }
  animate();
}

function runOptics() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <label>Angle of Incidence: <input type="range" id="inc-angle" min="10" max="80" value="45"> <span id="inc-val">45°</span></label>
  `;
  
  explanation.innerHTML = `<strong>Law of Reflection:</strong> Angle of incidence = Angle of reflection.`;

  let angle = 45;

  canvas.width = canvas.parentElement.clientWidth - 20;
  canvas.height = 400;

  document.getElementById('inc-angle').oninput = (e) => {
    angle = +e.target.value;
    document.getElementById('inc-val').textContent = angle + '°';
  };

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Mirror
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(50, 300);
    ctx.lineTo(canvas.width - 50, 300);
    ctx.stroke();

    const rad = angle * Math.PI / 180;
    const centerX = canvas.width / 2;
    const mirrorY = 300;

    // Incident ray
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - 150 * Math.sin(rad), mirrorY - 150 * Math.cos(rad));
    ctx.lineTo(centerX, mirrorY);
    ctx.stroke();

    // Reflected ray
    ctx.strokeStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(centerX, mirrorY);
    ctx.lineTo(centerX + 150 * Math.sin(rad), mirrorY - 150 * Math.cos(rad));
    ctx.stroke();

    // Normal
    ctx.strokeStyle = '#64748b';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX, mirrorY);
    ctx.lineTo(centerX, mirrorY - 100);
    ctx.stroke();
    ctx.setLineDash([]);

    window.animId = requestAnimationFrame(animate);
  }
  animate();
}

function runWaves() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <label>Amplitude: <input type="range" id="amp" min="20" max="100" value="50"></label>
    <label>Frequency: <input type="range" id="freq" min="1" max="10" value="3" step="0.5"></label>
  `;
  
  explanation.innerHTML = `<strong>Waves:</strong> Higher amplitude means taller waves. Higher frequency means more waves per second.`;

  let amp = 50, freq = 3;
  let time = 0;

  canvas.width = canvas.parentElement.clientWidth - 20;
  canvas.height = 400;

  document.getElementById('amp').oninput = (e) => amp = +e.target.value;
  document.getElementById('freq').oninput = (e) => freq = +e.target.value;

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height/2 + amp * Math.sin((x * 0.02 * freq) + time);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    time += 0.05;
    window.animId = requestAnimationFrame(animate);
  }
  animate();
}

// Quizzes
const quizzes = [
  {
    id: 'newton-quiz',
    title: 'Newton\'s Laws Quiz',
    questions: [
      {
        q: "What happens if no net force acts on an object?",
        options: ["It accelerates", "It stays at constant velocity", "It stops immediately", "It falls"],
        a: 1,
        exp: "Newton's 1st Law: An object in motion stays in motion (constant velocity) unless acted on by a net force."
      },
      {
        q: "F = ma is which law?",
        options: ["1st Law", "2nd Law", "3rd Law", "Law of Gravity"],
        a: 1,
        exp: "Newton's 2nd Law directly relates force, mass, and acceleration: F = ma."
      },
      {
        q: "Action and reaction forces are:",
        options: ["Equal and opposite", "Always on the same object", "Unequal", "Only for gravity"],
        a: 0,
        exp: "Newton's 3rd Law: For every action there is an equal and opposite reaction."
      }
    ]
  },
  {
    id: 'gravity-quiz',
    title: 'Gravity & Motion Quiz',
    questions: [
      {
        q: "In vacuum, a feather and a hammer fall:",
        options: ["Hammer faster", "Feather faster", "At the same rate", "Neither falls"],
        a: 2,
        exp: "Without air resistance, all objects fall at the same rate regardless of mass."
      },
      {
        q: "Best angle for maximum range of a projectile (no air)?",
        options: ["30°", "45°", "60°", "90°"],
        a: 1,
        exp: "On flat ground with no air resistance, 45° gives the maximum horizontal range."
      }
    ]
  },
  {
    id: 'electricity-quiz',
    title: 'Electricity Basics',
    questions: [
      {
        q: "What does Ohm's Law state?",
        options: ["V = IR", "P = IV", "F = ma", "E = mc²"],
        a: 0,
        exp: "Ohm's Law: Voltage = Current × Resistance (V = IR)."
      },
      {
        q: "If you double the resistance and keep voltage the same, current:",
        options: ["Doubles", "Halves", "Stays the same", "Becomes zero"],
        a: 1,
        exp: "Since I = V/R, doubling R halves the current."
      },
      {
        q: "A higher voltage with the same resistance produces:",
        options: ["Less current", "More current", "No change", "Zero current"],
        a: 1,
        exp: "Current is directly proportional to voltage when resistance is constant."
      }
    ]
  },
  {
    id: 'optics-quiz',
    title: 'Light & Optics Quiz',
    questions: [
      {
        q: "The Law of Reflection says:",
        options: ["Angle of incidence = angle of reflection", "Light always bends", "Mirrors absorb light", "Angle of incidence is always 45°"],
        a: 0,
        exp: "The angle of incidence equals the angle of reflection."
      },
      {
        q: "When light hits a mirror at 30°, the reflected angle is:",
        options: ["15°", "30°", "45°", "60°"],
        a: 1,
        exp: "Reflection angle always matches the incidence angle."
      }
    ]
  }
];

function renderQuizList() {
  const list = document.getElementById('quiz-list');
  list.innerHTML = quizzes.map(q => `
    <div class="quiz-card">
      <h3>${q.title}</h3>
      <p>${q.questions.length} questions</p>
      <button class="btn" onclick="startQuiz('${q.id}')">Start Quiz</button>
      ${state.quizScores[q.id] ? `<p style="color:#10b981">Score: ${state.quizScores[q.id]}%</p>` : ''}
    </div>
  `).join('');
  document.getElementById('quiz-container').classList.add('hidden');
}

let currentQuiz = null;
let currentQ = 0;
let score = 0;

function startQuiz(id) {
  currentQuiz = quizzes.find(q => q.id === id);
  currentQ = 0;
  score = 0;
  document.getElementById('quiz-list').classList.add('hidden');
  document.getElementById('quiz-container').classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  const q = currentQuiz.questions[currentQ];
  const container = document.getElementById('quiz-container');
  container.innerHTML = `
    <h3>Question ${currentQ+1}/${currentQuiz.questions.length}</h3>
    <p style="font-size:1.2rem; margin:1rem 0;">${q.q}</p>
    ${q.options.map((opt, i) => `<button class="option-btn" onclick="answer(${i})">${opt}</button>`).join('')}
  `;
}

function answer(i) {
  const q = currentQuiz.questions[currentQ];
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach(b => b.disabled = true);
  if (i === q.a) {
    btns[i].classList.add('correct');
    score++;
    state.points += 10;
    if (window.playSound) window.playSound('correct');
  } else {
    btns[i].classList.add('wrong');
    btns[q.a].classList.add('correct');
    if (window.playSound) window.playSound('wrong');
  }
  updateStats();

  // Show explanation
  const expDiv = document.createElement('div');
  expDiv.className = 'explanation';
  expDiv.style.marginTop = '1rem';
  expDiv.innerHTML = `<strong>Explanation:</strong> ${q.exp || 'Good try!'}`;
  document.getElementById('quiz-container').appendChild(expDiv);
  
  setTimeout(() => {
    currentQ++;
    if (currentQ < currentQuiz.questions.length) {
      showQuestion();
    } else {
      finishQuiz();
    }
  }, 1800);
}

function finishQuiz() {
  const percent = Math.round((score / currentQuiz.questions.length) * 100);
  state.quizScores[currentQuiz.id] = percent;
  state.points += percent;
  updateStats();
  
  document.getElementById('quiz-container').innerHTML = `
    <h2>Quiz Complete! 🎉</h2>
    <p style="font-size:1.5rem; margin:1rem 0;">Score: ${score}/${currentQuiz.questions.length} (${percent}%)</p>
    <button class="btn" onclick="renderQuizList(); document.getElementById('quiz-list').classList.remove('hidden');">Back to Quizzes</button>
  `;
}

function renderAchievements() {
  const badges = [
    { id: 'first-sim', name: 'First Experiment', unlocked: state.completedSims.length >= 1 },
    { id: 'all-sims', name: 'Lab Master', unlocked: state.completedSims.length >= simulations.length },
    { id: 'points-100', name: 'Rising Star', unlocked: state.points >= 100 },
    { id: 'points-300', name: 'Physics Pro', unlocked: state.points >= 300 },
    { id: 'points-500', name: 'Einstein', unlocked: state.points >= 500 },
    { id: 'quiz-ace', name: 'Quiz Ace', unlocked: Object.values(state.quizScores).some(s => s >= 80) },
    { id: 'quiz-master', name: 'Quiz Master', unlocked: Object.keys(state.quizScores).length >= 3 }
  ];
  
  document.getElementById('achievements').innerHTML = badges.map(b => 
    `<div class="badge ${b.unlocked ? 'unlocked' : ''}">${b.unlocked ? '🏆' : '🔒'} ${b.name}</div>`
  ).join('') + `
    <div style="margin-top:1.5rem;">
      <button class="btn" onclick="resetProgress()">Reset Progress</button>
      <button class="btn" id="theme-btn" onclick="toggleTheme()" style="margin-left:0.5rem;">☀️</button>
      <button class="btn" onclick="window.soundEnabled = !window.soundEnabled; localStorage.setItem('soundEnabled', window.soundEnabled);" style="margin-left:0.5rem;">${window.soundEnabled ? '🔊' : '🔇'}</button>
    </div>
  `;
}

// Init
updateStats();
renderTopics();
showSection('home');

// Apply saved theme
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-theme');
  setTimeout(() => {
    const btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = '🌙';
  }, 100);
}

// PWA Service Worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
