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
  let value = 0;

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMark,
    getValue,
  };
};

const GameController = (
  playerOneName = 'Player One',
  playerTwoName = 'Player Two',
) => {
  const board = GameBoard();

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
    // Check if cell is available
    if (board.getBoard()[row][column].getValue() !== 0) {
      console.log('You cannot place on this cell!');
      printNewRound();
      return;
    }

    board.dropMark(row, column, getActivePlayer().mark);

    // Check win or tie conditions

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

const ScreenController = () => {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.player-turn');
  const boardDiv = document.querySelector('.board');

  const updateScreen = () => {
    boardDiv.textContent = '';
  };

  const clickHandlerBoard = () => {};
};
