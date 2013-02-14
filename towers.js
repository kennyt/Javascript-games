var makeTowers = function{
  return {
    board: [ [3,2,1],
             [],
             []],
    printBoard: function(){
      for (var i = this.board.length - 1; i >= 0; i--) {
        console.log(this.board[i])
      };
    },

    gameWin: function(){
      return ((this.board[1].length == 3) || (this.board[2].length == 3))
    },
    makeMove: function(get, put){
      this.board[put].push(this.board[get].pop)
    },
    validMove: function(get, put) {
      var last = function(array) {
        return array[array.length-1];
      };

      if (this.board[put].length == 0){
        if (last(this.board[get]) < last(this.board[put])) {
          return true;
        }
      }

      return false;
    }
  }
};