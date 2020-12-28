// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Move({move, moveNumber, currentMove, setCurrentMove}) {
  if (move == null) {
    return
  }

  let text
  if (moveNumber === 0) {
    text = 'Go to game start'
  } else if (moveNumber > 0) {
    text = `Go to move #${moveNumber}`
  }

  const isCurrent = moveNumber === currentMove
  if (text != null && isCurrent) {
    text += ' (current)'
  }

  return (
    <li>
      <button onClick={() => setCurrentMove(moveNumber)} disabled={isCurrent}>
        {text}
      </button>
    </li>
  )
}

function Game() {
  const getDefaultSquareHistory = () => [Array(9).fill(null)]
  const [moves, setMoves] = useLocalStorageState(
    'moves',
    getDefaultSquareHistory,
  )
  const [currentMove, setCurrentMove] = React.useState(0)

  const currentSquares = moves[currentMove]
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function selectSquare(square) {
    if (winner != null || currentSquares[square] != null) {
      return
    }

    const squaresCopy = [...currentSquares]
    const nextMove = currentMove + 1
    squaresCopy[square] = nextValue

    const newMoves = [...moves.slice(0, nextMove), squaresCopy]
    setMoves(newMoves)
    setCurrentMove(nextMove)
  }

  function restart() {
    setMoves(getDefaultSquareHistory())
    setCurrentMove(0)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          {moves.map((move, i) => (
            <Move
              key={i}
              move={move}
              moveNumber={i}
              currentMove={currentMove}
              setCurrentMove={setCurrentMove}
            />
          ))}
        </ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
