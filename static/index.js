const modalBackdrop = document.getElementById('modal-backdrop')
var timer = document.getElementById('main-timer')
var focusTime = 25
var shortBreakTime = 5
var longBreakTime = 25
var timerType = 0           // 0 = focus, 1 = short break, 2 = long break
var currentTime = 25 * 60
var interval;
var round = 0;

/*------------------
hides the current modal
--------------------*/
function hideModal (event){
    var currentModal = event.target.closest('.modal-container')
    modalBackdrop.classList.toggle('hidden')
    currentModal.classList.toggle('hidden')
}



function updateTimer() {
    var toUpdate
    var seconds = currentTime % 60 //number of seconds to display
    var minutes = Math.floor(currentTime / 60) //number of minutes to display

    //logic to concat properly
    if (seconds < 10) {
        if (minutes < 10){
            toUpdate = "0" + minutes + ":0" + seconds
        } else {
            toUpdate = minutes + ":0" + seconds
        }
    } else {
        if (minutes < 10){
            toUpdate = "0" + minutes + ":" + seconds
        } else {
            toUpdate = minutes + ":" + seconds
        }
    }

    //update timer
    timer.innerHTML = toUpdate
}

function startTimer(){
    if(currentTime > 0) {
        currentTime--
        updateTimer()

    } else {
        clearInterval(interval)
        var stopButton = document.getElementById('stop-button')
        stopButton.classList.toggle('hidden')
        var startButton = document.getElementById('start-button')
        startButton.classList.toggle('hidden')

        var root = document.querySelector(':root')
        if(timerType){ //currently in a break
            timerType = 0
            root.style.setProperty('--primary-color', 'var(--focus-color)')
            currentTime = focusTime * 60
            updateTimer()
        } else if (timerType == 0) { //currently in a focus session
            round++
            if(round == 4){ //go into a long break
                timerType = 2
                root.style.setProperty('--primary-color', 'var(--long-color)')
                currentTime = longBreakTime * 60
                updateTimer()
            } else {        //go into a short break
                timerType = 1
                root.style.setProperty('--primary-color', 'var(--short-color)')
                currentTime = shortBreakTime * 60
                updateTimer()
            }
        }
    }

}

function handleStartButton(event){
    interval = setInterval(startTimer, 10)
    event.target.classList.toggle('hidden')
    var stopButton = document.getElementById('stop-button')
    stopButton.classList.toggle('hidden')
}

function handleStopButton(event){
    clearInterval(interval)
    event.target.classList.toggle('hidden')
    var startButton = document.getElementById('start-button')
    startButton.classList.toggle('hidden')
}

function handleFocusButton(event){

}

function handleLongBreakButton(event){
    var longConfirm = document.getElementById('skip-long-modal')
    longConfirm.classList.toggle('hidden')
    modalBackdrop.classList.toggle('hidden')
}

function handleShortBreakButton(event){

}

function handleYesSkipButton(event){
    hideModal(event)
}

/*------------------------------
 add event listeners to buttons
 -------------------------------*/
window.addEventListener('DOMContentLoaded', function () {
    //hide modal buttons
    var modalHideButtons = document.getElementsByClassName('modal-hide-button')
    for (var i = 0; i < modalHideButtons.length; i++) {
        modalHideButtons[i].addEventListener('click', hideModal)
    }

    // info button
    var infoButton = document.getElementById('info-button')
    if (infoButton) {
        infoButton.addEventListener('click', function () {
            const infoModal = document.getElementById('info-modal')

            modalBackdrop.classList.toggle('hidden')
            infoModal.classList.toggle('hidden')
        })
    }

    //start button
    var startButton = document.getElementById('start-button')
    if(startButton) {
        startButton.addEventListener('click', handleStartButton)
    }

    //stop button
    var stopButton = document.getElementById('stop-button')
    if(stopButton) {
        stopButton.addEventListener('click', handleStopButton)
    }

    //focus button
    var focusButton = document.getElementById('focus-button')
    if(focusButton) {
        focusButton.addEventListener('click', handleFocusButton)
    }

    //long break button
    var longBreakButton = document.getElementById('long-button')
    if(longBreakButton) {
        longBreakButton.addEventListener('click', handleLongBreakButton)
    }

    //short break button
    var shortBreakButton = document.getElementById('short-button')
    if(shortBreakButton) {
        shortBreakButton.addEventListener('click', handleShortBreakButton)
    } 

    var yesSkipButton = document.getElementById('yes-skip-button')
    if(yesSkipButton){
        yesSkipButton.addEventListener('click', handleYesSkipButton)
    }
})