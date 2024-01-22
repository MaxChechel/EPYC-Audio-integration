const audioModal = document.querySelector('.audio-modal_component');
const audioPlayLink = audioModal.querySelector('.audio-modal_play-link');
const audioModalClose = audioModal.querySelector(
    '.glossary-modal_close-button'
);
const audioLinks = document.querySelectorAll('.text-rich-text a[data-audio]');

let lastFocusedAudioElement;
let sound = null;
let currentAudio = '';

function openAudioModal(triggerElement) {
    lastFocusedAudioElement = triggerElement;
    audioModal.classList.add('is-active');
    audioPlayLink.focus();

    // Close outside modal
    clickEventListener = (e) => closeModalOnClick(e, triggerElement); // Store the reference
    document
        .querySelector('.page-wrapper')
        .addEventListener('click', clickEventListener);
    // Add keydown listener for Escape key when modal is open
    document.addEventListener('keydown', handleModalKeydown);
}

function closeAudioModal() {
    audioModal.classList.remove('is-active');
    if (sound) {
        sound.stop();
        audioPlayLink.textContent = 'Play audio';
    }

    if (lastFocusedAudioElement) {
        lastFocusedAudioElement.focus(); // Set focus back to the element that opened the modal
    }

    // Remove keydown listener when modal is closed
    document.removeEventListener('keydown', handleModalKeydown);

    // Remove the click event listener using the stored reference
    if (clickEventListener) {
        document
            .querySelector('.page-wrapper')
            .removeEventListener('click', clickEventListener);
    }
}

function playback() {
    if (sound && !sound.playing()) {
        sound.play();
        audioPlayLink.textContent = 'Pause audio';
    } else if (sound && sound.playing()) {
        sound.pause();
        audioPlayLink.textContent = 'Play audio';
    }
}

// Accessibility
// Function to handle keydown on glossary links
function handleLinkKeydown(e) {
    if (e.key === 'Enter') {
        // Simulate a click event
        this.click();
    }
}

// Function to handle keydown for closing modal
function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        closeAudioModal();
    }
}

let clickEventListener; // Declare a variable to store the click event listener

function closeModalOnClick(e, triggerElement) {
    if (!audioModal.contains(e.target) && e.target !== triggerElement) {
        closeAudioModal();
    }
}
document.addEventListener('DOMContentLoaded', function () {
    if (audioModal) {
        audioLinks.forEach((link) => {
            link.addEventListener('click', () => {
                const audio = link.getAttribute('data-audio');

                if (currentAudio !== audio) {
                    if (sound) {
                        sound.unload(); // Unload the previous sound
                    }
                    sound = new Howl({ src: [audio] });
                    currentAudio = audio;
                }
                closeAudioModal();
                openAudioModal(link);
            });
            link.addEventListener('keydown', handleLinkKeydown);
        });

        audioPlayLink.addEventListener('click', playback);
        audioModalClose.addEventListener('click', closeAudioModal);
    }
});
