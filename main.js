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
    // Cell is not available when has a value already
    if (board[row][column].getValue() !== 0) {
      return;
      // TODO: Prevent user from adding to occupied cell
    }
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
    board.dropMark(row, column, getActivePlayer().mark);

    switchPlayerTurn();
    printNewRound();
  };

  board.createGameBoard();
  printNewRound();

  return {
    playRound,
  };
};

const game = GameController();
