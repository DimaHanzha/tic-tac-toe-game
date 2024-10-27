import { useState } from 'react';

import Player from './components/Player.jsx';
import GameBoard from './components/GameBoard.jsx';
import Log from './components/Log.jsx';

import { WINNING_COMBINATIONS } from './winning-combinations.js';
import GameOver from './components/GameOver.jsx';

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2',
}

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function getCurrentPlayer(gameTurns) {
  let currentPlayer = 'X';

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }

  return currentPlayer;
}

function getWinner(gameBoard, players) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if (firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}

function getGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD].map(array => [...array]);

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState(PLAYERS);

  const currentPlayer = getCurrentPlayer(gameTurns);
  const gameBoard = getGameBoard(gameTurns);
  const winner = getWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  const handleSelectionSquare = (rowIndex, colIndex) => {
    setGameTurns((prevTurns) => {
      const currentPlayer = getCurrentPlayer(prevTurns);

      return [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns
      ];
    });
  };

  const handleRestart = () => {
    setGameTurns([]);
  };

  const handleChangePlayerName = (symbol, newName) => {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  };

  return <main>
    <div id="game-container">
      <ol id="players" className="highlight-player">
        <Player name={PLAYERS.X} symbol="X" isActive={currentPlayer === 'X'} onChangeName={handleChangePlayerName}/>
        <Player name={PLAYERS.O} symbol="O" isActive={currentPlayer === 'O'} onChangeName={handleChangePlayerName}/>
      </ol>
      {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
      <GameBoard onSelectSquare={handleSelectionSquare} board={gameBoard}/>
    </div>
    <Log turns={gameTurns}/>
  </main>;
}

export default App;
