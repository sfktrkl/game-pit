<template>
  <div class="zneyk" @keydown="change_dir($event)" tabindex="0">
    <div id="name">Zneyk</div>
    <div id="instructions">
      Zneyk is a very simple snake game. Try to eat foods, do not hit any blocks and make a good score.<br>
      Before starting the game, use left mouse button to draw blocks and middle mouse button to delete them.</div>
    <button class="play" @click="play" tabindex="-1">Play</button>
    <div id="score">{{score}}</div>
    <canvas id="snakeboard" tabindex="0" @mousedown="canvas_draw('down', $event)"
      @mousemove="canvas_draw('move', $event)" @mouseup="canvas_draw('up', $event)">
    </canvas>
  </div>
</template>

<script>
export default {
  data () {
    return {
      game_finished: true,

      snake: [
        {x: 500, y: 250},
        {x: 490, y: 250},
        {x: 480, y: 250},
        {x: 470, y: 250},
        {x: 460, y: 250}
      ],

      blocks: [
      ],

      score: 0,

      mouse_down: false,
      mouse_button: -1,

    }
  },
  methods: {
    play: function () {
      if (this.game_finished) {
        this.game_running = false;
        this.game_finished = false;
        this.snake = [
          {x: 500, y: 250},
          {x: 490, y: 250},
          {x: 480, y: 250},
          {x: 470, y: 250},
          {x: 460, y: 250}
        ];

        this.score = 0;
        this.changing_direction = false;

        this.generate_food();

        this.dx = 10;
        this.dy = 0;

        this.zneyk();
      }
    },
    zneyk: function () {
      if (this.has_game_ended() || this.game_running)
        return;

      this.changing_direction = false;
      // Game loop
      setTimeout(() => {
        this.game_running = true;
        this.clear_board();
        this.draw_blocks();
        this.draw_food();
        this.move_snake();
        this.draw_snake();
        this.game_running = false;
        // Repeat
        this.zneyk();
      }, 100);
    },
    has_game_ended: function () {
      // If snake eats itself, end game.
      for (let i = 4; i < this.snake.length; i++)
        if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y)
          return this.end_game();

      // If snake hit any blocks, end game.
      for (let j = 0; j < this.blocks.length; j++)
        if (this.snake[0].x === this.blocks[j].x && this.snake[0].y === this.blocks[j].y)
          return this.end_game();
    },
    end_game: function () {
        this.game_finished = true;
        return true;
    },
    random_food: function (min, max) {
      return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    },
    check_food: function (x, y) {
      // Do not create foods on snake or blocks
      this.snake.forEach(tail => {
        if (x == tail.x && y === tail.y)
          return false;
      })

      this.blocks.forEach(block => {
        if (x === block.x && y === block.y)
          return false;
      })

      return true;
    },
    generate_food: function () {
      var x = this.random_food(0, this.snakeboard.width - 10);
      var y = this.random_food(0, this.snakeboard.height - 10);

      while (!this.check_food(x, y)) {
        x = this.random_food(0, this.snakeboard.width - 10);
        y = this.random_food(0, this.snakeboard.height - 10);
      }

      this.food_x = x;
      this.food_y = y;
    },
    move_snake: function () {
      // Calculate head location
      var head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};

      // If head is located outside the canvas,
      // relocate it to opposite edge of the canvas.
      // So, snake can teleport through edges.
      if (head.x > this.snakeboard.width)
        head = {x: 0, y: this.snake[0].y + this.dy};
      else if (head.x < 0)
        head = {x: this.snakeboard.width, y: this.snake[0].y + this.dy};
      
      if (head.y > this.snakeboard.height)
        head = {x: this.snake[0].x + this.dx, y: 0};
      else if (head.y < 0)
        head = {x: this.snake[0].x + this.dx, y: this.snakeboard.height};

      this.snake.unshift(head);

      // When snake catches a food, increase score and generate another food.
      // Since, eating food will increase snake's length, do not remove any tail.
      if (this.snake[0].x === this.food_x && this.snake[0].y === this.food_y) {
        this.score += 10;
        this.generate_food();
      }
      // Otherwise, remove last tail to keep its size.
      else {
        this.snake.pop();
      }
    },
    change_dir: function (event) {
      // Do not allow changing directions while changing direction
      if (this.changing_direction) return;
      this.changing_direction = true;
      // Left
      if (event.keyCode === 37 && this.dx !== 10) {
        this.dx = -10; this.dy = 0;
      }
      // Up
      if (event.keyCode === 38 && this.dy !== 10) {
        this.dx = 0; this.dy = -10;
      }
      // Right
      if (event.keyCode === 39 && this.dx !== -10) {
        this.dx = 10; this.dy = 0;
      }
      // Down
      if (event.keyCode === 40 && this.dy !== -10) {
        this.dx = 0; this.dy = 10;
      }
    },
    clear_board: function () {
      this.snakeboard_ctx.fillStyle = 'black';
      this.snakeboard_ctx.fillRect(0, 0, this.snakeboard.width, this.snakeboard.height);
    },
    draw_snake: function () {
      this.snake.forEach(tail => {
        this.snakeboard_ctx.fillStyle = 'green';
        this.snakeboard_ctx.fillRect(tail.x, tail.y, 10, 10);
      });
    },
    draw_food: function () {
      this.snakeboard_ctx.fillStyle = 'red';
      this.snakeboard_ctx.fillRect(this.food_x, this.food_y, 10, 10);
    },
    draw_blocks: function () {
      this.blocks.forEach(block => {
        this.snakeboard_ctx.fillStyle = 'white';
        this.snakeboard_ctx.fillRect(block.x, block.y, 10, 10);
      });
    },
    add_remove_block: function (x, y) {
        // Do not draw places where snake is located
        if (!this.snake.find(element => element.x == x && element.y == y))
        {
          // If mouse down, continue adding or removing blocks
          if (this.mouse_down)
          {
            var foundBlock = this.blocks.find(element => element.x == x && element.y == y)
            if (this.mouse_button == 0) {
              // Do not place blocks on top of each other
              if (!foundBlock)
                this.blocks.push({x: x, y: y});
            }
            else if (this.mouse_button == 1) {
              if (foundBlock)
                this.blocks.splice(this.blocks.indexOf(foundBlock), 1);
            }
          }
          // Draw a temporary blue block which will show cursor's location
          this.refresh_draw();
          this.snakeboard_ctx.fillStyle = 'blue';
          this.snakeboard_ctx.fillRect(x, y, 10, 10)
        }
    },
    canvas_draw: function (res, e) {
      if (!this.game_finished)
        return;

      // Round to nearest 10
      // Since, positions are arranged for each 10px
      var x = e.clientX - this.snakeboard.offsetLeft;
      x = Math.ceil(x / 10) * 10 - 10;

      var y = e.clientY - this.snakeboard.offsetTop;
      y = Math.ceil(y / 10) * 10 - 30;

      if (res == 'move')
      {
        this.add_remove_block(x, y);
      }
      else if (res == 'up')
      {
        this.mouse_down = false;
        this.mouse_button = -1;
      }
      else if (res == 'down')
      {
        this.mouse_down = true;
        this.mouse_button = e.button;
        this.add_remove_block(x, y);
      }
    },
    refresh_draw: function () {
      this.clear_board();
      this.draw_blocks();
      this.draw_snake();
    }
  },
  mounted() {
    // Create a high dpi canvas
    this.snakeboard = document.getElementById("snakeboard");
    var rect = this.snakeboard.getBoundingClientRect();
    var dpr = (window.devicePixelRatio || 1);
    this.snakeboard.width = rect.width * dpr;
    this.snakeboard.height = rect.height * dpr;
    this.snakeboard_ctx = this.snakeboard.getContext("2d");
    this.snakeboard_ctx.scale(dpr, dpr);

    // Draw canvas, snake and blocks initially
    this.refresh_draw();
  }
}
</script>

<style scoped>
#snakeboard {
  padding-left: 0;
  padding-right: 0;
  padding-top: 20px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 1000px;
  height: 500px;
}
#name {
  text-align: center;
  font-size: 50px;
}
#score {
  text-align: center;
  font-size: 30px;
}
#instructions {
  text-align: center;
  font-size: 20px;
  padding-bottom: 10px;
}
.play {
  background-color: lime;
  color: white;
  border: none;
  padding: 16px 32px;
  text-align: center;
  font-size: 16px;
  transition: 0.3s;
  opacity: 0.75;
  cursor: pointer;
  display: block;
  margin: auto;
}
.play:hover {
  opacity: 1;
}
</style>
