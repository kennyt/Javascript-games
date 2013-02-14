// function println(string) {
//   // we'll learn about this when we talk about DOM manipulation.
//   $('.output').append(string);
//   $('.output').append("\n");
// }

// function clear() {
//   $('.output').html("");
// }

var makeTTT = function() {
  return {
    gameboard: [["-","-","-"],
                ["-","-","-"],
                ["-","-","-"]],

    current_token: 'x',

    swapToken: function() {
      if (this.current_token == 'x') {
        this.current_token = 'o';
      } else {
        this.current_token = 'x';
      }
    },

    printBoard: function() {
      // clear();

      for (var i = 0; i < this.gameboard.length; i++) {
        console.log(this.gameboard[i]);
      };
    },

    placeToken: function(row, col, token) {
      this.gameboard[row][col] = token;
    },

    validMove: function(row,col) {
      if (this.gameboard[row][col] != '-') {
        return false;
      }

      return ((row >= 0 && row < 3) && (col >= 0 && col < 3));
    },

    gameWon: function() {
      var transpose = function(array) {
        new_array = [];

        for (var i = 0; i < array.length; i++) {
          new_array.push([])
          for (var j = 0; j < array[i].length; j++) {
            new_array[i][j] = array[j][i];
          }
        }
        return new_array;
      };

      var horWin = function(board) {
        for (var i = 0; i < board.length; i++) {
          if ((board[i].join() == "x,x,x") || (board[i].join() == "o,o,o")) {
            return true;
          }
        }

        return false;
      };

      var vertWin = function(board) {
        return horWin(transpose(board));
      };

      var diagWin = function(board) {
        if (board[1][1] == '-') { return false; }

        return (((board[0][0] == board[1][1]) && (board[1][1] == board[2][2])) ||
                ((board[2][0] == board[1][1]) && (board[1][1] == board[0][2])));
      };

      var b = this.gameboard;

      return (horWin(b) || vertWin(b) || diagWin(b));
    },

    gameFull: function() {
      return (this.gameboard.join().indexOf('-') == -1);
    }
  };
};

$(document).ready(function() {

  var game = makeTTT();

  $(".main").css('left', ($(document).width() / 2) - ($(".main").width() / 2));

  $(window).resize(function() {
    $(".main").css('left', ($(document).width() / 2) - ($(".main").width() / 2));
  });

  $(".square").on('click', function () {
    var pos = $(this).attr('id');
    console.log(pos);
    var row = pos[0];
    var col = pos[1];

    if (game.validMove(row, col)) {
      if (game.current_token == 'x') {
        $(this).removeClass("square").addClass("xbox").html("<p>X</p>");
      } else {
        $(this).removeClass("square").addClass("ybox").html("<p>O</p>");
      }
      game.placeToken(row, col, game.current_token);
      game.swapToken();

      if (game.gameWon()) {
        alert("winner!");
        location.reload();
      } else if (game.gameFull()) {
        alert("Tie Game.");
        location.reload();
      }
    }
  });

  $(".giveup").on('click', function() {
    location.reload();
  });
});

var do_stuff = function() {
  while (true) {
  }
};