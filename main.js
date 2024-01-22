const audioModal = document.querySelector('.audio-modal_component');
const audioPlayLink = audioModal.querySelector('.audio-modal_play-link');
const audioModalClose = audioModal.querySelector(
    '.glossary-modal_close-button'
);
const audioLinks = document.querySelectorAll('.text-rich-text a[data-audio]');

let lastFocusedAudioElement;
let clickAudioEventListener; // Declare a variable to store the click event listener
let sound = null;
let currentAudio = '';

function openAudioModal(triggerElement) {
    lastFocusedAudioElement = triggerElement;
    audioModal.classList.add('is-active');
    audioPlayLink.focus();

    // Close outside modal
    clickAudioEventListener = (e) => closeModalOnClick(e, triggerElement); // Store the reference
    document
        .querySelector('.page-wrapper')
        .addEventListener('click', clickAudioEventListener);
    // Add keydown listener for Escape key when modal is open
    document.addEventListener('keydown', handleAudioModalKeydown);
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
    document.removeEventListener('keydown', handleAudioModalKeydown);

    // Remove the click event listener using the stored reference
    if (clickAudioEventListener) {
        document
            .querySelector('.page-wrapper')
            .removeEventListener('click', clickAudioEventListener);
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
function handleAudioLinkKeydown(e) {
    if (e.key === 'Enter') {
        // Simulate a click event
        this.click();
    }
}

// Function to handle keydown for closing modal
function handleAudioModalKeydown(e) {
    if (e.key === 'Escape') {
        closeAudioModal();
    }
}

function closeModalOnClick(e, triggerElement) {
    if (!audioModal.contains(e.target) && e.target !== triggerElement) {
        closeAudioModal();
    }
}
document.addEventListener('DOMContentLoaded', function () {
    if (audioModal) {
        audioLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
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
            link.addEventListener('keydown', handleAudioLinkKeydown);
        });

        audioPlayLink.addEventListener('click', playback);
        audioPlayLink.addEventListener('touchstart', playback);
        audioModalClose.addEventListener('click', closeAudioModal);
    }
});
