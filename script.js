document.addEventListener('DOMContentLoaded', () => {
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const timeDisplay = document.getElementById('time');
    const progressBar = document.getElementById('progress');

    let timeLeft = 0;
    let totalTime = 0;
    let timerId = null;
    let isPaused = false;

    // Create audio context for the beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    function createBeepSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    function formatTime(timeInSeconds) {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function updateDisplay() {
        timeDisplay.textContent = formatTime(timeLeft);
        const progress = ((totalTime - timeLeft) / totalTime) * 100;
        progressBar.style.width = `${100 - progress}%`;
    }

    function startTimer() {
        if (!isPaused) {
            const hours = parseInt(hoursInput.value) || 0;
            const minutes = parseInt(minutesInput.value) || 0;
            const seconds = parseInt(secondsInput.value) || 0;
            
            timeLeft = hours * 3600 + minutes * 60 + seconds;
            totalTime = timeLeft;

            if (timeLeft <= 0) return;

            // Disable inputs
            hoursInput.disabled = true;
            minutesInput.disabled = true;
            secondsInput.disabled = true;
        }

        isPaused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;

        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                clearInterval(timerId);
                createBeepSound();
                resetTimer();
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerId);
        isPaused = true;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    function resetTimer() {
        clearInterval(timerId);
        timeLeft = 0;
        totalTime = 0;
        isPaused = false;

        // Enable inputs
        hoursInput.disabled = false;
        minutesInput.disabled = false;
        secondsInput.disabled = false;

        // Reset input values
        hoursInput.value = '';
        minutesInput.value = '';
        secondsInput.value = '';

        // Reset buttons
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;

        // Reset display
        timeDisplay.textContent = '00:00:00';
        progressBar.style.width = '100%';
    }

    // Input validation
    function validateInput(input, max) {
        let value = parseInt(input.value) || 0;
        if (value < 0) value = 0;
        if (value > max) value = max;
        input.value = value || '';
    }

    hoursInput.addEventListener('change', () => validateInput(hoursInput, 99));
    minutesInput.addEventListener('change', () => validateInput(minutesInput, 59));
    secondsInput.addEventListener('change', () => validateInput(secondsInput, 59));

    // Button event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
});
