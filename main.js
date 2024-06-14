const GameBoard = () => {
  const rows = 3;
  const cols = 3;
  let board = [];

  const createGameBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < cols; j++) {
        board[i].push(Mark());
      }
    }
    return board;
  };

  const getBoard = () => board;

  const dropMark = (row, column, player) => {
    board[row][column].addMark(player);
  };

  return {
    createGameBoard,
    getBoard,
    dropMark,
  };
};

/* 
  A mark is equivalent to one cell on the board:

  0 = empty space
  1 = crosses
  2 = noughts

*/

const Mark = () => {
  let value = ' ';

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMark,
    getValue,
  };
};

const Winner = () => {
  const checkWinRow = (row, board, playerMark) => {
    const markedCells = board.getBoard()[row].map((cell) => cell.getValue());
    return markedCells.every((cell) => cell === playerMark);
  };

  const checkWinColumn = (column, board, playerMark) => {
    const markedCells = board.getBoard().map((row) => row[column].getValue());
    return markedCells.every((cell) => cell === playerMark);
  };

  const checkWinDiagonal = (board, playerMark) => {
    const markedCells = board.getBoard();
    const cellsLeftToRight = [];
    const cellsRightToLeft = [];

    for (let i = 0, j = 2; i < markedCells.length; i++, j--) {
      cellsLeftToRight.push(markedCells[i][i].getValue());
      cellsRightToLeft.push(markedCells[j][i].getValue());
    }

    return (
      cellsLeftToRight.every((cell) => cell === playerMark) ||
      cellsRightToLeft.every((cell) => cell === playerMark)
    );
  };

  const checkTie = (board) => {
    return board
      .getBoard()
      .every((row) => row.every((cell) => cell.getValue() !== ' '));
  };

  return {
    checkWinRow,
    checkWinColumn,
    checkWinDiagonal,
    checkTie,
  };
};

