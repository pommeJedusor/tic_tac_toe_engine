function is_valid_2dArray(arr){
  if (!Array.isArray(arr))return false;
  if (arr.length != 3)return false;
  return arr.filter((row)=>{
    if (row.length != 3)return false;
    return row.filter((square)=>[0, 1, 2].includes(square)).length == 3;
  }).length == 3;
}

function is_valid_1dArray(arr){
  if (!Array.isArray(arr))return false;
  if (arr.length != 9)return false;
  return arr.filter((square) => [0, 1, 2].includes(square)).length == 9;
}

class Oxo{
  _p1 = 0;
  _p2 = 0;
  _moves = [];
  _player_turn;
  constructor(board){
    this._setBoard(board);
  }

  _setBoard(board){
    let get_square;
    if (!board){
      get_square = (board, index)=>0;
    }
    else if (typeof board == "string" && /[0-2]{9}/.test(board)){
      get_square = (board, index)=>board[index];
    }
    else if (is_valid_1dArray(board)){
      get_square = (board, index)=>board[index];
    }
    else if (is_valid_2dArray(board)){
      get_square = (board, index)=>board[Math.floor(index/3)][index%3];
    }
    else {
      throw new Error("board format is not valid");
    }

    this._player_turn = 1;
    for (let i=0;i<9;i++){
      const square = get_square(board, i);
      if (square == "1"){
        this._p1 |= 1 << i;
        this._player_turn = this._player_turn % 2 + 1 ;
      }else if (square == "2"){
        this._p2 |= 1 << i;
        this._player_turn = this._player_turn % 2 + 1 ;
      }
    }
    return this;
  }

  getStringBoard(){
    let string_board = "";
    for (let i=0;i<9;i++){
      if (this._p1 & 1 << i)string_board += "1";
      else if (this._p2 & 1 << i)string_board += "2";
      else string_board += "0";
    }
    return string_board;
  }

  get1DArray(use_int=true){
    const zero = use_int ? 0 : "0";
    const one = use_int ? 1 : "1";
    const two = use_int ? 2 : "2";
    const board = [];
    for (let i=0;i<9;i++){
      if (this._p1 & 1 << i)board.push(one);
      else if (this._p2 & 1 << i)board.push(two);
      else board.push(zero);
    }
    return board;
  }

  get2DArray(use_int=true){
    const zero = use_int ? 0 : "0";
    const one = use_int ? 1 : "1";
    const two = use_int ? 2 : "2";
    const board = [];
    for (let i=0;i<3;i++){
      board.push([]);
      for (let j=0;j<3;j++){
        const index = i*3 +j;
        if (this._p1 & 1 << index)board.at(-1).push(one);
        else if (this._p2 & 1 << index)board.at(-1).push(two);
        else board.at(-1).push(zero);
      }
    }
    return board;
  }

  getCurrentPlayer(){
    return this._player_turn;
  }

  getMoves(){
    let moves = [];
    const board = this._p1 | this._p2;
    for (let i=0;i<9;i++){
      if (!(board & 1 << i))moves.push(i+1);
    }
    return moves;
  }

  // return the score expected with perfect play from both players, 1 -> player 1 is winning, 2 -> player 2 is winning, 0 -> draw
  getCurrentScore(){
    if (this.isWinning())return this._player_turn % 2 + 1;
    if (this.isFinished())return 0;

    const moves = this.getMoves();
    let draw_available = false;

    for (const move of moves){
      this.makeMove(move);
      const score = this.getCurrentScore();
      this.undoLastMove();

      if (score == this._player_turn)return score;
      if (score == 0)draw_available = true;
    }
    if (draw_available)return 0;
    return this._player_turn % 2 + 1;
  }

  getBestMove(){
    let draw_move;

    const moves = this.getMoves();
    if (moves.length == 0){
      throw new Error("no move available");
    }

    for (const move of moves){
      this.makeMove(move);
      const score = this.getCurrentScore();
      this.undoLastMove();

      if (score == this._player_turn){
        return move;
      }
      if (score == 0){
        draw_move = move;
      }
    }

    return draw_move || moves[0];
  }

  getWinningMoves(){
    return this.getMoves().filter((move)=>{
      this.makeMove(move);
      const score = this.getCurrentScore();
      this.undoLastMove();
      return score == this._player_turn;
    });
  }

  getLosingMoves(){
    return this.getMoves().filter((move)=>{
      this.makeMove(move);
      const score = this.getCurrentScore();
      this.undoLastMove();
      return score == this._player_turn % 2 + 1;
    });
  }

  getDrawingMoves(){
    return this.getMoves().filter((move)=>{
      this.makeMove(move);
      const score = this.getCurrentScore();
      this.undoLastMove();
      return score == 0;
    });
  }

  isValidMove(index){
    index--;

    if (index < 0 || index > 8){
      return false;
    }

    if ((this._p1 | this._p2) & (1 << index)){
      return false;
    }

    return true;
  }

  isWinning(){
    // the board of the player who has just played
    const board = this._player_turn == 1 ? this._p2 : this._p1;
    //horizontal
    if (board & board >> 1 & board >> 2 & 0b001_001_001){
      return true;
    }
    //vertical
    if (board & board >> 3 & board >> 6 & 0b000_000_111){
      return true;
    }
    //top left -> bottom right
    if (board & board >> 4 & board >> 8 & 0b000_000_001){
      return true;
    }
    //top right -> bottom left
    if (board & board >> 2 & board >> 4 & 0b000_000_100){
      return true;
    }
    return false;
  }

  isFinished(){
    const board = this._p1 | this._p2;
    return !(board ^ 0b111_111_111);
  }

  makeMove(...indexes){
    // check if there is only one array
    if (indexes.length == 1 && Array.isArray(indexes[0])){
      return this.makeMove(...indexes[0]);
    }

    for (let index of indexes){
      index--;

      if (!this.isValidMove(index + 1))throw new Error(`move ${index+1} is not valid`);
      if (this._player_turn == 1){
        this._p1 |= 1 << index;
      }
      else {
        this._p2 |= 1 << index;
      }
      this._player_turn = this._player_turn % 2 + 1;
      this._moves.push(index+1);
    }
    return this;
  }

  undoMove(index){
    index--;
    const board = this._p1 | this._p2;
    const last_player = this._player_turn == 1 ? this._p2 : this._p1;

    if (index < 0 || index > 8)throw new Error(`index ${index+1} is not valid`);
    if (board & 1 << index ^ 1 << index)throw new Error(`square at ${index + 1} is already empty`);
    if (last_player & 1 << index ^ 1 << index)throw new Error(`tried to undo move of a player (${this._player_turn % 2 + 1}) which isn't the last one`);

    if (this._player_turn == 1){
      this._p2 ^= 1 << index;
    }else {
      this._p1 ^= 1 << index;
    }

    this._player_turn = this._player_turn % 2 + 1;
    this._moves.pop();
    return this;
  }

  undoLastMove(nb_times=1){
    for (let i=0;i<nb_times;i++){
      this.undoMove(this._moves.at(-1));
    }
    return this;
  }
}

module.exports = Oxo;
