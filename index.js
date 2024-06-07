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
    if (index < 0 || index > 9){
      return false;
    }
    if ((this._p1 | this._p2) & (1 << index)){
      return false;
    }
    return true;
  }

  makeMove(index){
    if (!this.isValidMove(index))throw "move not valid";
    if (this._player_turn == 1){
      this._p1 |= 1 << index;
    }
    else {
      this._p2 |= 1 << index;
    }
    this._player_turn = this._player_turn % 2 + 1;
    return this;
  }
}

module.exports = Oxo;
