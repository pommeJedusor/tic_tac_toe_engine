# simple_tic_tac_toe_engine

### Initialisation
The object **Oxo** can take as input.
- nothing (will set an empty grid)
- a string of length 9 composed of 1, 2 or 3
- a 1D array of length 9 composed of 1, "1", 2, "2", "3" or 3
- a 2D of length 3x3 composed of 1, "1", 2, "2", "3" or 3
```javascript
const Oxo = require("simple_tic_tac_toe_engine");

let oxo = new Oxo();
```
```javascript
// by default the oxo grid is empty
let oxo1 = new Oxo();

/*
you can pass a string of 9 (0|1|2)
to the constructor to start from a define position
*/
let oxo2 = new Oxo("020010000");

// you can also pass a 1D array of 9 (0|1|2) elements
let oxo3 = new Oxo([0, 2, 0, 0, 1, 0, 0, 0, 0]);
let oxo4 = new Oxo(["0", "2", "0", "0", "1", "0", "0", "0", "0"]);

// you can also pass a 2D array of 9 (0|1|2) elements
let oxo5 = new Oxo([[0, 2, 0], [0, 1, 0], [0, 0, 0]]);
let oxo6 = new Oxo([["0", "2", "0"], ["0", "1", "0"], ["0", "0", "0"]]);
```

## methods
- [gets](#getstringboard)
  - [getStringBoard](#getstringboard)
  - [get1DArray](#get1darray)
  - [get2DArray](#get2darray)
  - [getCurrentPlayer](#getcurrentplayer)
  - [getMoves](#getmoves)
  - [getBestMove](#getbestmove)
  - [getCurrentScore](#getcurrentscore)
  - [getWinningMoves, getLosingMoves, getDrawingMoves](#getwinningmoves-getlosingmoves-getdrawingmoves)
- [is](#isvalidmoveindex)
  - [isValidMove](#isvalidmoveindex)
  - [isWinning](#iswinning)
  - [isFinished](#isfinished)
- [make | undo move](#isvalidmoveindex)
  - [makeMove](#makemoveindex)
  - [undoMove](#undomoveindex)
  - [undoLastMove](#undolastmove)

### getStringBoard()
This method returns the current board in the format of a 9 length string of (0|1|2).
```javascript
oxo.getStringBoard();
```

### get1DArray()
This method returns the current board in the format of a 9 length array of (0|1|2).

Number not string!
```javascript
oxo.get1DArray();
```

### get2DArray()
This method returns the current board in the format of a 3x3 length array of (0|1|2).

Number not string!
```javascript
oxo.get2DArray();
```

### getCurrentPlayer()
This method returns the player for which is the turn, on an empty grid it's 1 and after the first turn it's 2.

On a full grid it returns 2, so make sure to use **[isFinished](#isfinished)** to check if the game is finished.


```javascript
oxo.getCurrentPlayer();
```

### getMoves()
This method returns all of the available moves for the current position
in an array with the index from 1 to 9 like:
```
1 2 3
4 5 6
7 8 9
```

```javascript
oxo.getMoves();
```

### getBestMove()
This method return the best move, if multiples moves are the best ones it takes the last one.
Move is from 1 to 9 like before:

```javascript
oxo.getBestMove();
```

### getCurrentScore()
This method returns the expected score with perfect play from both players.
- 1 -> player 1 is winning
- 2 -> player 2 is winning
- 0 -> draw

```javascript
oxo.getCurrentScore();
```

### getWinningMoves(), getLosingMoves(), getDrawingMoves()
These methods returns respectively all of the winning moves, losing moves and drawing moves available for the current position.
```javascript
oxo.getWinningMoves();
oxo.getLosingMoves();
oxo.getDrawingMoves();
```

### isValidMove(index)
This method check if the index is between 1 and 9 (index >= 1 && index <= 9) and if the square of this index (starting from 1) in the current grid is available.
```javascript
oxo.isValidMove(1);
```

### isWinning()
This method check if the current position is winning for the last player.
```javascript
oxo.isWinning();
```

### isFinished()
This method check if the current position has all its squares full.
```javascript
oxo.isFinished();
```

### makeMove(index)
This method make the move of the given index.es (starting from 1) for the player for which it's the turn.
Throw an error if the move is not possible, so make sure to check with **[isValidMove](#isvalidmoveindex)** before.
```javascript
// the three lines does the same thing
oxo.makeMove(1).makeMove(2).makeMove(3);
oxo.makeMove(1, 2, 3);
oxo.makeMove([1, 2, 3]);
```

### undoMove(index)
This method undo the move of the given index (starting from 1) for the player for which it was the turn.
Throw an error if:
- the square is empty
- if the square is outside the grid
- if the player which played on this index wasn't the last player to play
```javascript
oxo.undoMove(1);
```

### undoLastMove()
This method undo the last move played.
```javascript
// undo the last move
oxo.undoLastMove();
// undo the two last moves
oxo.undoLastMove(2);
```
