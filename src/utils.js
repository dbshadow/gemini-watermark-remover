import exifr from 'exifr';
import i18n from './i18n.js';

export function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function checkOriginal(file) {
    try {
        const exif = await exifr.parse(file, { xmp: true });
        return {
            is_google: exif?.Credit === 'Made with Google AI',
            is_original: ['ImageWidth', 'ImageHeight'].every(key => exif?.[key])
        }
    } catch {
        return { is_google: false, is_original: false };
    }
}

export function getOriginalStatus({ is_google, is_original }) {
    if (!is_google) return i18n.t('original.not_gemini');
    if (!is_original) return i18n.t('original.not_original');
    return '';
}

const statusMessage = document.getElementById('statusMessage');
export function setStatusMessage(message = '', type = '') {
    statusMessage.textContent = message;
    statusMessage.classList.remove('is-hidden');
    if (!message) {
        statusMessage.classList.add('is-hidden');
    }
    const colorMap = { warn: 'text-red-500', success: 'text-green-500' };
    statusMessage.classList.remove(...Object.values(colorMap));
    if (colorMap[type]) statusMessage.classList.add(colorMap[type]);
}

const loadingOverlay = document.getElementById('loadingOverlay');
export function showLoading(text = null) {
    loadingOverlay.classList.remove('is-hidden');
    const textEl = loadingOverlay.querySelector('p');
    if (textEl && text) textEl.textContent = text;
}

export function hideLoading() {
    loadingOverlay.classList.add('is-hidden');
}