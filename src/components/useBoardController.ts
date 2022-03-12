import { useCallback, useState } from "react";

export enum GameState {
    NotStarted,
    Started,
    Victory,
    Draw,
}

export enum SquareState {
    Free = 0,
    Player1 = 1,
    Player2 = 2,
}

const DefaultBoardState: SquareState[][] = [
    [SquareState.Free, SquareState.Free, SquareState.Free],
    [SquareState.Free, SquareState.Free, SquareState.Free],
    [SquareState.Free, SquareState.Free, SquareState.Free],
];

const useBoardController = () => {
    const [board, setBoard] = useState<SquareState[][]>(DefaultBoardState);
    const [player, setPlayer] = useState<1 | 2>(1);
    const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);

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
            const value = player === 1 ? SquareState.Player1 : SquareState.Player2;

            const boardClone: SquareState[][] = board.map((row: SquareState[]) =>
                row.map((val: SquareState) => val)
            );

            boardClone[row][col] = value;

            if (isWin(row, col, boardClone)) {
                setGameState(GameState.Victory);
            } else if (isDraw(boardClone)) {
                setGameState(GameState.Draw);
            } else {
                switchPlayer();
            }

            setBoard(boardClone);
        },
        [board, isDraw, isWin, player, switchPlayer]
    );

    const resetGame = useCallback(() => {
        setPlayer(1);
        setBoard(DefaultBoardState);
        setGameState(GameState.NotStarted);
    }, []);

    const startGame = useCallback(() => {
        setGameState(GameState.Started);
    }, []);

    return { gameState, player, play, board, startGame, resetGame };
}

export default useBoardController;