const GameController = (
  playerOneName = 'Player One',
  playerTwoName = 'Player Two',
) => {
  const board = GameBoard();
  const win = Winner();

  const players = [
    {
      name: playerOneName,
      mark: 'X',
      score: 0,
    },
    {
      name: playerTwoName,
      mark: 'O',
      score: 0,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const getPlayerScore = () => players.map((player) => player.score);

  const getPlayerName = () => players.map((player) => player.name);

  const playRound = (row, column) => {
    // Check if cell is occupied
    if (board.getBoard()[row][column].getValue() != 0) {
      return;
    }

    board.dropMark(row, column, getActivePlayer().mark);

    // Check win or tie conditions
    if (
      win.checkWinRow(row, board, getActivePlayer().mark) ||
      win.checkWinColumn(column, board, getActivePlayer().mark) ||
      win.checkWinDiagonal(board, getActivePlayer().mark)
    ) {
      getActivePlayer().score += 1;
      // Get current round winner
      // Then set X player to always go first
      const currentWinner = getActivePlayer();
      activePlayer = players[0];
      return `Hell yeah, <span class='${
        currentWinner.mark === 'X' ? 'player-one' : 'player-two'
      }'>${currentWinner.name}</span> just won`;
    } else if (win.checkTie(board)) {
      activePlayer = players[0];
      return 'Boring, this is a tie game';
    }

    switchPlayerTurn();
  };

  board.createGameBoard();

  return {
    playRound,
    getActivePlayer,
    getPlayerScore,
    getPlayerName,
    getBoard: board.getBoard,
    createNewBoard: board.createGameBoard,
  };
};

const ScreenController = (playerOne, playerTwo) => {
  const game = GameController(playerOne, playerTwo);
  const boardContainer = document.querySelector('.board-container');
  // Create game board && current player's turn && reset board button
  const boardDiv = document.createElement('div');
  boardDiv.classList.add('board');

  const playerTurnDiv = document.createElement('div');

  const resetBoardButton = document.createElement('button');
  resetBoardButton.classList.add('reset-board-btn');
  resetBoardButton.textContent = 'Reset Board';

  boardContainer.appendChild(playerTurnDiv);
  boardContainer.appendChild(boardDiv);
  boardContainer.appendChild(resetBoardButton);

  const scoreBoardDiv = document.querySelector('.score-board');

  const playerOneScoreDiv = document.createElement('p');
  const playerTwoScoreDiv = document.createElement('p');

  const updateScreen = () => {
    // Prevent updating new content on top of new cells
    boardDiv.textContent = '';

    // Remove any existing class on player div
    playerTurnDiv.classList.remove('player-one', 'player-two');

    playerOneScoreDiv.textContent = `${game.getPlayerName()[0]} : ${
      game.getPlayerScore()[0]
    }`;
    playerTwoScoreDiv.textContent = `${game.getPlayerName()[1]} : ${
      game.getPlayerScore()[1]
    }`;
    scoreBoardDiv.appendChild(playerOneScoreDiv);
    scoreBoardDiv.appendChild(playerTwoScoreDiv);

    const currentBoard = game.getBoard();

    const currentPlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `
      ${currentPlayer.name}'s Turn!
    `;

    playerTurnDiv.classList.add(
      currentPlayer.mark === 'X' ? 'player-one' : 'player-two',
    );

    currentBoard.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement('button');

        cellButton.classList.add('cell');

        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;

        cellButton.textContent = cell.getValue();

        if (cellButton.textContent === 'X') {
          cellButton.classList.add('player-one');
        } else if (cellButton.textContent === 'O') {
          cellButton.classList.add('player-two');
        }

        boardDiv.appendChild(cellButton);
      });
    });
  };

  const clickHandlerBoard = (e) => {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    if (!selectedRow && !selectedColumn) return;

    const result = game.playRound(selectedRow, selectedColumn);

    updateScreen();

    // Check win or tie
    if (result) {
      // Create a winner display
      resetBoardButton.hidden = true;

      const resultDiv = document.createElement('h2');
      resultDiv.innerHTML = result;
      resultDiv.classList.add('game-result');
      boardContainer.appendChild(resultDiv);

      boardDiv.removeEventListener('click', clickHandlerBoard);

      // Create button to play again
      const playAgainButton = document.createElement('button');
      playAgainButton.textContent = 'Play Again';
      playAgainButton.classList.add('play-again-btn');

      // Create button for new game
      const newGameButton = document.createElement('button');
      newGameButton.textContent = 'New Game';
      newGameButton.classList.add('new-game-btn');

      // Wrapper for buttons after round is finished
      const finishedRoundButtonsWrapper = document.createElement('div');
      finishedRoundButtonsWrapper.classList.add('finished-round-wrapper');
      finishedRoundButtonsWrapper.classList.add('row');
      finishedRoundButtonsWrapper.appendChild(playAgainButton);
      finishedRoundButtonsWrapper.appendChild(newGameButton);

      // Function to handle event after play again is clicked
      const clickHandlerPlayAgain = () => {
        game.createNewBoard();
        boardDiv.addEventListener('click', clickHandlerBoard); // Make game board playable again

        updateScreen();

        resultDiv.remove();
        finishedRoundButtonsWrapper.remove();
        resetBoardButton.hidden = false;
      };

      const clickHandlerNewGame = () => {
        boardContainer.querySelectorAll('*').forEach((childElement) => {
          if (
            !(
              (childElement.classList[0] != 'title' &&
                childElement.classList[0] == 'score-board') ||
              (childElement.classList[0] != 'score-board' &&
                childElement.classList[0] == 'title')
            )
          ) {
            childElement.remove();
          }
        });
        boardContainer.appendChild(getCurrentPlayerName);
      };

      playAgainButton.addEventListener('click', clickHandlerPlayAgain);
      newGameButton.addEventListener('click', clickHandlerNewGame);

      boardContainer.insertBefore(
        finishedRoundButtonsWrapper,
        resetBoardButton,
      );
    }
  };

  // Initialize game board
  boardDiv.addEventListener('click', clickHandlerBoard);

  updateScreen();

  // Create reset board button
  const clickHandleResetBoardButton = () => {
    game.createNewBoard();
    updateScreen();
  };

  resetBoardButton.addEventListener('click', clickHandleResetBoardButton);
};

const startGame = () => {
  const currentPlayerOne = document.querySelector('#player-one').value;
  const currentPlayerTwo = document.querySelector('#player-two').value;

  if (currentPlayerOne === currentPlayerTwo) {
    alert('Cannot have same name');
    return;
  }

  ScreenController(currentPlayerOne, currentPlayerTwo);
  getCurrentPlayerName.remove();
};

const getCurrentPlayerName = document.querySelector('form');

getCurrentPlayerName.addEventListener('submit', startGame);
