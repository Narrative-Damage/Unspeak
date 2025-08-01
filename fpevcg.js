const ZW_0 = '\u200B';
const ZW_1 = '\u200C';

function encodeRaw() {
  const visibleText = document.getElementById('encodeInput').value;
  const hiddenMessage = document.getElementById('hiddenInput').value;

  const binary = hiddenMessage
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(16, '0'))
    .join('');

  const encoded = binary
    .split('')
    .map((bit) => (bit === '0' ? ZW_0 : ZW_1))
    .join('');

  const result = visibleText + encoded;

  const out = document.getElementById('encodeOutput');
  out.textContent = result;

  const isArabic = /^[\u0600-\u06FF]/.test(visibleText.trim());
  out.dir = isArabic ? 'rtl' : 'ltr';
  out.style.textAlign = isArabic ? 'right' : 'left';
}

function encodeCompressed() {
  const visibleText = document.getElementById('encodeInput').value;
  const hiddenMessage = document.getElementById('hiddenInput').value;

  const compressed = LZString.compressToEncodedURIComponent(hiddenMessage);

  const binary = compressed
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');

  const encoded = binary
    .split('')
    .map((bit) => (bit === '0' ? ZW_0 : ZW_1))
    .join('');

  const result = visibleText + encoded;

  const out = document.getElementById('encodeOutput');
  out.textContent = result;

  const isArabic = /^[\u0600-\u06FF]/.test(visibleText.trim());
  out.dir = isArabic ? 'rtl' : 'ltr';
  out.style.textAlign = isArabic ? 'right' : 'left';
}

function decodeRaw() {
  const encodedText = document.getElementById('decodeInput').value;

  const zwChars = Array.from(encodedText).filter(
    (ch) => ch === ZW_0 || ch === ZW_1
  );
  if (zwChars.length < 8) {
    displayDecoded('No hidden message found', 'ltr', 'left');
    return;
  }

  const binary = zwChars.map((ch) => (ch === ZW_0 ? '0' : '1')).join('');

  let try16 = '';
  for (let i = 0; i < binary.length; i += 16) {
    const chunk = binary.slice(i, i + 16);
    if (chunk.length === 16) {
      try16 += String.fromCharCode(parseInt(chunk, 2));
    }
  }

  const isArabic = /^[\u0600-\u06FF]/.test(try16.trim());
  if (isArabic) {
    displayDecoded(try16.trim(), 'rtl', 'right');
    return;
  }

  let try8 = '';
  for (let i = 0; i < binary.length; i += 8) {
    const chunk = binary.slice(i, i + 8);
    if (chunk.length === 8) {
      try8 += String.fromCharCode(parseInt(chunk, 2));
    }
  }

  displayDecoded(try8.trim() || 'No hidden message found', 'ltr', 'left');
}

function decodeCompressed() {
  const encodedText = document.getElementById('decodeInput').value;

  const zwChars = Array.from(encodedText).filter(
    (ch) => ch === ZW_0 || ch === ZW_1
  );

  if (zwChars.length < 8) {
    document.getElementById('decodeOutput').textContent =
      'No hidden message found';
    return;
  }

  const binary = zwChars.map((ch) => (ch === ZW_0 ? '0' : '1')).join('');

  let encodedCompressed = '';
  for (let i = 0; i < binary.length; i += 8) {
    const chunk = binary.slice(i, i + 8);
    if (chunk.length === 8) {
      encodedCompressed += String.fromCharCode(parseInt(chunk, 2));
    }
  }

  const decompressed =
    LZString.decompressFromEncodedURIComponent(encodedCompressed);

  const out = document.getElementById('decodeOutput');
  out.textContent = decompressed || 'Decompression failed or no message found';
  out.dir = /^[\u0600-\u06FF]/.test(decompressed || '') ? 'rtl' : 'ltr';
  out.style.textAlign = /^[\u0600-\u06FF]/.test(decompressed || '')
    ? 'right'
    : 'left';
}

function displayDecoded(text, dir, align) {
  const out = document.getElementById('decodeOutput');
  out.textContent = text;
  out.dir = dir;
  out.style.textAlign = align;
}

function copyToClipboardFromOutput(elementId) {
  const content = document.getElementById(elementId).textContent;
  navigator.clipboard.writeText(content).then(() => {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.opacity = '1';
    setTimeout(() => {
      tooltip.style.opacity = '0';
    }, 2000);
  });
}

function autoDetectDirection(textarea) {
  const value = textarea.value.trim();
  const isArabic = /^[\u0600-\u06FF]/.test(value);
  textarea.dir = isArabic ? 'rtl' : 'ltr';
}
