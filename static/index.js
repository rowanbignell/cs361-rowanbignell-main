const microA = "http://localhost:51336"
const microB = "http://localhost:3010"
const microC = "http://localhost:5013"
const modalBackdrop = document.getElementById('modal-backdrop')
var timer = document.getElementById('main-timer')
var focusTime = 25
var shortBreakTime = 5
var longBreakTime = 25
var timerType = 0           // 0 = focus, 1 = short break, 2 = long break
var currentTime = focusTime * 60;
var interval;
var round = 0;
var signedIn = "";
var sendWebhook = false;


/*------------------
hides the current modal
--------------------*/
function hideModal (event){
    var currentModal = event.target.closest('.modal-container')
    modalBackdrop.classList.toggle('hidden')
    currentModal.classList.toggle('hidden')
}

/*------------------
manage notifications
--------------------*/
function notifyFocus(){
    //webhook
    if(sendWebhook){
        var webhook = document.getElementById('settings-webhook-key').value
        var url = microC + "/focus"

        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                webhook: webhook
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}

function notifyLong(){
    //webhook
    if(sendWebhook){
        var webhook = document.getElementById('settings-webhook-key').value
        var url = microC + "/long"

        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                webhook: webhook
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}

function notifyShort(){
    //webhook
    if(sendWebhook){
        var webhook = document.getElementById('settings-webhook-key').value
        var url = microC + "/short"

        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                webhook: webhook
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}

function handleSignIn(username){
    //fetch settings
    var url = microB + "/" + username
    fetch(url, {
        method: "GET",
        headers: {  
        "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json()
    })
    .then(data => {
        //update site with data
        shortBreakTime = data.shortLength
        document.getElementById('settings-short-break-length').value = data.shortLength

        document.getElementById('settings-long-break-length').value = data.longLength
        longBreakTime = data.longLength

        document.getElementById('settings-webhook').checked = data.webhook
        sendWebhook = data.webhook
        if(sendWebhook){
            document.getElementById('settings-webhook-key').readOnly = false
        }
        document.getElementById('settings-webhook-key').value = data.webhookKey
    })

    //update site
    signedIn = username
    var signUpButton = document.getElementById('sign-up-button')
    var logOutButton = document.getElementById('sign-out-button')
    var signInButton = document.getElementById('sign-in-button')
    signUpButton.classList.toggle('hidden')
    logOutButton.classList.toggle('hidden')
    signInButton.classList.toggle('hidden')
}

function updateSettings(){
    //get settings
    var checked = document.getElementById('settings-webhook').checked
    var key = document.getElementById('settings-webhook-key').value


    //post
    var url = microB + "/" + signedIn
        fetch(url, {
            method: "PUT",
            body: JSON.stringify({
                shortLength: shortBreakTime,
                longLength: longBreakTime,
                webhook: checked,
                webhookKey: key
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(res){
            if(res.status === 200){

            } else {
                alert("Failure to save settings data.")
            }
        })
}

function createUserSettings(username){
    //get settings
    var checked = document.getElementById('settings-webhook').checked
    var key = document.getElementById('settings-webhook-key')


    //post
    var url = microB + "/" + username
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                shortLength: shortBreakTime,
                longLength: longBreakTime,
                webhook: checked,
                webhookKey: key
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(res){
            if(res.status === 200){

            } else {
                alert("Failure to save settings data.")
            }
        })
}

function updateRound(){
    var insertRound = document.getElementById('round-display')
    insertRound.innerHTML = "Round " + round + "/4"
}

function switchToFocus() {
    var root = document.querySelector(':root')
    timerType = 0 //set timer type
    root.style.setProperty('--primary-color', 'var(--focus-color)') //change color
    currentTime = focusTime * 60 //set current time and update
    updateTimer()

    //update buttons
    var focusButton = document.getElementById('focus-button')
    var longButton = document.getElementById('long-button')
    var shortButton = document.getElementById('short-button')
    focusButton.disabled = true
    longButton.disabled = false
    shortButton.disabled = false
}

function switchToShort() {
    var root = document.querySelector(':root')
    timerType = 1 //set timer type
    root.style.setProperty('--primary-color', 'var(--short-color)') //change color
    currentTime = shortBreakTime * 60 //set current time and update
    updateTimer()

    //update buttons
    var focusButton = document.getElementById('focus-button')
    var longButton = document.getElementById('long-button')
    var shortButton = document.getElementById('short-button')
    focusButton.disabled = false
    longButton.disabled = false
    shortButton.disabled = true
}

function switchToLong() {
    var root = document.querySelector(':root')
    timerType = 2 //set timer type
    root.style.setProperty('--primary-color', 'var(--long-color)') //change color
    currentTime = longBreakTime * 60 //set current time and update
    updateTimer()

    //update buttons
    var focusButton = document.getElementById('focus-button')
    var longButton = document.getElementById('long-button')
    var shortButton = document.getElementById('short-button')
    focusButton.disabled = false
    longButton.disabled = true
    shortButton.disabled = false
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
            if(timerType === 2){
                switchToFocus()
                notifyLong()
            } else {
                switchToFocus()
                notifyShort()
            }
        } else if (timerType == 0) { //currently in a focus session
            round++
            updateRound()
            if(round == 4){ //go into a long break
                switchToLong()
            } else {        //go into a short break
                switchToShort()
            }
            notifyFocus()
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


function handleLongBreakButton(event){
    var longConfirm = document.getElementById('skip-long-modal')
    longConfirm.classList.toggle('hidden')
    modalBackdrop.classList.toggle('hidden')
}


function handleYesSkipButton(event){
    hideModal(event)
    round = 0
    updateRound()
    switchToLong()
}

function handleSignInButton(event){
    var signInModal = document.getElementById('sign-in-modal')
    modalBackdrop.classList.toggle('hidden')
    signInModal.classList.toggle('hidden')
}

function handleSignUpButton(event){
    var signUpModal = document.getElementById('sign-up-modal')
    modalBackdrop.classList.toggle('hidden')
    signUpModal.classList.toggle('hidden')
}

function handleSignInSubmit(event){
    var username = document.getElementById('sign-in-username').value.trim()
    var password = document.getElementById('sign-in-password').value.trim()

    if (!username || !password){
        alert("You must fill in both fields.")
    } else {
        var url = microA + "/login"
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(res){
            if(res.status === 200){
                handleSignIn(username)
                hideModal(event)
                document.getElementById('sign-in-form').reset()
            } else {
                var errorMsg = "Failed to log in."
                alert(errorMsg)
            }
        })
    }
}

function handleSignUpSubmit(event){
    var username = document.getElementById('sign-up-username').value.trim()
    var password = document.getElementById('sign-up-password').value.trim()

    if (!username || !password){
        alert("You must fill in both fields.")
    } else {
        var url = microA + "/create"
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(res){
            if(res.status === 201){
                createUserSettings(username)
                handleSignIn(username)
                hideModal(event)
                document.getElementById('sign-in-form').reset()
            } else {
                var errorMsg = "Failed to create user."
                alert(errorMsg)
            }
        })
    }
}

function handleLogOutButton(event){
    if(confirm("Are you sure you want to log out, " + signedIn + "?")){
        signedIn = ""
        var signUpButton = document.getElementById('sign-up-button')
        var logOutButton = document.getElementById('sign-out-button')
        var signInButton = document.getElementById('sign-in-button')
        signUpButton.classList.toggle('hidden')
        logOutButton.classList.toggle('hidden')
        signInButton.classList.toggle('hidden')
    }
}

function handleSettingsButton(event){
    var settingsModal = document.getElementById('settings-modal')
    modalBackdrop.classList.toggle('hidden')
    settingsModal.classList.toggle('hidden')
}

/*------------------------------
 handle settings unfocusing
 -------------------------------*/
 function handleSettingShortBreak(){
    var value = document.getElementById('settings-short-break-length').value

    //update value with new value
    shortBreakTime = value

    //if logged in, send to server
    if(signedIn){
        updateSettings()
    }

 }

 function handleSettingLongBreak(){
    var value = document.getElementById('settings-long-break-length').value

    //update value with new value
    longBreakTime = value

    //if logged in, send to server
    if(signedIn){
        updateSettings()
    }
 }

 function handleSettingWebhookKey(){
    var value = document.getElementById('settings-webhook-key').value
    //update server
    if(signedIn){
        updateSettings()
    }
 }

 function handleSettingWebhook(){
    var checked = document.getElementById('settings-webhook').checked
    //toggle greyed out
    var key = document.getElementById('settings-webhook-key')
    if(checked){
        key.readOnly = false
        //update server
        sendWebhook = true

        if(signedIn){
            updateSettings()
        }
    } else {
        key.readOnly = true
        //update server
        sendWebhook = false

        if(signedIn){
            updateSettings()
        }
    }
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
        focusButton.addEventListener('click', switchToFocus)
    }

    //long break button
    var longBreakButton = document.getElementById('long-button')
    if(longBreakButton) {
        longBreakButton.addEventListener('click', handleLongBreakButton)
    }

    //short break button
    var shortBreakButton = document.getElementById('short-button')
    if(shortBreakButton) {
        shortBreakButton.addEventListener('click', switchToShort)
    } 

    var yesSkipButton = document.getElementById('yes-skip-button')
    if(yesSkipButton){
        yesSkipButton.addEventListener('click', handleYesSkipButton)
    }

    //sign in
    var signInButton = document.getElementById('sign-in-button')
    if(signInButton) {
        signInButton.addEventListener('click', handleSignInButton)
    }

    var signUpButton = document.getElementById('sign-up-button')
    if(signUpButton) {
        signUpButton.addEventListener('click', handleSignUpButton)
    }

    var logOutButton = document.getElementById('sign-out-button')
    if(logOutButton) {
        logOutButton.addEventListener('click', handleLogOutButton)
    }

    var signUpSubmit = document.getElementById('sign-up-submit')
    if(signUpSubmit) {
        signUpSubmit.addEventListener('click', handleSignUpSubmit)
    }

    var signInSubmit = document.getElementById('sign-in-submit')
    if(signInSubmit) {
        signInSubmit.addEventListener('click', handleSignInSubmit)
    }

    var settingsButton = document.getElementById('settings-button')
    if(settingsButton) {
        settingsButton.addEventListener('click', handleSettingsButton)
    }
})