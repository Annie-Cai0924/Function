// Wait for the HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', function() {

  // Retrieve constellations in local storage
  let userZodiac = localStorage.getItem('userZodiac') || '';
  // store daily advice data for each zodiac sig but when it is a empty it will be initialized
  const dailyAdviceData = {};
  
  //The function of this array is that when the front end shows the user to choose emotions, it can get "what name to show", "what color to use", "what expression to match" directly from here. And then I can use these colors or ICONS to visualize the emotional record, like drawing charts or pointing stars
 
  //my inspiration for this design also comes from the application of emotion tracking, which emphasizes the graphical expression of emotions, which I think is more intuitive and cute for users
  //make a pop window of emotions that the user can choose 
  //Every emoji will be a star dispaly on the canvas
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

  //I wrote this paragraph to store basic information about each sign. Each constellation is a small object, consisting of four things
  //It's what I use to keep all the basic data on the constellations. Every constellation is an object

  //Define the data of 12horoscopes
  //Name: horoscopes' name (to display)
  //Id: horoscopes's name
  //element: the four classic element
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

  //My friend told me to refer to the basic DOM manipulation methods, such as using document.getElementById() to select a specific ID in HTML, so that I can use JavaScript to control these elements, such as displaying a pop-up window, updating the value of the slider, Or automatically fill in today's date

  //when user click on an emotion and it highlights; You drag the slider, it will show the strength value in real time; When you select a constellation, it will be saved and can be used the next time you open the page. This is also the basis for the smooth operation of the entire constellation mood tracking project

  //Get the data from html
  //display the emotion options
  const emotionGrid = document.getElementById('emotion-grid');
  //Range the emotion indensity
  const intensityInput = document.getElementById('intensity');
  //This is the spot on the page where the "emotional strength number" is displayed，displays the value selected by the slider
  const intensityValue = document.getElementById('intensity-value');
  //This is to get the date input box on the page. 
  //I use it to pick today or a day in the past to record emotions.
  const dateInput = document.getElementById('date');
  //This is the container for the entire "mood record form" (including mood, date, intensity, and so on). 
  //It is used when you submit records.
  const emotionForm = document.getElementById('emotion-form');
  //this is used to display the emotional history recorded in the past. 
