import scribe from 'scribe.js-ocr';
// Pre-load OCR and font data to avoid delay when user uploads a file.
await scribe.init({ ocr: true, font: true });

const uploaderElem = /** @type {HTMLInputElement} */ (document.getElementById('uploader'));
const outputElem = /** @type {HTMLDivElement} */ (document.getElementById('output'));
uploaderElem.addEventListener('change', async () => {
  if (!uploaderElem.files) return;
  const text = await scribe.extractText(uploaderElem.files);
  outputElem.textContent = text;
});
