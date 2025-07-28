const ZW_0 = '\u200B';
const ZW_1 = '\u200C';

function encode() {
  const visibleText = document.getElementById('encodeInput').value;
  const hiddenMessage = document.getElementById('hiddenInput').value;

  const binary = hiddenMessage
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');

  const encoded = binary
    .split('')
    .map((bit) => (bit === '0' ? ZW_0 : ZW_1))
    .join('');

  const result = visibleText + encoded;
  document.getElementById('encodeOutput').textContent = result;
}

function decode() {
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
  let hiddenMessage = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    if (byte.length === 8) {
      hiddenMessage += String.fromCharCode(parseInt(byte, 2));
    }
  }

  document.getElementById('decodeOutput').textContent =
    hiddenMessage || 'No hidden message found';
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
