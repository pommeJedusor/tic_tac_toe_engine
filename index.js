class Oxo{
  p1 = 0;
  p2 = 0;
  constructor(board){
    this.setBoard(board);
  }

  setBoard(board){
    if (typeof board == "string" && /[0-2]{9}/.test(board)){
      for (let i=0;i<board.length;i++){
        const square = board[i];
        if (square == "1"){
          this.p1 |= 1 << i;
        }else if (square == "2"){
          this.p2 |= 1 << i;
        }
      }
    }
    else {
      throw "board format is not valid";
    }
  }

  getStringBoard(){
    let string_board = "";
    for (let i=0;i<9;i++){
      if (this.p1 & 1 << i)string_board += "1";
      else if (this.p2 & 1 << i)string_board += "2";
      else string_board += "0";
    }
    return string_board;
  }

  get1DArray(){
    const board = [];
    for (let i=0;i<9;i++){
      if (this.p1 & 1 << i)board.push(1);
      else if (this.p2 & 1 << i)board.push(2);
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
        if (this.p1 & 1 << index)board.at(-1).push(1);
        else if (this.p2 & 1 << index)board.at(-1).push(2);
        else board.at(-1).push(0);
      }
    }
    return board;
  }
}
