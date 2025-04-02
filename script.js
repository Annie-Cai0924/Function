// Get DOM elements
const emotionSelect = document.getElementById('emotion');
const intensitySlider = document.getElementById('intensity');
const intensityValue = document.getElementById('intensity-value');
const noteInput = document.getElementById('note');
const saveBtn = document.getElementById('save-btn');
const starChart = document.getElementById('star-chart');
const emotionList = document.getElementById('emotion-list');

// Display intensity value
intensitySlider.addEventListener('input', function() {
    intensityValue.textContent = this.value;
});

// Emotion color mapping
const emotionColors = {
    'Happy': '#FFD700', // Gold
    'Calm': '#48CAFF',  // Sky blue
    'Anxious': '#8A2BE2', // Purple
    'Angry': '#FF4500', // Orange-red
    'Sad': '#4169E1',   // Royal blue
    'Excited': '#FF1493', // Deep pink
    'Tired': '#808080', // Gray
    'Content': '#32CD32' // Lime green
};

// Get emotion data from local storage, initialize as empty array if none exists
let emotions = JSON.parse(localStorage.getItem('emotions')) || [];

// Save emotion data
saveBtn.addEventListener('click', function() {
    const emotion = emotionSelect.value;
    const intensity = parseInt(intensitySlider.value);
    const note = noteInput.value;
    const timestamp = new Date().toISOString();
    
    // Create new emotion data object
    const newEmotion = {
        id: Date.now(), // Use timestamp as unique ID
        emotion,
        intensity,
        note,
        timestamp
    };
    
    // Add new emotion to array
    emotions.push(newEmotion);
    
    // Save to local storage
    localStorage.setItem('emotions', JSON.stringify(emotions));
    
    // Re-render emotion list and star chart
    renderEmotionList();
    renderStarChart();
    
    // Reset form
    noteInput.value = '';
    intensitySlider.value = 5;
    intensityValue.textContent = '5';
});

// Initialize page by rendering emotion list and star chart
renderEmotionList();
renderStarChart();

// Render emotion list
function renderEmotionList() {
    emotionList.innerHTML = '';
    
    // If no emotion data, show message
    if (emotions.length === 0) {
        emotionList.innerHTML = '<p style="text-align: center; color: #888;">No emotion records yet</p>';
        return;
    }
    
    // Sort by time in descending order, showing most recent emotions first
    emotions.slice().reverse().forEach(item => {
        const date = new Date(item.timestamp);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        
        const emotionItem = document.createElement('div');
        emotionItem.className = 'emotion-item';
        emotionItem.innerHTML = `
            <div>
                <strong>${item.emotion}</strong> (Intensity: ${item.intensity}) 
                <span style="color: #888;">${formattedDate}</span>
                ${item.note ? `<p>${item.note}</p>` : ''}
            </div>
            <button class="delete-btn" data-id="${item.id}">Delete</button>
        `;
        emotionList.appendChild(emotionItem);
    });
    
    // Add event listeners for all delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteEmotion(id);
        });
    });
}

// Delete emotion record
function deleteEmotion(id) {
    emotions = emotions.filter(item => item.id !== id);
    localStorage.setItem('emotions', JSON.stringify(emotions));
    renderEmotionList();
    renderStarChart();
}

// Render star chart
function renderStarChart() {
    // Clear star chart
    starChart.innerHTML = '';
    
    // If no emotion data, show message
    if (emotions.length === 0) {
        const noDataText = document.createElement('p');
        noDataText.style.color = 'white';
        noDataText.style.textAlign = 'center';
        noDataText.style.padding = '120px 0';
        noDataText.textContent = 'Record your emotions to create a star chart';
        starChart.appendChild(noDataText);
        return;
    }
    
    // Get star chart container dimensions
    const chartWidth = starChart.clientWidth;
    const chartHeight = 400;
    starChart.style.height = `${chartHeight}px`;
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${chartWidth} ${chartHeight}`);
    starChart.appendChild(svg);
    
    // Add random small stars as background
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * chartWidth;
        const y = Math.random() * chartHeight;
        const size = Math.random() * 2;
        
        const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        star.setAttribute('cx', x);
        star.setAttribute('cy', y);
        star.setAttribute('r', size);
        star.setAttribute('fill', '#FFFFFF');
        star.setAttribute('opacity', Math.random() * 0.5 + 0.3);
        svg.appendChild(star);
    }
    
    // Create a star for each emotion record
    emotions.forEach((item, index) => {
        // Calculate star position and size based on emotion data
        const angle = (index / emotions.length) * Math.PI * 2;
        const distance = 120 + item.intensity * 10; // Higher intensity = further from center
        
        const centerX = chartWidth / 2;
        const centerY = chartHeight / 2;
        
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        const size = 10 + item.intensity; // Higher intensity = larger star
        const color = emotionColors[item.emotion] || '#FFFFFF';
        
        // Create star
        const star = createStar(x, y, size, color, item.intensity / 10);
        svg.appendChild(star);
        
        // Add connecting line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', centerX);
        line.setAttribute('y1', centerY);
        line.setAttribute('x2', x);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-opacity', '0.3');
        svg.insertBefore(line, star);
    });
}

// Create star shape
function createStar(cx, cy, size, color, opacity) {
    const points = 5; // 5-pointed star
    const outerRadius = size;
    const innerRadius = size / 2;
    
    let pointsString = '';
    
    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / points) * i;
        const x = cx + radius * Math.sin(angle);
        const y = cy - radius * Math.cos(angle);
        pointsString += `${x},${y} `;
    }
    
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    star.setAttribute('points', pointsString.trim());
    star.setAttribute('fill', color);
    star.setAttribute('opacity', 0.5 + opacity * 0.5);
    
    // Add glow effect
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    const id = `glow-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    glow.setAttribute('id', id);
    
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '2.5');
    feGaussianBlur.setAttribute('result', 'coloredBlur');
    glow.appendChild(feGaussianBlur);
    
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    feMerge.appendChild(feMergeNode1);
    
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode2);
    
    glow.appendChild(feMerge);
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.appendChild(glow);
    
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.appendChild(defs);
    
    star.setAttribute('filter', `url(#${id})`);
    group.appendChild(star);
    
    return group;
}

// Re-render star chart when window size changes
window.addEventListener('resize', renderStarChart);