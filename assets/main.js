document.addEventListener('DOMContentLoaded', function() {
  let userZodiac = localStorage.getItem('userZodiac') || '';
  const dailyAdviceData = {};
  
  const emotions = [
    { id: 'happy', name: 'Happy', color: '#FFD700', icon: '😊' },
    { id: 'excited', name: 'Excited', color: '#FF4500', icon: '🤩' },
    { id: 'calm', name: 'Calm', color: '#1E90FF', icon: '😌' },
    { id: 'sad', name: 'Sad', color: '#6A5ACD', icon: '😢' },
    { id: 'anxious', name: 'Anxious', color: '#9932CC', icon: '😰' },
    { id: 'angry', name: 'Angry', color: '#DC143C', icon: '😡' },
    { id: 'tired', name: 'Tired', color: '#708090', icon: '😫' },
    { id: 'grateful', name: 'Grateful', color: '#32CD32', icon: '🙏' }
  ];

  const zodiacSigns = [
    { id: 'aries', name: 'Aries', period: 'March 21 - April 19', element: 'Fire' },
    { id: 'taurus', name: 'Taurus', period: 'April 20 - May 20', element: 'Earth' },
    { id: 'gemini', name: 'Gemini', period: 'May 21 - June 20', element: 'Air' },
    { id: 'cancer', name: 'Cancer', period: 'June 21 - July 22', element: 'Water' },
    { id: 'leo', name: 'Leo', period: 'July 23 - August 22', element: 'Fire' },
    { id: 'virgo', name: 'Virgo', period: 'August 23 - September 22', element: 'Earth' },
    { id: 'libra', name: 'Libra', period: 'September 23 - October 22', element: 'Air' },
    { id: 'scorpio', name: 'Scorpio', period: 'October 23 - November 21', element: 'Water' },
    { id: 'sagittarius', name: 'Sagittarius', period: 'November 22 - December 21', element: 'Fire' },
    { id: 'capricorn', name: 'Capricorn', period: 'December 22 - January 19', element: 'Earth' },
    { id: 'aquarius', name: 'Aquarius', period: 'January 20 - February 18', element: 'Air' },
    { id: 'pisces', name: 'Pisces', period: 'February 19 - March 20', element: 'Water' }
  ];

  const emotionGrid = document.getElementById('emotion-grid');
  const intensityInput = document.getElementById('intensity');
  const intensityValue = document.getElementById('intensity-value');
  const dateInput = document.getElementById('date');
  const emotionForm = document.getElementById('emotion-form');
  const historyPanel = document.getElementById('history-panel');
  const starCanvas = document.getElementById('star-canvas');
  const zodiacSelect = document.getElementById('zodiac-sign');
  const zodiacInfo = document.getElementById('zodiac-info');
  const zodiacTitle = document.getElementById('zodiac-title');
  const zodiacPeriod = document.getElementById('zodiac-period');
  const zodiacElement = document.getElementById('zodiac-element');
  const zodiacMessage = document.getElementById('zodiac-message');
  const recordEmotionBtn = document.getElementById('record-emotion-btn');
  const emotionModal = document.getElementById('emotion-modal');
  const closeModal = document.getElementById('close-modal');
  const initialZodiacModal = document.getElementById('initial-zodiac-modal');
  const initialZodiacSelect = document.getElementById('initial-zodiac-select');
  const saveZodiacBtn = document.getElementById('save-zodiac-btn');

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  dateInput.value = formattedDate;
  
  dateInput.max = formattedDate;

  intensityInput.addEventListener('input', function() {
    intensityValue.textContent = this.value;
  });

  function populateEmotionGrid() {
    emotionGrid.innerHTML = '';
    emotions.forEach(emotion => {
      const emotionItem = document.createElement('div');
      emotionItem.className = 'emotion-item';
      emotionItem.dataset.id = emotion.id;
      emotionItem.innerHTML = `
        <div class="emotion-icon" style="background-color: ${emotion.color}">
          ${emotion.icon}
        </div>
        <div class="emotion-name">${emotion.name}</div>
      `;
      emotionGrid.appendChild(emotionItem);

      emotionItem.addEventListener('click', function() {
        document.querySelectorAll('.emotion-item').forEach(item => {
          item.classList.remove('selected');
        });
        this.classList.add('selected');
      });
    });
  }

  function populateZodiacSelect() {
    zodiacSigns.forEach(sign => {
      const option = document.createElement('option');
      option.value = sign.id;
      option.textContent = sign.name;
      zodiacSelect.appendChild(option);
    });
  }

  function showZodiacInfo(zodiacId) {
    const sign = zodiacSigns.find(sign => sign.id === zodiacId);
    if (!sign) return;

    zodiacTitle.textContent = sign.name;
    zodiacPeriod.textContent = sign.period;
    zodiacElement.textContent = sign.element;
    
    getZodiacMessage(sign.id).then(message => {
      zodiacMessage.textContent = message;
      zodiacInfo.style.display = 'block';
    });
  }

  async function getZodiacMessage(zodiacId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const messages = {
      'aries': 'Today your enthusiasm is like fire, suitable for starting new projects. Remember to pay attention to emotional fluctuations and maintain balance.',
      'taurus': 'Stability is your advantage, but beware of stubbornness. Today is suitable for enjoying simple pleasures.',
      'gemini': 'Communication is your strength, and today there may be unexpected good news. Keep an open mind.',
      'cancer': 'An emotionally rich day, listen to your inner voice, recording your feelings will help.',
      'leo': 'Your creativity is especially strong today, express yourself, but also take care of others\' feelings.',
      'virgo': 'Details determine success or failure, today is suitable for organizing thoughts and solving accumulated problems.',
      'libra': 'Balance and harmony are important to you, today you may face choices, trust your intuition.',
      'scorpio': 'Today your insight is particularly keen, suitable for deep thinking and emotional exploration.',
      'sagittarius': 'The spirit of adventure guides you forward, today may bring new discoveries, stay optimistic.',
      'capricorn': 'Steady progress is your style, today\'s efforts will be rewarded in the future.',
      'aquarius': 'Innovative thinking is particularly active today, try to view emotional changes from a new perspective.',
      'pisces': 'Intuition is particularly accurate today, listen to your inner voice, artistic activities help relieve stress.'
    };
    
    return messages[zodiacId] || 'Loading zodiac information...';
  }

  function saveEmotions(emotionsData) {
    localStorage.setItem('emotions', JSON.stringify(emotionsData));
  }

  function loadEmotionHistory() {
    const saved = localStorage.getItem('emotions');
    return saved ? JSON.parse(saved) : [];
  }

  function renderEmotionHistory() {
    const emotionHistory = loadEmotionHistory();
    
    if (emotionHistory.length === 0) {
      historyPanel.innerHTML = '<div class="history-empty">No emotion records</div>';
      return;
    }
    
    const groupedEmotions = groupByDate(emotionHistory);
    
    historyPanel.innerHTML = '';
    
    Object.keys(groupedEmotions).forEach(date => {
      const dateHeader = document.createElement('div');
      dateHeader.className = 'date-header';
      dateHeader.innerHTML = `<i class="fas fa-calendar-day"></i> ${formatDateHeader(date)}`;
      historyPanel.appendChild(dateHeader);
      
      groupedEmotions[date].forEach(emotion => {
        const emotionData = emotions.find(e => e.id === emotion.emotion);
        if (!emotionData) return;
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.dataset.id = emotion.id;
        historyItem.innerHTML = `
          <div class="history-item-content">
            <div class="emotion-color" style="background-color: ${emotionData.color}">${emotionData.icon}</div>
            <div class="emotion-details">
              <div class="emotion-name">${emotionData.name}</div>
              <div class="emotion-time">${formatTime(emotion.timestamp)}</div>
            </div>
            <div class="intensity-value">${emotion.intensity}</div>
          </div>
          <button class="delete-btn" data-id="${emotion.id}" title="Delete this record">
            <i class="fas fa-times"></i>
          </button>
        `;
        
        historyPanel.appendChild(historyItem);
      });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = this.dataset.id;
        if (confirm('Are you sure you want to delete this emotion record?')) {
          deleteEmotion(id);
        }
      });
    });
  }

  function groupByDate(emotions) {
    return emotions.reduce((groups, emotion) => {
      const date = formatDate(new Date(emotion.timestamp));
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(emotion);
      return groups;
    }, {});
  }

  function formatDateHeader(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === formatDate(today)) {
      return 'Today';
    } else if (dateStr === formatDate(yesterday)) {
      return 'Yesterday';
    } else {
      return dateStr;
    }
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  function deleteEmotion(id) {
    let emotions = loadEmotionHistory();
    emotions = emotions.filter(e => e.id !== id);
    saveEmotions(emotions);
    renderEmotionHistory();
    initializeStarMap();
    showToast('Record deleted', 'info');
  }

  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.className = `toast ${type}`;
    
    let icon = '';
    switch(type) {
      case 'success': icon = '<i class="fas fa-check-circle"></i> '; break;
      case 'error': icon = '<i class="fas fa-exclamation-circle"></i> '; break;
      case 'warning': icon = '<i class="fas fa-exclamation-triangle"></i> '; break;
      case 'info': icon = '<i class="fas fa-info-circle"></i> '; break;
    }
    
    toast.innerHTML = `${icon}${message}`;
    toast.classList.add('visible');
    
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3000);
  }

  function initializeStarMap() {
    const emotionHistory = loadEmotionHistory();
    const ctx = starCanvas.getContext('2d');
    
    let stars = [];
    let constellationLines = [];
    let backgroundStars = [];
    let animationFrame;
    
    const resizeCanvas = () => {
      const container = starCanvas.parentElement;
      starCanvas.width = container.offsetWidth;
      starCanvas.height = container.offsetHeight;
      
      createStars();
      createBackgroundStars();
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    function createStars() {
      stars = [];
      
      if (emotionHistory.length === 0) return;
      
      emotionHistory.forEach((emotion, index) => {
        const emotionData = emotions.find(e => e.id === emotion.emotion);
        if (!emotionData) return;
        
        const seedX = parseInt(emotion.id) % 10000;
        const seedY = parseInt(emotion.id) / 10000;
        
        const angleOffset = index * (Math.PI * 0.7);
        const distanceFromCenter = 50 + (emotion.intensity * 20);
        
        const x = (starCanvas.width / 2) + Math.cos(seedX + angleOffset) * distanceFromCenter;
        const y = (starCanvas.height / 2) + Math.sin(seedY + angleOffset) * distanceFromCenter;
        
        const size = 2 + (emotion.intensity / 2);
        
        stars.push({
          x,
          y,
          size,
          color: emotionData.color,
          points: 5 + Math.floor(Math.random() * 2),
          rotation: Math.random() * Math.PI * 2,
          phase: Math.random() * Math.PI * 2,
          emotionData: {
            id: emotion.id,
            name: emotionData.name,
            intensity: emotion.intensity,
            timestamp: emotion.timestamp
          }
        });
      });
      
      createConstellationLines();
    }
    
    function createConstellationLines() {
      constellationLines = [];
      
      if (stars.length < 2) return;
      
      stars.forEach((star, i) => {
        const distances = [];
        
        for (let j = 0; j < stars.length; j++) {
          if (i === j) continue;
          
          const otherStar = stars[j];
          const dx = star.x - otherStar.x;
          const dy = star.y - otherStar.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < starCanvas.width / 4) {
            distances.push({ index: j, distance });
          }
        }
        
        distances.sort((a, b) => a.distance - b.distance);
        
        const connectCount = 1 + Math.floor(Math.random() * 2);
        for (let k = 0; k < Math.min(connectCount, distances.length); k++) {
          const j = distances[k].index;
          
          const lineExists = constellationLines.some(line => 
            (line.from === i && line.to === j) || (line.from === j && line.to === i)
          );
          
          if (!lineExists) {
            constellationLines.push({
              from: i,
              to: j,
              alpha: 0.1 + Math.random() * 0.2
            });
          }
        }
      });
    }
    
    function createBackgroundStars() {
      backgroundStars = [];
      const starCount = Math.floor(starCanvas.width * starCanvas.height / 1000);
      
      for (let i = 0; i < starCount; i++) {
        backgroundStars.push({
          x: Math.random() * starCanvas.width,
          y: Math.random() * starCanvas.height,
          size: 0.1 + Math.random() * 1,
          alpha: 0.1 + Math.random() * 0.6,
          pulse: 0.5 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    
    function animate() {
      ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
      
      drawBackground();
      
      drawBackgroundStars();
      
      if (emotionHistory.length === 0) {
        ctx.font = '18px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('Record your first emotion to create your star map', starCanvas.width / 2, starCanvas.height / 2);
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      
      drawConstellationLines();
      
      stars.forEach(star => drawStar(star));
      
      if (Math.random() < 0.01) {
        createShootingStar();
      }
      
      updateShootingStars();
      
      animationFrame = requestAnimationFrame(animate);
    }
    
    function drawBackground() {
      const gradient = ctx.createRadialGradient(
        starCanvas.width / 2, starCanvas.height / 2, 0,
        starCanvas.width / 2, starCanvas.height / 2, starCanvas.width * 0.7
      );
      
      gradient.addColorStop(0, 'rgba(25, 25, 50, 1)');
      gradient.addColorStop(0.5, 'rgba(15, 15, 35, 1)');
      gradient.addColorStop(1, 'rgba(5, 5, 20, 1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, starCanvas.width, starCanvas.height);
      
      for (let i = 0; i < 5; i++) {
        const cloudGradient = ctx.createRadialGradient(
          Math.random() * starCanvas.width,
          Math.random() * starCanvas.height,
          0,
          Math.random() * starCanvas.width,
          Math.random() * starCanvas.height,
          starCanvas.width * 0.2
        );
        
        const hue = Math.random() * 60;
        const saturation = 30 + Math.random() * 30;
        const lightness = 5 + Math.random() * 10;
        
        cloudGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.1)`);
        cloudGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = cloudGradient;
        ctx.fillRect(0, 0, starCanvas.width, starCanvas.height);
      }
    }
    
    function drawBackgroundStars() {
      backgroundStars.forEach(star => {
        star.phase += 0.01;
        
        const alpha = star.alpha * (0.5 + Math.sin(star.phase) * 0.5 * star.pulse);
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });
    }
    
    function drawConstellationLines() {
      constellationLines.forEach(line => {
        const fromStar = stars[line.from];
        const toStar = stars[line.to];
        
        const gradient = ctx.createLinearGradient(
          fromStar.x, fromStar.y,
          toStar.x, toStar.y
        );
        
        gradient.addColorStop(0, adjustColorAlpha(fromStar.color, line.alpha));
        gradient.addColorStop(1, adjustColorAlpha(toStar.color, line.alpha));
        
        ctx.beginPath();
        ctx.moveTo(fromStar.x, fromStar.y);
        ctx.lineTo(toStar.x, toStar.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }
    
    function adjustColorAlpha(color, alpha) {
      if (color.startsWith('#')) {
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      return color;
    }
    
    function drawStar(star) {
      ctx.save();
      
      star.phase += 0.01;
      
      ctx.translate(star.x, star.y);
      
      ctx.rotate(star.rotation + Math.sin(star.phase * 0.2) * 0.05);
      
      const scale = 1 + Math.sin(star.phase) * 0.1;
      ctx.scale(scale, scale);
      
      const points = star.points;
      const outerRadius = star.size;
      const innerRadius = star.size * 0.4;
      
      const gradient = ctx.createRadialGradient(0, 0, innerRadius, 0, 0, outerRadius * 3);
      gradient.addColorStop(0, adjustColorAlpha(star.color, 0.8));
      gradient.addColorStop(0.5, adjustColorAlpha(star.color, 0.2));
      gradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(0, 0, outerRadius * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points;
        
        if (i === 0) {
          ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        } else {
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
      }
      
      ctx.closePath();
      ctx.fillStyle = star.color;
      ctx.fill();
      
      ctx.restore();
    }
    
    let shootingStars = [];

    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `${r}, ${g}, ${b}`;
    }
    
    let hoveredStar = null;
    
    starCanvas.addEventListener('mousemove', function(e) {
      const rect = starCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      hoveredStar = null;
      starCanvas.style.cursor = 'default';
      
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= star.size * 4) {
          hoveredStar = star;
          starCanvas.style.cursor = 'pointer';
          break;
        }
      }
    });
    
    starCanvas.addEventListener('click', function(e) {
      if (hoveredStar) {
        console.log('Clicked on star:', hoveredStar.emotionData);
      }
    });
    
    function drawStarInfo() {
      if (!hoveredStar) return;
      
      const star = hoveredStar;
      const data = star.emotionData;
      
      const date = new Date(data.timestamp);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
      const text = `${data.name} (Intensity: ${data.intensity})
${formattedDate} ${formattedTime}`;
      
      ctx.save();
      
      ctx.font = '14px Inter, sans-serif';
      const textLines = text.split('\n');
      const textWidth = Math.max(...textLines.map(line => ctx.measureText(line).width));
      const boxWidth = textWidth + 20;
      const boxHeight = textLines.length * 20 + 10;
      
      let boxX = star.x + 20;
      let boxY = star.y - boxHeight - 10;
      
      if (boxX + boxWidth > starCanvas.width) {
        boxX = star.x - boxWidth - 20;
      }
      
      if (boxY < 0) {
        boxY = star.y + 20;
      }
      
      const bgGradient = ctx.createLinearGradient(boxX, boxY, boxX + boxWidth, boxY + boxHeight);
      bgGradient.addColorStop(0, 'rgba(30, 30, 60, 0.9)');
      bgGradient.addColorStop(1, 'rgba(20, 20, 40, 0.9)');
      
      ctx.fillStyle = bgGradient;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8);
      ctx.fill();
      
      ctx.strokeStyle = star.color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.stroke();
      
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      
      textLines.forEach((line, i) => {
        ctx.fillText(line, boxX + 10, boxY + 10 + (i * 20));
      });
      
      ctx.restore();
    }
    
    function updateAnimation() {
      animate();
      
      if (hoveredStar) {
        drawStarInfo();
      }
      
      animationFrame = requestAnimationFrame(updateAnimation);
    }
    
    createStars();
    createBackgroundStars();
    updateAnimation();
    
    return function cleanup() {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }

  emotionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedEmotion = document.querySelector('.emotion-item.selected');
    if (!selectedEmotion) {
      showToast('Please select an emotion', 'error');
      return;
    }
    
    const emotionId = selectedEmotion.dataset.id;
    const intensity = parseInt(intensityInput.value);
    const date = dateInput.value;
    const timestamp = new Date(date).getTime();
    
    const emotion = {
      id: Date.now().toString(),
      emotion: emotionId,
      intensity: intensity,
      timestamp: timestamp
    };
    
    const emotionHistory = loadEmotionHistory();
    emotionHistory.push(emotion);
    saveEmotions(emotionHistory);
    
    renderEmotionHistory();
    initializeStarMap();
    
    showToast('Emotion record saved', 'success');
    
    document.querySelectorAll('.emotion-item').forEach(item => {
      item.classList.remove('selected');
    });
    intensityInput.value = 5;
    intensityValue.textContent = 5;
    
    emotionModal.classList.remove('active');
  });

  zodiacSelect.addEventListener('change', function() {
    const selectedZodiac = this.value;
    if (selectedZodiac) {
      showZodiacInfo(selectedZodiac);
    } else {
      zodiacInfo.style.display = 'none';
    }
  });

  recordEmotionBtn.addEventListener('click', function() {
    emotionModal.classList.add('active');
  });

  closeModal.addEventListener('click', function() {
    emotionModal.classList.remove('active');
  });

  emotionModal.addEventListener('click', function(e) {
    if (e.target === emotionModal) {
      emotionModal.classList.remove('active');
    }
  });

  async function loadZodiacData() {
    try {
      const response = await fetch('assets/data.json');
      if (!response.ok) throw new Error('Failed to load zodiac data');
      const data = await response.json();
      
      populateZodiacSelects(data.zodiacSigns);
      
      data.zodiacSigns.forEach(sign => {
        dailyAdviceData[sign.sign.toLowerCase()] = sign.advice;
      });
      
      if (userZodiac) {
        zodiacSelect.value = userZodiac;
        updateZodiacInfo(userZodiac);
        initialZodiacModal.classList.remove('active');
      }
    } catch (error) {
      console.error('Error loading zodiac data:', error);
      showToast('Unable to load zodiac data, please refresh the page and try again', 'error');
    }
  }
  
  function populateZodiacSelects(signs) {
    signs.forEach(sign => {
      const option1 = document.createElement('option');
      option1.value = sign.sign.toLowerCase();
      option1.textContent = sign.sign;
      zodiacSelect.appendChild(option1);
      
      const option2 = document.createElement('option');
      option2.value = sign.sign.toLowerCase();
      option2.textContent = sign.sign;
      initialZodiacSelect.appendChild(option2);
    });
  }
  
  function updateZodiacInfo(zodiacId) {
    fetch('assets/data.json')
      .then(response => response.json())
      .then(data => {
        const sign = data.zodiacSigns.find(s => s.sign.toLowerCase() === zodiacId);
        if (!sign) return;
        
        zodiacTitle.textContent = sign.sign;
        zodiacPeriod.textContent = sign.period;
        zodiacElement.textContent = sign.element;
        
        const currentEmotion = getCurrentEmotion();
        const advice = sign.advice[currentEmotion] || sign.advice["Happy"];
        
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        });
        
        zodiacMessage.innerHTML = `<strong>${dateStr}</strong><br><br>${advice}`;
      })
      .catch(error => {
        console.error('Error updating zodiac info:', error);
        zodiacMessage.textContent = 'Unable to get zodiac advice';
      });
  }
  
  function getCurrentEmotion() {
    const emotionHistory = loadEmotionHistory();
    if (emotionHistory.length === 0) return "Happy";
    
    const today = new Date().toISOString().split('T')[0];
    const todayEmotions = emotionHistory.filter(e => e.date === today);
    
    if (todayEmotions.length === 0) {
      const lastEmotion = emotionHistory[emotionHistory.length - 1];
      const emotionObj = emotions.find(e => e.id === lastEmotion.emotion);
      return mapEmotionToEnglish(emotionObj?.name || "Happy");
    }
    
    const counts = {};
    todayEmotions.forEach(e => {
      counts[e.emotion] = (counts[e.emotion] || 0) + 1;
    });
    
    let maxCount = 0;
    let mainEmotion = null;
    for (const [emotion, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        mainEmotion = emotion;
      }
    }
    
    const emotionObj = emotions.find(e => e.id === mainEmotion);
    return mapEmotionToEnglish(emotionObj?.name || "Happy");
  }
  
  function mapEmotionToEnglish(englishEmotion) {
    const mapping = {
      'Happy': 'Happy',
      'Excited': 'Excited',
      'Calm': 'Calm',
      'Sad': 'Sad',
      'Anxious': 'Anxious',
      'Angry': 'Angry',
      'Tired': 'Tired',
      'Grateful': 'Happy'
    };
    
    return mapping[englishEmotion] || 'Happy';
  }
  
  zodiacSelect.addEventListener('change', function() {
    userZodiac = this.value;
    localStorage.setItem('userZodiac', userZodiac);
    updateZodiacInfo(userZodiac);
  });
  
  saveZodiacBtn.addEventListener('click', function() {
    userZodiac = initialZodiacSelect.value;
    if (!userZodiac) {
      showToast('Please select your zodiac sign', 'warning');
      return;
    }
    
    localStorage.setItem('userZodiac', userZodiac);
    zodiacSelect.value = userZodiac;
    updateZodiacInfo(userZodiac);
    initialZodiacModal.classList.remove('active');
    showToast('Zodiac setting successful!', 'success');
  });

  loadZodiacData();

  populateEmotionGrid();
  populateZodiacSelect();
  renderEmotionHistory();
  initializeStarMap();
});