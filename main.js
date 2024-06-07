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

  const checkWinDiagonal = (board) => {};

  const checkTie = (board) => {};

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

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const playRound = (row, column) => {
    // Check if cell is available by coercing empty space to 0
    if (board.getBoard()[row][column].getValue() != 0) {
      console.log('You cannot place on this cell!');
      printNewRound();
      return;
    }

    board.dropMark(row, column, getActivePlayer().mark);
    // Check win or tie conditions

    if (
      win.checkWinRow(row, board, getActivePlayer().mark) ||
      win.checkWinColumn(column, board, getActivePlayer().mark)
    ) {
      console.log(`hell yeah, ${getActivePlayer().name} just won`);
      board.printBoard();
      board.createGameBoard();
      printNewRound();
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  board.createGameBoard();
  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
};

const game = GameController();

// const ScreenController = () => {
//   const game = GameController();
//   const playerTurnDiv = document.querySelector('.player-turn');
//   const boardDiv = document.querySelector('.board');

//   const updateScreen = () => {
//     boardDiv.textContent = '';

//     const currentBoard = game.getBoard();

//     const currentPlayer = game.getActivePlayer();

//     playerTurnDiv.textContent = `
//       ${currentPlayer.name}'s Turn!
//     `;
//     currentBoard.forEach((row, rowIndex) => {
//       row.forEach((cell, columnIndex) => {
//         const cellButton = document.createElement('button');

//         cellButton.classList.add('cell');

//         cellButton.dataset.row = rowIndex;
//         cellButton.dataset.column = columnIndex;

//         cellButton.textContent = cell.getValue();

//         boardDiv.appendChild(cellButton);
//       });
//     });
//   };

//   const clickHandlerBoard = (e) => {
//     const selectedRow = e.target.dataset.row;
//     const selectedColumn = e.target.dataset.column;

//     if (!selectedRow && !selectedColumn) return;

//     game.playRound(selectedRow, selectedColumn);
//     updateScreen();
//   };
//   boardDiv.addEventListener('click', clickHandlerBoard);

//   updateScreen();
// };

// ScreenController();
