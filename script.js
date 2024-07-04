const imageUrl = 'figura.jpg'; // URL de la imagen
const puzzlePiecesContainer = document.getElementById('puzzle-pieces-container');
const puzzleContainer = document.getElementById('puzzle-container');
const timerElement = document.getElementById('timer');

let pieces = Array.from({ length: 10 }, (_, i) => i);
let timer;
let seconds = 0;
let currentPiece = null;
let startX = 0;
let startY = 0;

// Función para iniciar el temporizador
function startTimer() {
    timer = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerElement.textContent = `Tiempo: ${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

// Función para detener el temporizador
function stopTimer() {
    clearInterval(timer);
}

// Función para mezclar las piezas
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Función para renderizar las piezas
function renderPieces() {
    puzzlePiecesContainer.innerHTML = '';
    for (let i = 0; i < pieces.length; i++) {
        const pieceIndex = pieces[i];
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        if (pieceIndex !== 8) {
            const x = (pieceIndex % 3) * 100;
            const y = Math.floor(pieceIndex / 3) * 100;
            piece.style.backgroundImage = `url(${imageUrl})`;
            piece.style.backgroundPosition = `-${x}px -${y}px`;
            piece.style.width = '60px';
            piece.style.height = '60px';
            piece.setAttribute('draggable', true);
            piece.addEventListener('dragstart', dragStart);
            piece.addEventListener('touchstart', touchStart, { passive: true });
            piece.addEventListener('touchmove', touchMove, { passive: false });
            piece.addEventListener('touchend', touchEnd, { passive: true });
        } else {
            piece.classList.add('empty');
        }
        piece.dataset.index = pieceIndex;
        puzzlePiecesContainer.appendChild(piece);
    }
}

// Función para renderizar la cuadrícula del rompecabezas
function renderGrid() {
    puzzleContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.classList.add('puzzle-piece');
            cell.classList.add('empty');
            cell.style.width = '100px';
            cell.style.height = '100px';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('dragover', dragOver);
            cell.addEventListener('drop', drop);
            puzzleContainer.appendChild(cell);
        }
    }
}

// Funciones de arrastrar y soltar
function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.index);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const index = event.dataTransfer.getData('text/plain');
    const piece = document.querySelector(`.puzzle-piece[data-index='${index}']`);
    if (event.target.classList.contains('empty')) {
        event.target.classList.remove('empty');
        event.target.style.backgroundImage = piece.style.backgroundImage;
        event.target.style.backgroundPosition = piece.style.backgroundPosition;
        event.target.dataset.index = index;
        piece.remove();
        checkCompletion();
    }
}

// Funciones táctiles
function touchStart(event) {
    currentPiece = event.target;
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    event.dataTransfer = { setData: () => {}, getData: () => currentPiece.dataset.index };
}

function touchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (targetElement && targetElement.classList.contains('empty')) {
        targetElement.classList.add('drag-over');
    }
}

function touchEnd(event) {
    const touch = event.changedTouches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (targetElement && targetElement.classList.contains('empty')) {
        drop({ target: targetElement, dataTransfer: event.dataTransfer, preventDefault: () => {} });
    }
    currentPiece = null;
}

// Función para verificar si el rompecabezas está completo
function checkCompletion() {
    const pieces = document.querySelectorAll('#puzzle-container .puzzle-piece');
    for (let i = 0; i < pieces.length; i++) {
        if (!pieces[i].classList.contains('empty') && pieces[i].dataset.index != i) {
            return;
        }
    }
    stopTimer();
    alert(`¡Felicitaciones! Has completado el rompecabezas en ${timerElement.textContent.split(': ')[1]}`);
}

// Inicializar el rompecabezas
shuffle(pieces);
renderPieces();
renderGrid();
startTimer();
