
let playerScore = 0;
// let highestScore = localStorage.getItem('highestScore') || 0;

// Get the highest score element by ID
const highestScoreElement = document.getElementById('highest-score-value');

// Initialize highest score from local storage, default to 0 if it doesn't exist
let highestScore = parseInt(localStorage.getItem('highestScore')) || 0;


// Set the text content of the highest score element
highestScoreElement.textContent = highestScore;


// Function to shuffle an array (used for shuffling numbers)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function navigateToInfoPage() {
    window.location.href = "master-head.html";
}


// Function to show the modal dialog
function openModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
}

// Function to close the modal dialog
function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

// Event listener to open the modal when the game starts
document.addEventListener('DOMContentLoaded', openModal);

// Event listener to close the modal when the close button is clicked
document.getElementById('closeModal').addEventListener('click', closeModal);

// Event listener to save the player's name and close the modal
document.getElementById('saveNameButton').addEventListener('click', function () {
    const playerNameInput = document.getElementById('playerNameInput');
    const playerName = playerNameInput.value.trim();
    if (playerName !== "") {
        document.getElementById('player-name').textContent = `Hello! ${playerName}`;
        closeModal(); // Close the modal
    } else {
        alert("Please enter a valid name.");
    }
});

// Function to create and initialize a new game
function startNewGame() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = ''; // Clear the grid

    const gridSize = 4;
    const numbers = Array.from({ length: gridSize * gridSize - 1 }, (_, i) => i + 1);
    shuffleArray(numbers);

    // Add an empty cell
    numbers.push('');
    shuffleArray(numbers);

    for (let i = 0; i < gridSize * gridSize; i++) {
        const gridCell = document.createElement('div');
        gridCell.className = 'grid-cell';
        gridCell.textContent = numbers[i];
        gridContainer.appendChild(gridCell);

        // Add a click event listener to handle cell moves
        gridCell.addEventListener('click', function () {
            moveCell(this, gridSize);
        });
    }

    // Reset move count
    document.getElementById('move-count').textContent = '0';
    // Reset hint count
    hintCount = 3;
    updateHintDisplay();
}

// Get the audio element
const moveSound = document.getElementById('move-sound');

// Set the volume (adjust as needed)
moveSound.volume = 1; // Set the volume to 50%


// Function to handle cell moves
function moveCell(cell, gridSize) {
    const cells = Array.from(document.querySelectorAll('.grid-cell'));
    const emptyCell = cells.find((c) => c.textContent === '');

    const cellIndex = cells.indexOf(cell);
    const emptyCellIndex = cells.indexOf(emptyCell);

    const cellRow = Math.floor(cellIndex / gridSize);
    const cellCol = cellIndex % gridSize;
    const emptyCellRow = Math.floor(emptyCellIndex / gridSize);
    const emptyCellCol = emptyCellIndex % gridSize;

    const rowDiff = Math.abs(cellRow - emptyCellRow);
    const colDiff = Math.abs(cellCol - emptyCellCol);

    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        // Valid move (up, down, left, or right)
        // Swap the cells
        const temp = cell.textContent;
        cell.textContent = emptyCell.textContent;
        emptyCell.textContent = temp;

        // Update move count
        const moveCount = parseInt(document.getElementById('move-count').textContent) + 1;
        document.getElementById('move-count').textContent = moveCount;

        // Play the sound when a number is moved
        moveSound.play();

        // Check for win condition
        if (checkWinCondition(gridSize)) {
            // Implement win condition logic here (e.g., display a message)
            alert('Congratulations! You have won the game!');
        }
    }
}

// Function to check the win condition
function checkWinCondition(gridSize) {
    const cells = Array.from(document.querySelectorAll('.grid-cell'));
    for (let i = 0; i < cells.length - 1; i++) {
        if (cells[i].textContent !== '' && parseInt(cells[i].textContent) !== i + 1) {
            return false;
        }
    }
    return true;
}

let hintCount = 3; // Number of available hints

// Function to update the hint count display
function updateHintDisplay() {
    document.getElementById('hint-count').textContent = hintCount;
}

// Event listener for the restart button
const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', function () {
    startNewGame();
});


// Event listener for the hint button
const hintButton = document.getElementById('hint-button');
hintButton.addEventListener('click', function () {
    if (hintCount > 0) {
        const cells = Array.from(document.querySelectorAll('.grid-cell'));
        const emptyCell = cells.find((c) => c.textContent === '');

        // Find a movable cell adjacent to the empty cell
        const movableCell = cells.find((cell) => {
            const cellIndex = cells.indexOf(cell);
            const emptyCellIndex = cells.indexOf(emptyCell);

            const cellRow = Math.floor(cellIndex / 4);
            const cellCol = cellIndex % 4;
            const emptyCellRow = Math.floor(emptyCellIndex / 4);
            const emptyCellCol = emptyCellIndex % 4;

            const rowDiff = Math.abs(cellRow - emptyCellRow);
            const colDiff = Math.abs(cellCol - emptyCellCol);

            return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
        });

        if (movableCell) {
            // Highlight the movable cell as a hint (you can add custom styling)
            movableCell.style.backgroundColor = 'yellow';
            setTimeout(() => {
                // Remove the highlighting after a short delay
                movableCell.style.backgroundColor = '';
            }, 1000); // 1 second

            // Decrement the hint count
            hintCount--;
            updateHintDisplay();
        }
    }
});

// Initialize the game with a default 4x4 grid
startNewGame();


// Function to update score
function updateScore(timeTakenInSeconds) {
    if (timeTakenInSeconds <= 120) {
        playerScore += 10; // Finish in 2 minutes or less: Earn 10 points
    } else if (timeTakenInSeconds <= 240) {
        playerScore += 5; // Finish in 4 minutes or less: Earn 5 points
    } else {
        playerScore += 2; // Finish in more than 4 minutes: Earn 2 points
    }

    // Update the displayed score
    document.getElementById('player-score').textContent = `Score: ${playerScore}`;

    // Update the highest score if the current score is higher
    if (playerScore > highestScore) {
        highestScore = playerScore;
        localStorage.setItem('highestScore', highestScore);
        document.getElementById('highest-score').textContent = `Highest Score: ${highestScore}`;
    }
}


// Function to initialize the score
function initializeScores() {
    // Initialize player's score
    playerScore = 0;
    document.getElementById('player-score').textContent = `Score: ${playerScore}`;

    // Retrieve and display the highest score from local storage
    document.getElementById('highest-score').textContent = `Highest Score: ${highestScore}`;
}