//It's like a mood diary area where you can see your previous mood records.
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
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const closeSidePanel = document.getElementById('close-side-panel');
  const sidePanel = document.querySelector('.side-panel');
  const mobileRecordBtn = document.getElementById('mobile-record-btn');

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  dateInput.value = formattedDate;
  
  dateInput.max = formattedDate;
  
  function toggleMobileMenu(show) {
    if (show) {
      sidePanel.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => {
        document.querySelectorAll('.side-panel .panel-card').forEach((card, index) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 100);
        });
      }, 100);
    } else {
      sidePanel.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  function closeMenuIfMobile() {
    if (window.innerWidth <= 375 && sidePanel.classList.contains('active')) {
      toggleMobileMenu(false);
    }
  }
  
  function openModal(modal) {
    closeMenuIfMobile();
    modal.classList.add('active');
    
    setTimeout(() => {
      if (modal.querySelector('.modal')) {
        modal.querySelector('.modal').style.transform = 'translateY(0) scale(1)';
        modal.querySelector('.modal').style.opacity = '1';
      }
    }, 10);
  }
  
  function closeModalAnimation(modal) {
    if (modal.querySelector('.modal')) {
      modal.querySelector('.modal').style.transform = 'translateY(30px) scale(0.95)';
      modal.querySelector('.modal').style.opacity = '0';
    }
    
    setTimeout(() => {
      modal.classList.remove('active');
    }, 300);
  }
  
  mobileMenuBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileMenu(true);
    
    console.log('Mobile menu button clicked');
  }, true);
  
  closeSidePanel.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileMenu(false);
  }, true);
  
  sidePanel.addEventListener('click', function(e) {
    e.stopPropagation();
  }, true);
  
  const menuTooltip = document.querySelector('.mobile-menu-tooltip');
  if (menuTooltip) {
    menuTooltip.style.display = 'none';
  }
  
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 375 && 
        sidePanel.classList.contains('active') &&
        !sidePanel.contains(e.target) && 
        e.target !== mobileMenuBtn &&
        !mobileMenuBtn.contains(e.target)) {
      toggleMobileMenu(false);
    }
  });
  
  mobileRecordBtn.addEventListener('click', function() {
    closeMenuIfMobile();
    openModal(emotionModal);
  });

  function handleResponsiveLayout() {
    if (window.innerWidth <= 375) {
      if (sidePanel.classList.contains('active') && window.innerWidth > 375) {
        sidePanel.classList.remove('active');
        document.body.style.overflow = '';
      }
      
      const starContainer = document.querySelector('.star-map-container');
      if (starContainer) {
        starContainer.style.height = '100%';
        starContainer.style.width = '100%';
        starContainer.style.overflow = 'hidden';
      }
      
      if (starCanvas) {
        resizeStarCanvas();
      }
    }
  }

  function resizeStarCanvas() {
    if (!starCanvas) return;
    
    const container = starCanvas.parentElement;
    if (!container) return;
    
    starCanvas.width = container.offsetWidth;
    starCanvas.height = container.offsetHeight;
    
    if (typeof initializeStarMap === 'function') {
      initializeStarMap();
    }
  }
  
  handleResponsiveLayout();
  window.addEventListener('resize', handleResponsiveLayout);

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
    
    if (window.innerWidth <= 375) {
      let zodiacMobileSelect = document.getElementById('zodiac-mobile-select');
      
      if (!zodiacMobileSelect) {
        const zodiacHeader = document.querySelector('.zodiac-header');
        zodiacMobileSelect = document.createElement('select');
        zodiacMobileSelect.id = 'zodiac-mobile-select';
        zodiacMobileSelect.className = 'form-control';
        zodiacMobileSelect.innerHTML = '<option value="">Select Zodiac Sign</option>';
        
        zodiacSigns.forEach(sign => {
          const option = document.createElement('option');
          option.value = sign.id;
          option.textContent = sign.name;
          zodiacMobileSelect.appendChild(option);
        });
        
        if (userZodiac) {
          zodiacMobileSelect.value = userZodiac;
        }
        
        zodiacMobileSelect.addEventListener('change', function() {
          userZodiac = this.value;
          zodiacSelect.value = userZodiac;
          localStorage.setItem('userZodiac', userZodiac);
          updateZodiacInfo(userZodiac);
        });
        
        zodiacHeader.insertBefore(zodiacMobileSelect, zodiacHeader.firstChild);
      }
    }
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
  
  recordEmotionBtn.addEventListener('click', function() {
    closeMenuIfMobile();
    openModal(emotionModal);
  });
  
  closeModal.addEventListener('click', function() {
    closeModalAnimation(emotionModal);
  });
  
  emotionModal.addEventListener('click', function(e) {
    if (e.target === emotionModal) {
      closeModalAnimation(emotionModal);
    }
  });
  
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
    
    closeModalAnimation(emotionModal);
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

  function initializeStarMap() {
    const emotionHistory = loadEmotionHistory();
    const ctx = starCanvas.getContext('2d');
    
    let stars = [];
    let constellationLines = [];
    let backgroundStars = [];
    let animationFrame;
    
    // 添加拖动功能变量
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let viewOffset = { x: 0, y: 0 };
    let lastViewOffset = { x: 0, y: 0 };
    let minScale = 0.5;
    let maxScale = 2.0;
    let currentScale = 1.0;
    
    const resizeCanvas = () => {
      const container = starCanvas.parentElement;
      starCanvas.width = container.offsetWidth;
      starCanvas.height = container.offsetHeight;
      
      createStars();
      createBackgroundStars();
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // 添加触摸和鼠标事件监听器
    function setupDragListeners() {
      // 鼠标事件
      starCanvas.addEventListener('mousedown', startDrag);
      starCanvas.addEventListener('mousemove', drag);
      starCanvas.addEventListener('mouseup', endDrag);
      starCanvas.addEventListener('mouseleave', endDrag);
      
      // 触摸事件
      starCanvas.addEventListener('touchstart', startDragTouch, { passive: false });
      starCanvas.addEventListener('touchmove', dragTouch, { passive: false });
      starCanvas.addEventListener('touchend', endDragTouch);
      starCanvas.addEventListener('touchcancel', endDragTouch);
    }
    
    function startDrag(e) {
      isDragging = true;
      dragStart.x = e.clientX;
      dragStart.y = e.clientY;
      lastViewOffset.x = viewOffset.x;
      lastViewOffset.y = viewOffset.y;
      starCanvas.style.cursor = 'grabbing';
    }
    
    function drag(e) {
      if (!isDragging) return;
      
      viewOffset.x = lastViewOffset.x + (e.clientX - dragStart.x) / currentScale;
      viewOffset.y = lastViewOffset.y + (e.clientY - dragStart.y) / currentScale;
      
      const maxOffset = starCanvas.width / 2;
      viewOffset.x = Math.max(Math.min(viewOffset.x, maxOffset), -maxOffset);
      viewOffset.y = Math.max(Math.min(viewOffset.y, maxOffset), -maxOffset);
    }
    
    function endDrag() {
      isDragging = false;
      starCanvas.style.cursor = 'default';
    }
    
    function startDragTouch(e) {
      if (e.touches.length === 1) {
        e.preventDefault();
        isDragging = true;
        dragStart.x = e.touches[0].clientX;
        dragStart.y = e.touches[0].clientY;
        lastViewOffset.x = viewOffset.x;
        lastViewOffset.y = viewOffset.y;
      }
    }
    
    function dragTouch(e) {
      if (!isDragging || e.touches.length !== 1) return;
      e.preventDefault();
      
      viewOffset.x = lastViewOffset.x + (e.touches[0].clientX - dragStart.x) / currentScale;
      viewOffset.y = lastViewOffset.y + (e.touches[0].clientY - dragStart.y) / currentScale;
      
      const maxOffset = starCanvas.width / 2;
      viewOffset.x = Math.max(Math.min(viewOffset.x, maxOffset), -maxOffset);
      viewOffset.y = Math.max(Math.min(viewOffset.y, maxOffset), -maxOffset);
    }
    
    function endDragTouch() {
      isDragging = false;
    }
    
    setupDragListeners();
    
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
    
    function drawConstellationLines() {
      if (stars.length < 2 || !constellationLines || constellationLines.length === 0) {
        createConstellationLines();
        if (stars.length < 2 || !constellationLines || constellationLines.length === 0) {
          return;
        }
      }
      
      constellationLines.forEach(line => {
        if (!stars[line.from] || !stars[line.to]) return;
        
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
        
        const connectCount = 2 + Math.floor(Math.random() * 2);
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
      
      if (constellationLines.length === 0 && stars.length >= 2) {
        for (let i = 0; i < stars.length - 1; i++) {
          constellationLines.push({
            from: i,
            to: i + 1,
            alpha: 0.1 + Math.random() * 0.2
          });
        }
      }
    }
    
    function drawBackground() {
      const centerX = starCanvas.width / 2 - viewOffset.x / currentScale;
      const centerY = starCanvas.height / 2 - viewOffset.y / currentScale;
      const radius = starCanvas.width * 0.7 / currentScale;
      
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      
      gradient.addColorStop(0, 'rgba(25, 25, 50, 1)');
      gradient.addColorStop(0.5, 'rgba(15, 15, 35, 1)');
      gradient.addColorStop(1, 'rgba(5, 5, 20, 1)');
      
      ctx.fillStyle = gradient;
      
      const viewWidth = starCanvas.width / currentScale;
      const viewHeight = starCanvas.height / currentScale;
      const fillX = -viewOffset.x / currentScale;
      const fillY = -viewOffset.y / currentScale;
      
      ctx.fillRect(fillX, fillY, viewWidth, viewHeight);
      
      for (let i = 0; i < 5; i++) {
        const cloudX = centerX + (Math.random() - 0.5) * radius;
        const cloudY = centerY + (Math.random() - 0.5) * radius;
        const cloudSize = radius * 0.3;
        
        const cloudGradient = ctx.createRadialGradient(
          cloudX, cloudY, 0,
          cloudX, cloudY, cloudSize
        );
        
        const hue = Math.random() * 60;
        const saturation = 30 + Math.random() * 30;
        const lightness = 5 + Math.random() * 10;
        
        cloudGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.1)`);
        cloudGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = cloudGradient;
        ctx.fillRect(fillX, fillY, viewWidth, viewHeight);
      }
    }
    
    function createBackgroundStars() {
      backgroundStars = [];
      const starCount = Math.floor(starCanvas.width * starCanvas.height / 500);
      
      const margin = Math.max(starCanvas.width, starCanvas.height);
      
      for (let i = 0; i < starCount; i++) {
        backgroundStars.push({
          x: (Math.random() * (starCanvas.width + 2 * margin)) - margin,
          y: (Math.random() * (starCanvas.height + 2 * margin)) - margin,
          size: 0.1 + Math.random() * 1,
          alpha: 0.1 + Math.random() * 0.6,
          pulse: 0.5 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2
        });
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
    let hoveredStar = null;

    function createShootingStar() {
      if (shootingStars.length >= 5) return;
      
      const startX = Math.random() * starCanvas.width;
      const startY = 0;
      
      const angle = Math.PI / 4 + Math.random() * Math.PI / 4;
      const length = 100 + Math.random() * 150;
      
      const speed = 5 + Math.random() * 10;
      
      const colors = ['#ffffff', '#aaaaff', '#ffaaaa', '#aaffaa'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      shootingStars.push({
        x: startX,
        y: startY,
        angle,
        length,
        speed,
        color,
        progress: 0,
        opacity: 1
      });
    }

    function updateShootingStars() {
      shootingStars = shootingStars.filter(star => {
        star.progress += star.speed / 100;
        
        if (star.progress >= 1) return false;
        
        drawShootingStar(star);
        return true;
      });
    }

    function drawShootingStar(star) {
      ctx.save();
      
      const endX = star.x + Math.cos(star.angle) * star.length;
      const endY = star.y + Math.sin(star.angle) * star.length;
      
      const currentX = star.x + Math.cos(star.angle) * star.length * star.progress;
      const currentY = star.y + Math.sin(star.angle) * star.length * star.progress;
      
      const gradient = ctx.createLinearGradient(
        currentX, currentY,
        currentX - Math.cos(star.angle) * 30, 
        currentY - Math.sin(star.angle) * 30
      );
      
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.1, `rgba(${hexToRgb(star.color)}, 0.7)`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(
        currentX - Math.cos(star.angle) * 30, 
        currentY - Math.sin(star.angle) * 30
      );
      ctx.lineWidth = 2;
      ctx.strokeStyle = gradient;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
      
      ctx.restore();
    }

    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `${r}, ${g}, ${b}`;
    }
    
    function animate() {
      ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
      
      ctx.fillStyle = 'rgba(5, 5, 20, 1)';
      ctx.fillRect(0, 0, starCanvas.width, starCanvas.height);
      
      ctx.save();
      
      ctx.translate(viewOffset.x, viewOffset.y);
      ctx.scale(currentScale, currentScale);
      
      drawBackground();
      
      drawBackgroundStars();
      
      if (emotionHistory.length === 0) {
        ctx.font = '18px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('Record your first emotion to create your star map', 
                    (starCanvas.width / 2 - viewOffset.x) / currentScale, 
                    (starCanvas.height / 2 - viewOffset.y) / currentScale);
        ctx.restore();
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      
      drawConstellationLines();
      stars.forEach(star => drawStar(star));
      
      if (Math.random() < 0.01) {
        createShootingStar();
      }
      
      updateShootingStars();
    
      ctx.restore();
      
      if (window.innerWidth <= 375) {
        drawDragIndicator();
      }
      
      animationFrame = requestAnimationFrame(animate);
    }
    
    function drawDragIndicator() {
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.textAlign = 'center';
      ctx.fillText('拖动查看更多星星', starCanvas.width / 2, starCanvas.height - 20);
      ctx.restore();
    }

    starCanvas.addEventListener('mousemove', function(e) {
      if (isDragging) return;
      
      const rect = starCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const adjustedX = (mouseX - viewOffset.x) / currentScale;
      const adjustedY = (mouseY - viewOffset.y) / currentScale;
      
      hoveredStar = null;
      starCanvas.style.cursor = 'default';
      
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const dx = adjustedX - star.x;
        const dy = adjustedY - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= star.size * 4) {
          hoveredStar = star;
          starCanvas.style.cursor = 'pointer';
          break;
        }
      }
    });
    
    starCanvas.addEventListener('click', function(e) {
      if (isDragging) return;
      
      if (hoveredStar) {
        console.log('Clicked on star:', hoveredStar.emotionData);
      }
    });
    
    function drawStarInfo() {
      if (!hoveredStar) return;
      
      ctx.save();
      
      ctx.translate(viewOffset.x, viewOffset.y);
      ctx.scale(currentScale, currentScale);
      
      const star = hoveredStar;
      const data = star.emotionData;
      
      const date = new Date(data.timestamp);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
      const text = `${data.name} (Intensity: ${data.intensity})
${formattedDate} ${formattedTime}`;
      
      ctx.font = '14px Inter, sans-serif';
      const textLines = text.split('\n');
      const textWidth = Math.max(...textLines.map(line => ctx.measureText(line).width));
      const boxWidth = textWidth + 20;
      const boxHeight = textLines.length * 20 + 10;
      
      let boxX = star.x + 20;
      let boxY = star.y - boxHeight - 10;
      
      const effectiveWidth = starCanvas.width / currentScale;
      const effectiveHeight = starCanvas.height / currentScale;
      
      if (boxX + boxWidth > effectiveWidth) {
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
    
    let initialPinchDistance = 0;
    
    starCanvas.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
      }
    }, { passive: false });
    
    starCanvas.addEventListener('touchmove', function(e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const pinchDistance = Math.sqrt(dx * dx + dy * dy);
        
        if (initialPinchDistance > 0) {
          const scaleFactor = pinchDistance / initialPinchDistance;
          let newScale = currentScale * scaleFactor;
          
          newScale = Math.max(minScale, Math.min(newScale, maxScale));
          
          const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          
          const rect = starCanvas.getBoundingClientRect();
          const canvasCenterX = centerX - rect.left;
          const canvasCenterY = centerY - rect.top;
          
          viewOffset.x = canvasCenterX - (canvasCenterX - viewOffset.x) * (newScale / currentScale);
          viewOffset.y = canvasCenterY - (canvasCenterY - viewOffset.y) * (newScale / currentScale);
          
          currentScale = newScale;
          initialPinchDistance = pinchDistance;
        }
      }
    }, { passive: false });
    
    starCanvas.addEventListener('touchend', function(e) {
      if (e.touches.length < 2) {
        initialPinchDistance = 0;
      }
    });
    
    starCanvas.addEventListener('wheel', function(e) {
      e.preventDefault();
      
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      let newScale = currentScale * scaleFactor;
      
      newScale = Math.max(minScale, Math.min(newScale, maxScale));
      
      const rect = starCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      viewOffset.x = mouseX - (mouseX - viewOffset.x) * (newScale / currentScale);
      viewOffset.y = mouseY - (mouseY - viewOffset.y) * (newScale / currentScale);
      
      currentScale = newScale;
    }, { passive: false });
    
    createStars();
    createBackgroundStars();
    updateAnimation();
    
    return function cleanup() {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener('resize', resizeCanvas);
      
      starCanvas.removeEventListener('mousedown', startDrag);
      starCanvas.removeEventListener('mousemove', drag);
      starCanvas.removeEventListener('mouseup', endDrag);
      starCanvas.removeEventListener('mouseleave', endDrag);
      starCanvas.removeEventListener('touchstart', startDragTouch);
      starCanvas.removeEventListener('touchmove', dragTouch);
      starCanvas.removeEventListener('touchend', endDragTouch);
      starCanvas.removeEventListener('touchcancel', endDragTouch);
    };
  }

  loadZodiacData();
  populateEmotionGrid();
  populateZodiacSelect();
  renderEmotionHistory();
  initializeStarMap();

  function ensureMenuButtonClickable() {
    if (window.innerWidth <= 375) {
      mobileMenuBtn.style.zIndex = '100';
      
      mobileMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu(true);
        console.log('Mobile menu button clicked - reattached');
      }, true);
    }
  }
  
  ensureMenuButtonClickable();
  window.addEventListener('resize', ensureMenuButtonClickable);

  function fixMobileMenuButton() {
    if (window.innerWidth <= 375) {
      mobileMenuBtn.style.zIndex = '999';
      mobileMenuBtn.style.display = 'flex';
      mobileMenuBtn.style.position = 'relative';
      
      console.log("Fixing mobile menu button");
      
      mobileMenuBtn.removeEventListener('click', handleMenuClick);
      mobileMenuBtn.addEventListener('click', handleMenuClick, true);
      
      mobileMenuBtn.setAttribute('onclick', "this.classList.add('clicked'); setTimeout(() => this.classList.remove('clicked'), 300);");
    }
  }
  
  function handleMenuClick(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Menu clicked - handler');
    toggleMobileMenu(true);
  }
  
  fixMobileMenuButton();
  
  window.addEventListener('load', fixMobileMenuButton);
  
  mobileMenuBtn.oncontextmenu = function(e) {
    e.preventDefault();
    return false;
  };

  function fixMenuCloseIssues() {
    const closeBtn = document.getElementById('close-side-panel');
    if (closeBtn) {
      closeBtn.removeEventListener('click', handleCloseMenu);
      closeBtn.addEventListener('click', handleCloseMenu, false);
      closeBtn.setAttribute('onclick', 'document.querySelector(".side-panel").classList.remove("active"); document.body.style.overflow = "";');
      
      closeBtn.style.zIndex = '999';
      closeBtn.style.display = 'flex';
      closeBtn.style.cursor = 'pointer';
    }
    
    document.querySelectorAll('.side-panel a, .side-panel button:not(#close-side-panel)').forEach(item => {
      item.addEventListener('click', function() {
        toggleMobileMenu(false);
      });
    });
    
    document.addEventListener('click', function(e) {
      if (sidePanel.classList.contains('active') && 
          !sidePanel.contains(e.target) && 
          e.target !== mobileMenuBtn && 
          !mobileMenuBtn.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidePanel.classList.contains('active')) {
        toggleMobileMenu(false);
      }
    });
  }
  
  function handleCloseMenu(e) {
    console.log('Close menu button clicked');
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    toggleMobileMenu(false);
  }
  
  fixMenuCloseIssues();
  window.addEventListener('load', fixMenuCloseIssues);
  
  function addEmergencyCloseButton() {
    const closeBtn = document.getElementById('close-side-panel');
    if (closeBtn) {
      closeBtn.style.zIndex = '9999';
      closeBtn.style.display = 'flex';
      closeBtn.style.position = 'absolute';
      closeBtn.style.cursor = 'pointer';
      
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu(false);
      }, true);
      
      closeBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        toggleMobileMenu(false);
      }, {passive: false});
    }
  }
  
  addEmergencyCloseButton();

  let touchStartX = 0;
  let touchEndX = 0;
  
  sidePanel.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  sidePanel.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    if (touchEndX < touchStartX && Math.abs(touchEndX - touchStartX) > 50) {
      toggleMobileMenu(false);
    }
  }
  
  if (window.innerWidth <= 375) {
    document.querySelectorAll('.side-panel .panel-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.4s ease';
    });
  }
  
  saveZodiacBtn.addEventListener('click', function() {
    userZodiac = initialZodiacSelect.value;
    if (!userZodiac) {
      showToast('Please select your zodiac sign', 'warning');
      return;
    }
    
    localStorage.setItem('userZodiac', userZodiac);
    zodiacSelect.value = userZodiac;
    
    const zodiacMobileSelect = document.getElementById('zodiac-mobile-select');
    if (zodiacMobileSelect) {
      zodiacMobileSelect.value = userZodiac;
    }
    
    updateZodiacInfo(userZodiac);
    closeModalAnimation(initialZodiacModal);
    showToast('Zodiac setting successful!', 'success');
  });
  
  zodiacSelect.addEventListener('change', function() {
    userZodiac = this.value;
    localStorage.setItem('userZodiac', userZodiac);
    
    const zodiacMobileSelect = document.getElementById('zodiac-mobile-select');
    if (zodiacMobileSelect) {
      zodiacMobileSelect.value = userZodiac;
    }
    
    updateZodiacInfo(userZodiac);
  });
  
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

  function ensureCloseBtnVisibility() {
    const closeBtn = document.getElementById('close-side-panel');
    if (closeBtn) {
      if (window.innerWidth <= 375) {
        closeBtn.style.display = 'flex';
        
        closeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          sidePanel.classList.remove('active');
          document.body.style.overflow = '';
          console.log('Close panel button clicked (mobile)');
        }, true);
      } else {
        closeBtn.style.display = 'none';
      }
    }
  }
  
  ensureCloseBtnVisibility();
  window.addEventListener('resize', ensureCloseBtnVisibility);
});