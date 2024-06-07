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
    this.setBoard(board);
  }

  setBoard(board){
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
      throw "board format is not valid";
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

  get1DArray(){
    const board = [];
    for (let i=0;i<9;i++){
      if (this._p1 & 1 << i)board.push(1);
      else if (this._p2 & 1 << i)board.push(2);
      else board.push(0);
    }
    return board;
  }

  get2DArray(){
    const board = [];
    for (let i=0;i<3;i++){
      board.push([]);
      for (let j=0;j<3;j++){
        const index = i*3 +j;
        if (this._p1 & 1 << index)board.at(-1).push(1);
        else if (this._p2 & 1 << index)board.at(-1).push(2);
        else board.at(-1).push(0);
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
    if (board & board >> 4 & board >> 8 & 0b100_010_001){
      return true;
    }
    //top right -> bottom left
    if (board & board >> 2 & board >> 4 & 0b001_010_100){
      return true;
    }
    return false;
  }

  isFinished(){
    const board = this._p1 | this._p2;
    return !(board ^ 0b111_111_111);
  }

  makeMove(index){
    index--;

    if (!this.isValidMove(index + 1))throw `move ${index+1} is not valid`;
    if (this._player_turn == 1){
      this._p1 |= 1 << index;
    }
    else {
      this._p2 |= 1 << index;
    }
    this._player_turn = this._player_turn % 2 + 1;
    this._moves.push(index+1);
    return this;
  }

  undoMove(index){
    index--;
    const board = this._p1 | this._p2;
    const last_player = this._player_turn == 1 ? this._p2 : this._p1;

    if (index < 0 || index > 8)throw `index ${index+1} is not valid`;
    if (board & 1 << index ^ 1 << index)throw `square at ${index + 1} is already empty`;
    if (last_player & 1 << index ^ 1 << index)throw `tried to undo move of a player (${this._player_turn % 2 + 1}) which isn't the last one`;

    if (this._player_turn == 1){
      this._p2 ^= 1 << index;
    }else {
      this._p1 ^= 1 << index;
    }

    this._player_turn = this._player_turn % 2 + 1;
    this._moves.pop();
  }
}

module.exports = Oxo;
