const minutesInput = document.getElementById('minutes');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timeDisplay = document.getElementById('time');

let timeLeft;
let timerId = null;

function updateDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (timerId !== null) return;
    
    const minutes = parseInt(minutesInput.value);
    if (isNaN(minutes) || minutes <= 0) {
        alert('Please enter a valid number of minutes');
        return;
    }
    
    timeLeft = minutes * 60;
    updateDisplay(timeLeft);
    
    startBtn.disabled = true;
    minutesInput.disabled = true;
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            alert('Time is up!');
            resetTimer();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    startBtn.disabled = false;
    minutesInput.disabled = false;
    minutesInput.value = '';
    timeDisplay.textContent = '00:00';
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

minutesInput.addEventListener('input', () => {
    if (minutesInput.value < 0) {
        minutesInput.value = 0;
    }
});