import React, { useCallback, useState } from "react";
import "./Board.css";

enum GameState {
  NotStarted,
  Started,
  Victory,
  Draw,
}

enum SquareState {
  Free = 0,
  Player1 = 1,
  Player2 = 2,
}

const DefaultBoardState: SquareState[][] = [
  [SquareState.Free, SquareState.Free, SquareState.Free],
  [SquareState.Free, SquareState.Free, SquareState.Free],
  [SquareState.Free, SquareState.Free, SquareState.Free],
];

const Board = () => {
  const [board, setBoard] = useState<SquareState[][]>(DefaultBoardState);
  const [player, setPlayer] = useState<1 | 2>(1);
  const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);

  const getSquareSymbol = useCallback(
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

  const isWin = useCallback(
    (row: number, col: number, board: SquareState[][]) => {
      const winnerLine: boolean =
        board[row][0] === board[row][1] &&
        board[row][0] === board[row][2] &&
        board[row][0] !== SquareState.Free;

      const winnerCol: boolean =
        board[0][col] === board[1][col] &&
        board[0][col] === board[2][col] &&
        board[0][col] !== SquareState.Free;

      const winnerDiag1: boolean =
        board[0][0] === board[1][1] &&
        board[0][0] === board[2][2] &&
        board[0][0] !== SquareState.Free;

      const winnerDiag2: boolean =
        board[1][1] === board[0][2] &&
        board[1][1] === board[2][0] &&
        board[1][1] !== SquareState.Free;

      return winnerLine || winnerCol || winnerDiag1 || winnerDiag2;
    },
    []
  );

  const isDraw = useCallback((board: SquareState[][]) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === SquareState.Free) {
          return false;
        }
      }
    }
    return true;
  }, []);

  const switchPlayer = useCallback(() => {
    setPlayer(player === 1 ? 2 : 1);
  }, [player]);

  const play = useCallback(
    (row: number, col: number) => {
      const value = player === 1 ? 1 : 2;

      const boardClone: SquareState[][] = board.map((row) =>
        row.map((val) => val)
      );

      boardClone[row][col] = value;

      if (isWin(row, col, boardClone)) {
        setGameState(GameState.Victory);
      }
      if (isDraw(boardClone)) {
        setGameState(GameState.Draw);
      } else {
        switchPlayer();
      }

      setBoard(boardClone);
    },
    [board, isDraw, isWin, player, switchPlayer]
  );

  const resetBoard = useCallback(() => {
    setPlayer(1);
    setBoard(DefaultBoardState);
    setGameState(GameState.NotStarted);
  }, []);

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>

      {gameState === GameState.Started && (
        <>
          <h3>Player {player}</h3>
          <div className="board">
            {board.map((line, row) =>
              line.map((_, col) => (
                <div
                  key={`${row}-${col}`}
                  className="square"
                  style={{
                    backgroundColor: player === 1 ? "bisque" : "lightpink",
                  }}
                  onClick={() => play(row, col)}
                >
                  {getSquareSymbol(row, col)}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {gameState === GameState.NotStarted && (
        <div className="start-game">
          <button type="button" onClick={() => setGameState(GameState.Started)}>
            Start game
          </button>
        </div>
      )}

      {gameState === GameState.Draw && <h2>It's a DRAW!</h2>}

      {gameState === GameState.Victory && <h2>Player {player} WON!</h2>}

      {gameState !== GameState.NotStarted && (
        <button type="button" onClick={() => resetBoard()}>
          Reload
        </button>
      )}
    </div>
  );
}

export default Board;
