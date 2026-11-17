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
  { emoji: '🍎', title: 'Mechanics', desc: 'Forces, motion & Newton’s laws' },
  { emoji: '🌍', title: 'Gravity & Projectiles', desc: 'Falling objects & trajectories' },
  { emoji: '⚡', title: 'Work & Energy', desc: 'Kinetic and potential energy' },
  { emoji: '💡', title: 'Electricity', desc: 'Circuits & Ohm’s Law' },
  { emoji: '🧲', title: 'Magnetism', desc: 'Fields and poles' },
  { emoji: '🌈', title: 'Light & Waves', desc: 'Reflection, refraction & waves' },
  { emoji: '🌡️', title: 'Heat & Thermo', desc: 'Temperature and energy' },
  { emoji: '⚛️', title: 'Atomic Structure', desc: 'Protons, neutrons, electrons' }
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
  },
  {
    id: 'energy',
    title: 'Work & Energy',
    desc: 'Kinetic and potential energy',
    emoji: '⚡',
    run: runEnergy
  },
  {
    id: 'circular',
    title: 'Circular Motion',
    desc: 'Centripetal force and orbits',
    emoji: '🔄',
    run: runCircular
  },
  {
    id: 'thermo',
    title: 'Heat & Temperature',
    desc: 'Thermal expansion and heat transfer',
    emoji: '🌡️',
    run: runThermo
  },
  {
    id: 'magnet',
    title: 'Magnetism Basics',
    desc: 'Magnetic fields and poles',
    emoji: '🧲',
    run: runMagnet
  },
  {
    id: 'atom',
    title: 'Atomic Structure',
    desc: 'Protons, neutrons, electrons',
    emoji: '⚛️',
    run: runAtom
  },
  {
    id: 'refraction',
    title: 'Light Refraction',
    desc: 'How light bends through materials',
    emoji: '💎',
    run: runRefraction
  },
  {
    id: 'lever',
    title: 'Simple Machines - Lever',
    desc: 'Mechanical advantage of levers',
    emoji: '⚖️',
    run: runLever
  },
  {
    id: 'nuclear',
    title: 'Nuclear Basics',
    desc: 'Radioactive decay intro',
    emoji: '☢️',
    run: runNuclear
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

function runEnergy() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <label>Height (m): <input type="range" id="height" min="1" max="20" value="10"></label>
    <label>Mass (kg): <input type="range" id="mass-e" min="1" max="10" value="2"></label>
    <button class="btn" onclick="dropEnergy()">Drop Object</button>
  `;
  
  explanation.innerHTML = `<strong>Energy:</strong> Potential energy (mgh) converts to kinetic energy (½mv²) as the object falls.`;

  let h = 10, m = 2, y = 50, vy = 0;

  canvas.width = canvas.parentElement.clientWidth - 20;
  canvas.height = 400;

  document.getElementById('height').oninput = (e) => h = +e.target.value;
  document.getElementById('mass-e').oninput = (e) => m = +e.target.value;

  window.dropEnergy = () => { y = 50; vy = 0; };

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    vy += 0.5;
    y += vy;
    if (y > canvas.height - 40) { y = canvas.height - 40; vy = 0; }

    const pe = (m * 9.8 * (canvas.height - 20 - y)/20).toFixed(1);
    const ke = (0.5 * m * vy * vy).toFixed(1);

    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(canvas.width/2, y, 20, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.font = '16px Inter';
    ctx.fillText('PE: ' + pe + ' J', 50, 50);
    ctx.fillText('KE: ' + ke + ' J', 50, 80);

    window.animId = requestAnimationFrame(animate);
  }
  animate();
}

function runCircular() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <label>Speed: <input type="range" id="circ-speed" min="1" max="10" value="3"></label>
  `;
  
  explanation.innerHTML = `<strong>Circular Motion:</strong> Centripetal force keeps the object moving in a circle. Higher speed needs more force.`;

  let angle = 0, speed = 3;

  canvas.width = canvas.parentElement.clientWidth - 20;
  canvas.height = 400;

  document.getElementById('circ-speed').oninput = (e) => speed = +e.target.value;

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width/2, cy = canvas.height/2, r = 120;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.stroke();

    angle += speed * 0.02;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI*2);
    ctx.fill();

    // Centripetal arrow
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    window.animId = requestAnimationFrame(animate);
  }
  animate();
}

