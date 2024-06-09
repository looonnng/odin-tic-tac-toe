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

  const printBoard = () => {
    const boardWithMarkVals = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );

    console.log(boardWithMarkVals);
  };

  return {
    createGameBoard,
    getBoard,
    dropMark,
    printBoard,
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
      return `Hell yeah, <span class='${getActivePlayer()
        .name.toLowerCase()
        .split(' ')
        .join('-')}'>${getActivePlayer().name}</span> just won`;
    } else if (win.checkTie(board)) {
      return 'Boring, this is a tie game';
    }

    switchPlayerTurn();
  };

  board.createGameBoard();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    createNewBoard: board.createGameBoard,
    getPlayerScore,
  };
};

const ScreenController = () => {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.player-turn');
  const boardDiv = document.querySelector('.board');
  const scoreBoardDiv = document.querySelector('.score-board');

  const updateScreen = () => {
    boardDiv.textContent = '';
    const currentBoard = game.getBoard();

    const currentPlayer = game.getActivePlayer();

    scoreBoardDiv.textContent = `Player One : ${
      game.getPlayerScore()[0]
    } , Player Two: ${game.getPlayerScore()[1]} `;

    playerTurnDiv.textContent = `
      ${currentPlayer.name}'s Turn!
    `;
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
      const resultDiv = document.createElement('h1');
      resultDiv.innerHTML = result;
      resultDiv.classList.add('game-result');
      document.querySelector('.board-container').appendChild(resultDiv);

      boardDiv.removeEventListener('click', clickHandlerBoard);

      // Create button to play again
      const playAgainButton = document.createElement('button');
      playAgainButton.textContent = 'Play Again';
      playAgainButton.classList.add('play-again-btn');
      document.querySelector('.board-container').appendChild(playAgainButton);

      // Function to handle event after play again is clicked
      const clickHandlerPlayAgain = () => {
        game.createNewBoard();
        boardDiv.addEventListener('click', clickHandlerBoard); // Make game board playable again

        updateScreen();

        resultDiv.remove();
        playAgainButton.remove();
      };

      playAgainButton.addEventListener('click', clickHandlerPlayAgain);
    }
  };

  // Initialize game board
  boardDiv.addEventListener('click', clickHandlerBoard);
  updateScreen();
};

ScreenController();
