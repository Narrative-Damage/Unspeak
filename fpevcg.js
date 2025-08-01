const ZW_0 = '\u200B';
const ZW_1 = '\u200C';

function encode() {
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

function decode() {
  const encodedText = document.getElementById('decodeInput').value;

  const zwChars = Array.from(encodedText).filter(
    (ch) => ch === ZW_0 || ch === ZW_1
  );
  if (zwChars.length < 8) {
    document.getElementById('decodeOutput').textContent =
      'No hidden message found';
    document.getElementById('decodeOutput').dir = 'ltr';
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

  const isMostlyArabic = /^[\u0600-\u06FF]/.test(try16);
  if (isMostlyArabic && try16.trim() !== '') {
    const out = document.getElementById('decodeOutput');
    out.textContent = try16;
    out.dir = 'rtl';
    out.style.textAlign = 'right';
    return;
  }

  let try8 = '';
  for (let i = 0; i < binary.length; i += 8) {
    const chunk = binary.slice(i, i + 8);
    if (chunk.length === 8) {
      try8 += String.fromCharCode(parseInt(chunk, 2));
    }
  }

  const out = document.getElementById('decodeOutput');
  out.textContent = try8.trim() || 'No hidden message found';
  out.dir = 'ltr';
  out.style.textAlign = 'left';
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
