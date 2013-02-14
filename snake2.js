var last = function(array) {
  return array[array.length-1];
};

var randInt = function(range) {
  return (Math.floor(Math.random() * range))
};

var makeSegment = function(leader, row, col) {
  return {
    leader: leader,
    row: row,
    col: col,
    move: function() {
      this.row = this.leader.row;
      this.col = this.leader.col;
    }
  };
};

var makeHead = function(row, col) {
  return {
    row: row,
    col: col,
    direction: [0,1],
    move: function(board_size) {
      this.row = (this.row + this.direction[0] + board_size) % board_size;
      this.col = (this.col + this.direction[1] + board_size) % board_size;
    },
    changeDirection: function(direc) {
      directions = [[-1,0],[0,1],[1,0],[0,-1]];

      if ((this.direction[0] + directions[direc][0] != 0) ||
          (this.direction[1] + directions[direc][1] != 0)) {
        this.direction = directions[direc];
      }
    }
  };
};

var makeApple = function(row, col) {
  return {
    row: row,
    col: col,
    resetApple: function(snake1, snake2) {
      while (true) {
        var row = randInt(20);
        var col = randInt(20);
        if ((!(snake1.inSnake(row, col))) && (!(snake2.inSnake(row, col)))) {
          this.row = row;
          this.col = col;
          break;
        }
      }
    }
  };
};

var makeSnake = function() {
  return {
    bodyParts: [],
    head: undefined,
    apple: undefined,

    inSnake: function(row, col, head) {
      var i = 0;

      if (head) {
        i += 1;
      }

      for (i; i < this.bodyParts.length; i++) {
        if ((this.bodyParts[i].row == row) && (this.bodyParts[i].col == col)) {
          return true;
        }
      };

      return false;
    },
    checkApple: function() {
      return ((this.apple.row == this.head.row) && (this.apple.col == this.head.col));
    },
    initialize: function(player) {
      if (player == 1) {
        this.head = makeHead(0, 9);
        this.head.changeDirection(2);
      } else {
        this.head = makeHead(19,9);
        this.head.changeDirection(0);
      }

      this.bodyParts.push(this.head);
    },
    eat: function(row, col) {
      var last_segment = last(this.bodyParts);
      this.bodyParts.push(makeSegment(last_segment, row, col));
    },
    move: function() {
      var end_segment = last(this.bodyParts);
      var last_pos = [end_segment.row, end_segment.col];

      for (var i = this.bodyParts.length - 1; i >= 0; i--) {
        this.bodyParts[i].move(20);
      }

      if (this.checkApple()) {
        this.eat(last_pos[0], last_pos[1]);
        return true;
      }

      return false;
    },
    lose: function(other_snake) {
      return (this.inSnake(this.head.row, this.head.col, true) ||
              other_snake.inSnake(this.head.row, this.head.col));
    }
  }
}

var makeGame = function() {
  return {
    board_size: undefined,
    snake1: undefined,
    snake2: undefined,
    head: undefined,
    apple: undefined,
    changeDirection: function(player, direc) {
      if (player == 1) {
        this.snake1.head.changeDirection(direc);
      } else {
        this.snake2.head.changeDirection(direc);
      }
    },
    initialize: function() {
      this.board_size = 20;

      this.snake1 = makeSnake();
      this.snake1.initialize(1);

      this.snake2 = makeSnake();
      this.snake2.initialize(2);

      this.apple = makeApple();
      this.apple.resetApple(this.snake1, this.snake2);

      this.snake1.apple = this.apple;
      this.snake2.apple = this.apple;
    },
    move: function() {
      var a = this.snake1.move();
      if (this.snake1.lose(this.snake2)) {
        return 1;
      }
      var b = this.snake2.move();
      if (this.snake2.lose(this.snake1)) {
        return 2;
      }
      if (a || b) {
        this.apple.resetApple(this.snake1, this.snake2);
      }
      return 0;
    }
  }
};

$(document).ready(function() {
  var game = makeGame();
  var pause = false;
  game.initialize();

  var printBoard = function() {
    $(".gameboard").html("");

    for (var i = 0; i < 20; i++) {
      var row = "<div class='row'>";
      for (var j = 0; j < 20; j++) {
        row += "<div class='square' id='" + i + '-' + j +"'></div>"
      }
      row += "</div>";

      $(".gameboard").append(row);
    }

    for (var i = 0; i < game.snake1.bodyParts.length; i++) {
      var divId = '#' + game.snake1.bodyParts[i].row + '-' + game.snake1.bodyParts[i].col;

      if (i==0) {
        $(divId).attr("class", "head1");
      } else {
        $(divId).removeClass("square").addClass("segment1");
      }
    }

    for (var i = 0; i < game.snake2.bodyParts.length; i++) {
      var divId = '#' + game.snake2.bodyParts[i].row + '-' + game.snake2.bodyParts[i].col;

      if (i==0) {
        $(divId).attr("class", "head2");
      } else {
        $(divId).removeClass("square").addClass("segment2");
      }
    }

    var appleId = '#' + game.apple.row + '-' + game.apple.col;

    $(appleId).removeClass("square").addClass("apple");

    $(".gameboard").css('left', ($(document).width() / 2) - ($(".gameboard").width() / 2));
    // $(".score").css('left', ($(document).width() / 2) - ($(".score").width() / 2));
    // $(".score").css('top', ($(".gameboard").height() + 60));
  };

  var play = function() {
    p = game.move();
    printBoard();
    // $(".score").html("Score: " + game.snake1.length);
    if (p == 1) {
      alert("Player 1 Lost!");
      location.reload();
    } else if (p == 2) {
      alert("Player 2 Lost!");
      location.reload();
    }
  };

  var run_loop = window.setInterval(play, 120);

  $('html').keydown(function(event) {
    console.log(event.keyCode);
    if(event.keyCode == 38) {
      game.changeDirection(1, 0);
    }
    if(event.keyCode == 39) {
      game.changeDirection(1, 1);
    }
    if(event.keyCode == 40) {
      game.changeDirection(1, 2);
    }
    if(event.keyCode == 37) {
      game.changeDirection(1, 3);
    }
    if(event.keyCode == 87) {
      game.changeDirection(2, 0);
    }
    if(event.keyCode == 68) {
      game.changeDirection(2, 1);
    }
    if(event.keyCode == 83) {
      game.changeDirection(2, 2);
    }
    if(event.keyCode == 65) {
      game.changeDirection(2, 3);
    }
    if(event.keyCode == 32) {
      if (pause) {
        run_loop = window.setInterval(play, 120);
        pause = false;
      } else {
        clearInterval(run_loop);
        pause = true;
      }
    }
  });

});