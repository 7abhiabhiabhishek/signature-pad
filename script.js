const canvas = document.getElementById('signaturePad');
const ctx = canvas.getContext('2d');
const textColorInput = document.getElementById('textColor');
const bgColorInput = document.getElementById('bgColor');
const fontSizeInput = document.getElementById('fontSize');
const clearButton = document.getElementById('clear');
const saveButton = document.getElementById('save');
const retrieveButton = document.getElementById('retrieve');

let drawing = false;
let isResized = false;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

clearButton.addEventListener('click', clearCanvas);
saveButton.addEventListener('click', saveCanvas);
retrieveButton.addEventListener('click', retrieveCanvas);

textColorInput.addEventListener('input', () => {
    ctx.strokeStyle = textColorInput.value;
});

bgColorInput.addEventListener('input', () => {
    canvas.style.backgroundColor = bgColorInput.value;
});

fontSizeInput.addEventListener('input', () => {
    ctx.lineWidth = parseInt(fontSizeInput.value, 10);
});

function startDrawing(e) {
    drawing = true;
    draw(e);
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;

    ctx.lineWidth = parseInt(fontSizeInput.value, 10);
    ctx.lineCap = 'round';
    ctx.strokeStyle = textColorInput.value;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
}

function saveCanvas() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'signature.png';
    link.click();
}

function retrieveCanvas() {
    const savedSignature = localStorage.getItem('savedSignature');
    if (savedSignature) {
        const img = new Image();
        img.src = savedSignature;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
    }
}

canvas.addEventListener('mouseup', () => {
    localStorage.setItem('savedSignature', canvas.toDataURL('image/png'));
});

function resizeCanvas() {
    const dataURL = canvas.toDataURL();
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();