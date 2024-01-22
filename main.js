const audioModal = document.querySelector('.audio-modal_component');
const audioPlayLink = audioModal.querySelector('.audio-modal_play-link');
const audioModalClose = audioModal.querySelector(
    '.glossary-modal_close-button'
);
const audioLinks = document.querySelectorAll('.text-rich-text a[data-audio]');

let audioElement = null;
let lastFocusedAudioElement;

let clickOutsideEventListener; // Declare a variable to store the click outside event listener

function openAudioModal(triggerElement) {
    lastFocusedAudioElement = triggerElement;
    audioModal.classList.add('is-active');
    audioPlayLink.focus();
    document.addEventListener('keydown', handleAudioModalKeydown);

    // Close modal when clicking outside
    clickOutsideEventListener = (e) => {
        if (!audioModal.contains(e.target) && e.target !== triggerElement) {
            closeAudioModal();
        }
    };
    document.addEventListener('click', clickOutsideEventListener);
}

function closeAudioModal() {
    audioModal.classList.remove('is-active');
    if (audioElement) {
        audioElement.pause();
        audioPlayLink.textContent = 'Play audio';
    }
    if (lastFocusedAudioElement) {
        lastFocusedAudioElement.focus();
    }
    document.removeEventListener('keydown', handleAudioModalKeydown);
    document.removeEventListener('click', clickOutsideEventListener); // Remove the click outside listener
}

function playback() {
    if (!audioElement.paused) {
        audioElement.pause();
        audioPlayLink.textContent = 'Play audio';
    } else {
        audioElement.play();
        audioPlayLink.textContent = 'Pause audio';
    }
}

function handleAudioLinkKeydown(event) {
    if (event.key === 'Enter') {
        this.click();
    }
}

function handleAudioModalKeydown(event) {
    if (event.key === 'Escape') {
        closeAudioModal();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (audioModal) {
        audioLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const audioSrc = link.getAttribute('data-audio');

                if (!audioElement || audioElement.src !== audioSrc) {
                    if (audioElement) {
                        audioElement.pause();
                    }
                    audioElement = new Audio(audioSrc);
                }
                closeAudioModal();
                openAudioModal(link);
            });
            link.addEventListener('keydown', handleAudioLinkKeydown);
        });

        audioPlayLink.addEventListener('click', playback);
        audioModalClose.addEventListener('click', closeAudioModal);
    }
});
