/* =========================================
   TOOL SWITCHING
========================================= */
function showTool(id) {
  document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-pill').forEach(p => p.classList.remove('active'));
  document.getElementById('tool-' + id).classList.add('active');
  const pills = document.querySelectorAll('.nav-pill');
  const ids = ['gst','emi','image','qr','converter','bill','age','word','palette'];
  pills[ids.indexOf(id)].classList.add('active');
}

/* =========================================
   GST CALCULATOR
========================================= */
document.getElementById('gst-rate').addEventListener('change', function(){
  document.getElementById('gst-custom-wrapper').style.display = this.value === 'custom' ? 'flex' : 'none';
});

function calcGST() {
  const amount = parseFloat(document.getElementById('gst-amount').value);
  const rateEl = document.getElementById('gst-rate');
  const rate = rateEl.value === 'custom'
    ? parseFloat(document.getElementById('gst-custom').value)
    : parseFloat(rateEl.value);
  const type = document.getElementById('gst-type').value;

  if (isNaN(amount) || amount <= 0 || isNaN(rate) || rate < 0) {
    return showError('gst-result', 'Please enter valid amount and rate.');
  }

  let gstAmount, preGST, totalAmount;

  if (type === 'exclusive') {
    preGST = amount;
    gstAmount = (amount * rate) / 100;
    totalAmount = amount + gstAmount;
  } else {
    totalAmount = amount;
    preGST = (amount * 100) / (100 + rate);
    gstAmount = totalAmount - preGST;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  const el = document.getElementById('gst-result');
  el.classList.remove('hidden');
  el.innerHTML = `
    <div class="result-row"><span class="result-label">Pre-GST Amount</span><span class="result-value">₹${preGST.toFixed(2)}</span></div>
    <div class="result-row"><span class="result-label">GST Rate</span><span class="result-value">${rate}%</span></div>
    <div class="result-row"><span class="result-label">CGST (${rate/2}%)</span><span class="result-value">₹${cgst.toFixed(2)}</span></div>
    <div class="result-row"><span class="result-label">SGST (${rate/2}%)</span><span class="result-value">₹${sgst.toFixed(2)}</span></div>
    <div class="result-row"><span class="result-label">Total GST</span><span class="result-value">₹${gstAmount.toFixed(2)}</span></div>
    <div class="result-row"><span class="result-label">Total Amount (incl. GST)</span><span class="result-highlight">₹${totalAmount.toFixed(2)}</span></div>
  `;
}

/* =========================================
   EMI CALCULATOR
========================================= */
function calcEMI() {
  const P = parseFloat(document.getElementById('emi-principal').value);
  const annualRate = parseFloat(document.getElementById('emi-rate').value);
  const N = parseInt(document.getElementById('emi-months').value);

  if (isNaN(P) || P <= 0 || isNaN(annualRate) || annualRate < 0 || isNaN(N) || N <= 0) {
    return showError('emi-result', 'Please fill all fields with valid values.');
  }

  const r = annualRate / 12 / 100;
  let emi;

  if (r === 0) {
    emi = P / N;
  } else {
    emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
  }

  const totalPayment = emi * N;
  const totalInterest = totalPayment - P;

  const el = document.getElementById('emi-result');
  el.classList.remove('hidden');
  el.innerHTML = `
    <div class="result-row"><span class="result-label">Monthly EMI</span><span class="result-highlight">₹${emi.toFixed(2)}</span></div>
    <div class="result-row"><span class="result-label">Principal Amount</span><span class="result-value">₹${P.toLocaleString('en-IN', {minimumFractionDigits:2})}</span></div>
    <div class="result-row"><span class="result-label">Total Interest Payable</span><span class="result-value">₹${totalInterest.toFixed(2)}</span></div>
    <div class="result-row"><span class="result-label">Total Payment</span><span class="result-value">₹${totalPayment.toFixed(2)}</span></div>
    <div class="result-row"><span class="result-label">Loan Tenure</span><span class="result-value">${N} months (${(N/12).toFixed(1)} years)</span></div>
  `;
}

/* =========================================
   IMAGE COMPRESSOR
========================================= */
let originalFile = null;
let compressedDataUrl = null;

const dropZone = document.getElementById('img-drop');
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.style.borderColor = 'var(--accent)'; });
dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = ''; });
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.style.borderColor = '';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) processImageFile(file);
});

