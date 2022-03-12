import React, { useCallback } from "react";
import "./Board.css";
import useBoardController, {
  GameState,
  SquareState,
} from "./useBoardController";

const Board = () => {
  const {
    gameState,
    player,
    play,
    board,
    startGame,
    resetGame,
  } = useBoardController();

  const renderSquareSymbol = useCallback(
    (row: number, col: number) => {
        switch (board[row][col]) {
            case SquareState.Player1:
                return "X";
            case SquareState.Player2:
                return "0";
            default:
                return "";
        }
    },
    [board]
);

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>

      {gameState === GameState.Started && (
        <>
          <h3>Player {player}</h3>
          <div className="board">
            {board.map((line: SquareState[], row: number) =>
              line.map((_, col: number) => (
                <div
                  key={`${row}-${col}`}
                  className="square"
                  style={{
                    backgroundColor: player === 1 ? "bisque" : "antiquewhite",
                  }}
                  onClick={() => play(row, col)}
                >
                  {renderSquareSymbol(row, col)}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {gameState === GameState.NotStarted && (
        <div className="start-game">
          <button type="button" onClick={() => startGame()}>
            Start game
          </button>
        </div>
      )}

      {gameState === GameState.Draw && <h2>It's a DRAW!</h2>}

      {gameState === GameState.Victory && <h2>Player {player} WON!</h2>}

      {gameState !== GameState.NotStarted && (
        <button type="button" onClick={() => resetGame()}>
          Reset
        </button>
      )}
    </div>
  );
};

export default Board;
