const modalBackdrop = document.getElementById('modal-backdrop')


/*------------------
hides the current modal
--------------------*/
function hideModal (event){
    currentModal = event.target.closest('.modal-container')
    modalBackdrop.classList.add('hidden')
    currentmodal.classList.add('hidden')
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

    //
    var infoButton = document.getElementById('info-button')
    if (infoButton) {
        infoButton.addEventListener('click', function () {
            const infoModal = document.getElementById('info-modal')

            infoModal.classList.remove('hidden')
            modalBackdrop.classList.remove('hidden')
        })
    }
})