function runThermo() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <label>Temperature: <input type="range" id="temp" min="0" max="100" value="25"> <span id="temp-val">25°C</span></label>
  `;
  
  explanation.innerHTML = `<strong>Thermodynamics:</strong> Higher temperature means faster particle motion. Heat flows from hot to cold.`;

  let temp = 25;

  canvas.width = canvas.parentElement.clientWidth - 20;
  canvas.height = 400;

  document.getElementById('temp').oninput = (e) => {
    temp = +e.target.value;
    document.getElementById('temp-val').textContent = temp + '°C';
  };

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const particles = 40;
    const speed = temp / 10;
    for (let i = 0; i < particles; i++) {
      const x = 50 + Math.random() * (canvas.width - 100);
      const y = 50 + Math.random() * (canvas.height - 100);
      const dx = (Math.random() - 0.5) * speed;
      const dy = (Math.random() - 0.5) * speed;
      ctx.fillStyle = `hsl(${200 - temp}, 80%, 60%)`;
      ctx.beginPath();
      ctx.arc(x + dx*5, y + dy*5, 4, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.fillStyle = '#f59e0b';
    ctx.font = '18px Poppins';
    ctx.fillText(temp + '°C', canvas.width/2 - 30, 40);

    window.animId = requestAnimationFrame(animate);
  }
  animate();
}

function runMagnet() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <button class="btn" onclick="flipMagnet()">Flip Magnet</button>
  `;
  
  explanation.innerHTML = `<strong>Magnetism:</strong> Opposite poles attract. Like poles repel. Field lines go from N to S.`;

  let flipped = false;

  canvas.width = canvas.parentElement.clientWidth - 20;
  canvas.height = 400;

  window.flipMagnet = () => flipped = !flipped;

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Magnet
    const mx = canvas.width/2 - 60;
    ctx.fillStyle = flipped ? '#ef4444' : '#3b82f6';
    ctx.fillRect(mx, 150, 50, 80);
    ctx.fillStyle = flipped ? '#3b82f6' : '#ef4444';
    ctx.fillRect(mx + 50, 150, 50, 80);
    ctx.fillStyle = 'white';
    ctx.font = '16px Inter';
    ctx.fillText(flipped ? 'S' : 'N', mx + 15, 195);
    ctx.fillText(flipped ? 'N' : 'S', mx + 65, 195);

    // Field lines
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.arc(canvas.width/2, 190, 80 + i*15, Math.PI*0.2, Math.PI*0.8);
      ctx.stroke();
    }

    window.animId = requestAnimationFrame(animate);
  }
  animate();
}

