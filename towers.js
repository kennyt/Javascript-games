var makeTowers = function() {
  return {
    board: [ [5,4,3,2,1],
             [],
             []],
    printBoard: function(){
      for (var i = this.board.length - 1; i >= 0; i--) {
        console.log(this.board[i])
      };
    },

    gameWin: function(){
      return ((this.board[1].length == 5) || (this.board[2].length == 5))
    },
    makeMove: function(get, put){
      this.board[put].push(this.board[get].pop());
    },
    validMove: function(get, put) {
      var last = function(array) {
        return array[array.length-1];
      };

      if (this.board[get].length != 0){
        if (this.board[put].length == 0 ) {
          return true;
        }
        if (last(this.board[get]) < last(this.board[put])) {
          return true;
        }
      }

      return false;
    }
  }
};

$(document).ready(function() {
  var game = makeTowers();
  var get = undefined;
  var put = undefined;
  var moves = 0;

  var changeOthers = function(towerNum) {
    for (var i = 1; i <= game.board.length; i++) {
      if(i != towerNum) {
        $("#t" + i).attr("class", "destination");
      }
    };
  };

  var resetTowers = function() {
    for (var i = 1; i <= game.board.length; i++) {
      $("#t" + i).attr("class","tower");
    };

    get = undefined;
    put = undefined;
  };

  var printTowers = function() {
    for (var i = 0; i < game.board.length; i++) {
      $("#t" + (i+1)).html("");

      var totHeight = 0;

      for (var j = game.board[i].length - 1; j >= 0 ; j--) {
        var block = '<div class="block' + game.board[i][j] + '"></div>';
        $("#t" + (i+1)).append(block);
        totHeight += 50;
      }

      var whitespace = "<div class='whitespace' style='height:" + (250 - totHeight) + "'></div>";
      $("#t" + (i+1)).prepend(whitespace);

      totHeight = 0;
    }
  };

  $(".main").on('click', '.tower', function() {
    get = $(this).attr("id")[1];
    $(this).attr("class", "clicked");

    changeOthers(get);
  });

  $(".main").on('click', '.destination', function() {
    put = $(this).attr("id")[1];

    if (game.validMove(get - 1, put - 1)) {
      game.makeMove(get - 1, put - 1);
      moves += 1;
      $(".score").html("Score: " + moves);
    }
    resetTowers();
    printTowers();

    if (game.gameWin()) {
      alert("Winner!");
      location.reload();
    }
  });

  $(".giveup").click(function(){
    location.reload();
  });
});