function loadImage(event) {
  const file = event.target.files[0];
  if (file) processImageFile(file);
}

function processImageFile(file) {
  originalFile = file;
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('img-original').src = e.target.result;
    document.getElementById('img-orig-size').textContent = 'Size: ' + formatBytes(file.size);
    document.getElementById('img-result').classList.remove('hidden');
    document.getElementById('img-compressed').src = '';
    document.getElementById('img-comp-size').textContent = '';
    compressedDataUrl = null;
    dropZone.querySelector('p').textContent = '✅ ' + file.name;
  };
  reader.readAsDataURL(file);
}

function compressImage() {
  if (!originalFile) return showError('img-result', 'Please select an image first.');
  const quality = parseInt(document.getElementById('img-quality').value) / 100;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const mimeType = originalFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
      compressedDataUrl = canvas.toDataURL(mimeType, quality);
      const compressedSize = Math.round((compressedDataUrl.length * 3) / 4);
      const savings = (((originalFile.size - compressedSize) / originalFile.size) * 100).toFixed(1);
      document.getElementById('img-compressed').src = compressedDataUrl;
      document.getElementById('img-comp-size').textContent =
        `Size: ~${formatBytes(compressedSize)} (${savings}% saved)`;
      document.getElementById('img-result').classList.remove('hidden');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(originalFile);
}

function downloadImage() {
  if (!compressedDataUrl) return;
  const a = document.createElement('a');
  a.href = compressedDataUrl;
  a.download = 'compressed_' + (originalFile ? originalFile.name : 'image.jpg');
  a.click();
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(2) + ' MB';
}

/* =========================================
   QR CODE GENERATOR
========================================= */
let qrInstance = null;

function generateQR() {
  const text = document.getElementById('qr-input').value.trim();
  if (!text) return showError('qr-result', 'Please enter text or URL.');
  const fg = document.getElementById('qr-fg').value;
  const bg = document.getElementById('qr-bg').value;
  const size = parseInt(document.getElementById('qr-size').value);

  const container = document.getElementById('qr-container');
  container.innerHTML = '';

  try {
    qrInstance = new QRCode(container, {
      text, width: size, height: size,
      colorDark: fg, colorLight: bg,
      correctLevel: QRCode.CorrectLevel.H
    });
    document.getElementById('qr-result').classList.remove('hidden');
  } catch(e) {
    showError('qr-result', 'Failed to generate QR code.');
  }
}

function downloadQR() {
  const canvas = document.querySelector('#qr-container canvas');
  if (!canvas) { const img = document.querySelector('#qr-container img'); if(img){const a=document.createElement('a');a.href=img.src;a.download='qrcode.png';a.click();return;} return; }
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'qrcode.png';
  a.click();
}

/* =========================================
   UNIT / CURRENCY CONVERTER
========================================= */
const units = {
  length: { meter:1, kilometer:0.001, centimeter:100, millimeter:1000, inch:39.3701, foot:3.28084, yard:1.09361, mile:0.000621371 },
  weight: { kilogram:1, gram:1000, milligram:1000000, pound:2.20462, ounce:35.274, ton:0.001 },
  temperature: { celsius:'special', fahrenheit:'special', kelvin:'special' },
  area: { 'sq meter':1, 'sq kilometer':0.000001, 'sq centimeter':10000, 'sq foot':10.7639, 'sq inch':1550, acre:0.000247105, hectare:0.0001 },
  volume: { liter:1, milliliter:1000, 'cubic meter':0.001, gallon:0.264172, quart:1.05669, pint:2.11338 },
  speed: { 'm/s':1, 'km/h':3.6, 'mph':2.23694, knot:1.94384 },
  currency: { INR:1, USD:0.012, EUR:0.011, GBP:0.0094, JPY:1.78, AED:0.044, SGD:0.016, CAD:0.016, AUD:0.018 }
};

