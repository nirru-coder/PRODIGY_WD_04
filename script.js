document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const status = document.getElementById("status");
  const resetButton = document.getElementById("reset");
  const switchModeButton = document.getElementById("switch-mode");

  let currentPlayer = "X";
  let gameActive = true;
  let vsAI = false; // Default mode: Player vs Player
  const gameState = Array(9).fill("");

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function checkWinner() {
    for (const condition of winningConditions) {
      const [a, b, c] = condition;
      if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
        status.textContent = `Player ${gameState[a]} Wins!`;
        gameActive = false;
        return;
      }
    }

    if (!gameState.includes("")) {
      status.textContent = "It's a Tie!";
      gameActive = false;
    }
  }

  function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = cell.getAttribute("data-index");

    if (gameState[cellIndex] || !gameActive) return;

    gameState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add("taken");

    checkWinner();

    if (gameActive) {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      if (vsAI && currentPlayer === "O") aiMove();
      else status.textContent = `Player ${currentPlayer}'s Turn`;
    }
  }

  function aiMove() {
    status.textContent = "AI is thinking...";
    setTimeout(() => {
      const emptyCells = gameState
        .map((cell, index) => (cell === "" ? index : null))
        .filter((index) => index !== null);

      const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      gameState[randomIndex] = "O";

      const cell = board.children[randomIndex];
      cell.textContent = "O";
      cell.classList.add("taken");

      checkWinner();

      if (gameActive) {
        currentPlayer = "X";
        status.textContent = "Player X's Turn";
      }
    }, 1000);
  }

  function restartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState.fill("");
    status.textContent = `Player X's Turn`;

    Array.from(board.children).forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("taken");
    });
  }

  function createBoard() {
    board.innerHTML = "";
    gameState.forEach((_, index) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("data-index", index);
      cell.addEventListener("click", handleCellClick);
      board.appendChild(cell);
    });
  }

  resetButton.addEventListener("click", restartGame);

  switchModeButton.addEventListener("click", () => {
    vsAI = !vsAI;
    restartGame();
    switchModeButton.textContent = vsAI ? "Play Against Player" : "Play Against AI";
  });

  createBoard();
});