function runAtom() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <label>Electrons: <input type="range" id="electrons" min="1" max="8" value="2"></label>
  `;
  
  explanation.innerHTML = `<strong>Atomic Structure:</strong> Nucleus has protons (+) and neutrons (0). Electrons (-) orbit outside.`;

  let eCount = 2;

  canvas.width = canvas.parentElement.clientWidth - 20;
  canvas.height = 400;

  document.getElementById('electrons').oninput = (e) => eCount = +e.target.value;

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width/2, cy = canvas.height/2;

    // Nucleus
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '12px Inter';
    ctx.fillText('Nucleus', cx - 25, cy + 5);

    // Electron orbits
    for (let i = 1; i <= 3; i++) {
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.arc(cx, cy, 50 + i*30, 0, Math.PI*2);
      ctx.stroke();
    }

    // Electrons
    for (let i = 0; i < eCount; i++) {
      const orbit = 1 + (i % 3);
      const angle = (Date.now()/500 + i*2) % (Math.PI*2);
      const r = 50 + orbit*30;
      const ex = cx + r * Math.cos(angle);
      const ey = cy + r * Math.sin(angle);
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(ex, ey, 6, 0, Math.PI*2);
      ctx.fill();
    }

    window.animId = requestAnimationFrame(animate);
  }
  animate();
}

function runRefraction() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <label>Angle of Incidence: <input type="range" id="refr-angle" min="10" max="70" value="40"> <span id="refr-val">40°</span></label>
    <label>Refractive Index: <input type="range" id="n" min="1.0" max="2.0" step="0.1" value="1.5"></label>
  `;
  
  explanation.innerHTML = `<strong>Refraction:</strong> Light bends when it enters a different medium. Higher refractive index → more bending (Snell's Law).`;

  let angle = 40, n = 1.5;

  canvas.width = canvas.parentElement.clientWidth - 20;
  canvas.height = 400;

  document.getElementById('refr-angle').oninput = (e) => {
    angle = +e.target.value;
    document.getElementById('refr-val').textContent = angle + '°';
  };
  document.getElementById('n').oninput = (e) => n = +e.target.value;

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Interface
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.stroke();

    const rad = angle * Math.PI / 180;
    const cx = canvas.width/2;
    const interfaceY = canvas.height/2;

    // Incident ray
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 120 * Math.sin(rad), interfaceY - 120 * Math.cos(rad));
    ctx.lineTo(cx, interfaceY);
    ctx.stroke();

    // Refracted ray (simplified bending)
    const refrAngle = Math.asin(Math.sin(rad) / n);
    ctx.strokeStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(cx, interfaceY);
    ctx.lineTo(cx + 120 * Math.sin(refrAngle), interfaceY + 120 * Math.cos(refrAngle));
    ctx.stroke();

    ctx.fillStyle = '#6366f1';
    ctx.font = '16px Inter';
    ctx.fillText('n = ' + n.toFixed(1), 20, 40);

    window.animId = requestAnimationFrame(animate);
  }
  animate();
}