function updateUnits() {
  const cat = document.getElementById('conv-category').value;
  const keys = Object.keys(units[cat]);
  const fromEl = document.getElementById('conv-from');
  const toEl = document.getElementById('conv-to');
  fromEl.innerHTML = keys.map(k => `<option value="${k}">${k}</option>`).join('');
  toEl.innerHTML = keys.map(k => `<option value="${k}">${k}</option>`).join('');
  if (keys.length > 1) toEl.selectedIndex = 1;
  document.getElementById('conv-result').classList.add('hidden');
}

function convert() {
  const cat = document.getElementById('conv-category').value;
  const from = document.getElementById('conv-from').value;
  const to = document.getElementById('conv-to').value;
  const val = parseFloat(document.getElementById('conv-value').value);

  if (isNaN(val)) return showError('conv-result', 'Please enter a valid value.');

  let result;

  if (cat === 'temperature') {
    result = convertTemp(val, from, to);
  } else {
    const inBase = val / units[cat][from];
    result = inBase * units[cat][to];
  }

  const el = document.getElementById('conv-result');
  el.classList.remove('hidden');
  el.innerHTML = `
    <div class="result-row"><span class="result-label">${val} ${from}</span><span class="result-highlight">${result.toFixed(6).replace(/\.?0+$/, '')} ${to}</span></div>
  `;
}

function convertTemp(val, from, to) {
  let celsius;
  if (from === 'celsius') celsius = val;
  else if (from === 'fahrenheit') celsius = (val - 32) * 5/9;
  else celsius = val - 273.15;

  if (to === 'celsius') return celsius;
  if (to === 'fahrenheit') return celsius * 9/5 + 32;
  return celsius + 273.15;
}

updateUnits();

/* =========================================
   BILL SPLITTER
========================================= */
function calcBill() {
  const total = parseFloat(document.getElementById('bill-total').value);
  const people = parseInt(document.getElementById('bill-people').value);
  const tip = parseFloat(document.getElementById('bill-tip').value) || 0;
  const discount = parseFloat(document.getElementById('bill-discount').value) || 0;

  if (isNaN(total) || total <= 0 || isNaN(people) || people < 1) {
    return showError('bill-result', 'Please enter valid bill amount and number of people.');
  }

  const discountAmt = total * discount / 100;
  const afterDiscount = total - discountAmt;
  const tipAmt = afterDiscount * tip / 100;
  const grandTotal = afterDiscount + tipAmt;
  const perPerson = grandTotal / people;

  const el = document.getElementById('bill-result');
  el.classList.remove('hidden');
  el.innerHTML = `
    <div class="result-row"><span class="result-label">Original Bill</span><span class="result-value">₹${total.toFixed(2)}</span></div>
    <div class="result-row"><span class="result-label">Discount (${discount}%)</span><span class="result-value">-₹${discountAmt.toFixed(2)}</span></div>
    <div class="result-row"><span class="result-label">Tip (${tip}%)</span><span class="result-value">+₹${tipAmt.toFixed(2)}</span></div>
    <div class="result-row"><span class="result-label">Grand Total</span><span class="result-value">₹${grandTotal.toFixed(2)}</span></div>
    <div class="result-row"><span class="result-label">People</span><span class="result-value">${people}</span></div>
    <div class="result-row"><span class="result-label">Each Person Pays</span><span class="result-highlight">₹${perPerson.toFixed(2)}</span></div>
  `;
}

/* =========================================
   AGE CALCULATOR
========================================= */
document.getElementById('age-today').valueAsDate = new Date();

function calcAge() {
  const dob = new Date(document.getElementById('age-dob').value);
  const today = new Date(document.getElementById('age-today').value);

  if (!document.getElementById('age-dob').value) return showError('age-result', 'Please enter your date of birth.');

  if (dob > today) return showError('age-result', 'Date of birth cannot be in the future.');

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) { months--; const prev = new Date(today.getFullYear(), today.getMonth(), 0); days += prev.getDate(); }
  if (months < 0) { years--; months += 12; }

  const totalDays = Math.floor((today - dob) / (1000*60*60*24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;
  const nextBDay = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBDay <= today) nextBDay.setFullYear(today.getFullYear() + 1);
  const daysToNextBDay = Math.ceil((nextBDay - today) / (1000*60*60*24));

  const el = document.getElementById('age-result');
  el.classList.remove('hidden');
  el.innerHTML = `
    <div class="result-row"><span class="result-label">Age</span><span class="result-highlight">${years} yrs, ${months} mo, ${days} days</span></div>
    <div class="result-row"><span class="result-label">Total Days Lived</span><span class="result-value">${totalDays.toLocaleString()}</span></div>
    <div class="result-row"><span class="result-label">Total Weeks</span><span class="result-value">${totalWeeks.toLocaleString()}</span></div>
    <div class="result-row"><span class="result-label">Total Months</span><span class="result-value">${totalMonths}</span></div>
    <div class="result-row"><span class="result-label">Total Hours</span><span class="result-value">${totalHours.toLocaleString()}</span></div>
    <div class="result-row"><span class="result-label">Next Birthday In</span><span class="result-value">${daysToNextBDay} days</span></div>
  `;
}

/* =========================================
   WORD & CHARACTER COUNTER
========================================= */
function countWords() {
  const text = document.getElementById('word-input').value;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g,'').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paras = text.split(/\n+/).filter(p => p.trim().length > 0).length;
  const readTime = Math.ceil(words / 200);

  document.getElementById('wc-words').textContent = words;
  document.getElementById('wc-chars').textContent = chars;
  document.getElementById('wc-chars-no').textContent = charsNoSpaces;
  document.getElementById('wc-sentences').textContent = sentences;
  document.getElementById('wc-paras').textContent = paras || 0;
  document.getElementById('wc-read').textContent = readTime + ' min';
}

/* =========================================
   COLOR PALETTE GENERATOR
========================================= */
function hexToHSL(hex) {
  let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max+min)/2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){ case r: h=(g-b)/d+(g<b?6:0); break; case g: h=(b-r)/d+2; break; case b: h=(r-g)/d+4; break; }
    h /= 6;
  }
  return [h*360, s*100, l*100];
}

function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p,q,t) => { if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p; };
    const q = l < 0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
    r = hue2rgb(p,q,h+1/3); g = hue2rgb(p,q,h); b = hue2rgb(p,q,h-1/3);
  }
  return '#' + [r,g,b].map(x => Math.round(x*255).toString(16).padStart(2,'0')).join('');
}

function generatePalette() {
  const base = document.getElementById('palette-base').value;
  const type = document.getElementById('palette-type').value;
  const [h, s, l] = hexToHSL(base);
  let colors = [];

  if (type === 'analogous') {
    colors = [-30,-15,0,15,30].map(d => hslToHex((h+d+360)%360, s, l));
  } else if (type === 'complementary') {
    colors = [0,30,-30,180,210].map(d => hslToHex((h+d+360)%360, s, l));
  } else if (type === 'triadic') {
    colors = [0,120,240,-30,150].map(d => hslToHex((h+d+360)%360, s, l));
  } else if (type === 'tetradic') {
    colors = [0,90,180,270,45].map(d => hslToHex((h+d+360)%360, s, l));
  } else if (type === 'shades') {
    colors = [20,35,50,l,65,75,85].slice(0,5).map(li => hslToHex(h, s, li));
    colors = [hslToHex(h,s,20),hslToHex(h,s,35),hslToHex(h,s,50),hslToHex(h,s,65),hslToHex(h,s,80)];
  }

  const container = document.getElementById('palette-swatches');
  container.innerHTML = colors.map(c => `
    <div class="swatch" style="background:${c}" onclick="copyHex('${c}')">
      <span class="swatch-hex">${c}</span>
    </div>
  `).join('');

  document.getElementById('palette-result').classList.remove('hidden');
}

function copyHex(hex) {
  navigator.clipboard.writeText(hex).catch(() => {});
  const toast = document.createElement('div');
  toast.className = 'copy-toast';
  toast.textContent = `Copied ${hex}!`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

/* =========================================
   UTILITY
========================================= */
function showError(id, msg) {
  const el = document.getElementById(id);
  el.classList.remove('hidden');
  el.innerHTML = `<p style="color:#f87171;font-weight:600;">⚠ ${msg}</p>`;
}