function runLever() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <label>Effort Distance: <input type="range" id="effort-d" min="1" max="5" value="3"></label>
    <label>Load Distance: <input type="range" id="load-d" min="1" max="5" value="1"></label>
    <button class="btn" onclick="applyLever()">Apply Force</button>
  `;
  
  explanation.innerHTML = `<strong>Levers:</strong> Mechanical advantage = Effort distance / Load distance. Longer effort arm makes it easier to lift the load.`;

  let effortD = 3, loadD = 1, lifted = false;

  canvas.width = canvas.parentElement.clientWidth - 20;
  canvas.height = 400;

  document.getElementById('effort-d').oninput = (e) => effortD = +e.target.value;
  document.getElementById('load-d').oninput = (e) => loadD = +e.target.value;
  window.applyLever = () => lifted = !lifted;

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fulcrumX = canvas.width / 2;
    const baseY = 300;

    // Fulcrum
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(fulcrumX, baseY);
    ctx.lineTo(fulcrumX - 15, baseY + 30);
    ctx.lineTo(fulcrumX + 15, baseY + 30);
    ctx.fill();

    // Beam
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(fulcrumX - effortD * 40, baseY - (lifted ? 20 : 0));
    ctx.lineTo(fulcrumX + loadD * 40, baseY + (lifted ? 20 : 0));
    ctx.stroke();

    // Load
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(fulcrumX + loadD * 40 - 15, baseY + (lifted ? 20 : 0) - 30, 30, 30);

    // Effort
    ctx.fillStyle = '#10b981';
    ctx.fillRect(fulcrumX - effortD * 40 - 15, baseY - (lifted ? 20 : 0) - 30, 30, 30);

    const ma = (effortD / loadD).toFixed(1);
    ctx.fillStyle = '#6366f1';
    ctx.font = '16px Inter';
    ctx.fillText('Mechanical Advantage: ' + ma, 20, 50);

    window.animId = requestAnimationFrame(animate);
  }
  animate();
}

function runNuclear() {
  const canvas = document.getElementById('physics-canvas');
  const ctx = canvas.getContext('2d');
  const controls = document.getElementById('sim-controls');
  const explanation = document.getElementById('sim-explanation');
  
  controls.innerHTML = `
    <label>Half-life speed: <input type="range" id="half" min="1" max="5" value="2"></label>
    <button class="btn" onclick="resetNuclear()">Reset Atoms</button>
  `;
  
  explanation.innerHTML = `<strong>Nuclear Decay:</strong> Unstable nuclei decay over time. Half-life is the time for half the atoms to decay.`;

  let atoms = [];
  let halfSpeed = 2;

  canvas.width = canvas.parentElement.clientWidth - 20;
  canvas.height = 400;

  function spawnAtoms() {
    atoms = [];
    for (let i = 0; i < 60; i++) {
      atoms.push({
        x: 50 + Math.random() * (canvas.width - 100),
        y: 50 + Math.random() * (canvas.height - 100),
        stable: true,
        age: 0
      });
    }
  }
  spawnAtoms();

  document.getElementById('half').oninput = (e) => halfSpeed = +e.target.value;
  window.resetNuclear = spawnAtoms;

  function animate() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let stableCount = 0;
    atoms.forEach(a => {
      a.age += halfSpeed * 0.01;
      if (a.stable && Math.random() < a.age * 0.002) a.stable = false;
      if (a.stable) stableCount++;

      ctx.fillStyle = a.stable ? '#10b981' : '#ef4444';
      ctx.beginPath();
      ctx.arc(a.x, a.y, 6, 0, Math.PI*2);
      ctx.fill();
    });

    ctx.fillStyle = '#f59e0b';
    ctx.font = '16px Inter';
    ctx.fillText('Stable atoms: ' + stableCount, 20, 40);

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
  },
  {
    id: 'energy-quiz',
    title: 'Work & Energy Quiz',
    questions: [
      {
        q: "Kinetic energy depends on:",
        options: ["Mass and velocity", "Only height", "Only force", "Temperature"],
        a: 0,
        exp: "KE = ½mv² — it depends on mass and speed."
      },
      {
        q: "Potential energy increases when:",
        options: ["An object falls", "An object is lifted higher", "Speed increases", "Mass decreases"],
        a: 1,
        exp: "Gravitational PE = mgh — higher height means more potential energy."
      }
    ]
  },
  {
    id: 'thermo-quiz',
    title: 'Heat & Temperature',
    questions: [
      {
        q: "Heat flows from:",
        options: ["Cold to hot", "Hot to cold", "Only in metals", "Never"],
        a: 1,
        exp: "Heat always flows from higher temperature to lower temperature."
      },
      {
        q: "Absolute zero is:",
        options: ["0°C", "0°F", "0 K", "100°C"],
        a: 2,
        exp: "0 Kelvin is absolute zero — the lowest possible temperature."
      }
    ]
  },
  {
    id: 'atom-quiz',
    title: 'Atomic Structure Quiz',
    questions: [
      {
        q: "The nucleus contains:",
        options: ["Only electrons", "Protons and neutrons", "Only protons", "Protons and electrons"],
        a: 1,
        exp: "The nucleus has protons (positive) and neutrons (neutral). Electrons orbit outside."
      },
      {
        q: "Electrons have a charge of:",
        options: ["Positive", "Negative", "Neutral", "Variable"],
        a: 1,
        exp: "Electrons carry a negative charge."
      }
    ]
  },
  {
    id: 'refraction-quiz',
    title: 'Refraction Quiz',
    questions: [
      {
        q: "Light bends when it:",
        options: ["Stays in the same medium", "Enters a different medium", "Hits a mirror", "Is absorbed"],
        a: 1,
        exp: "Refraction happens when light passes from one medium into another with a different refractive index."
      },
      {
        q: "A higher refractive index causes:",
        options: ["Less bending", "More bending", "No change", "Light to stop"],
        a: 1,
        exp: "Higher refractive index means light bends more (Snell's Law)."
      }
    ]
  },
  {
    id: 'nuclear-quiz',
    title: 'Nuclear Basics Quiz',
    questions: [
      {
        q: "Half-life is the time for:",
        options: ["All atoms to decay", "Half the atoms to decay", "One atom to decay", "None to decay"],
        a: 1,
        exp: "Half-life is the time required for half of the radioactive atoms in a sample to decay."
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
