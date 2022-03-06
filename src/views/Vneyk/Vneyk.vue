<template>
  <div id="vneyk">
    <div id="name">Vneyk</div>
    <div id="instructions">
      Vneyk is a very simple snake game. Try to eat foods, do not hit any blocks and make a good score.<br>
      This game is using an hand tracking library, so your hand movements will guide the snake.<br>
      Before starting the game, use left mouse button to draw blocks and middle mouse button to delete them.
    </div>

    <video id="input" hidden="true"></video>
    <div id="loader" :hidden="hideLoader"></div>
    <canvas id="output" :hidden="!hideLoader" :width="canvasWidth" :height="canvasHeight"
      @mousedown="updateBlocks('down', $event)" @mousemove="updateBlocks('hover', $event)" ></canvas>

  </div>
</template>

<script>
import mixin from './mixin';
import vizionMixin from '../Vizion/mixin';

import Hands from '@mediapipe/hands';
import CameraUtils from '@mediapipe/camera_utils';

export default {
  data() {
    return {
      // Game
      gameStarted: false,
      score: 0,

      // Blocks
      mouse: null,
      blocks: [],
      blockWidth: 20,
      blockHeight: 20,

      // Food
      food: null,
      foodHeight: 20,
      foodWidth: 20,

      // Snake
      snake: [],
      points: [],
      snakeRadius: 12,
      currentLength: 0,
      allowedLength: 150,
    };
  },
  mixins: [
    mixin,
    vizionMixin
  ],
  methods: {
    onResults: function(results)
    {
      this.canvasCtx.save();
      this.canvasCtx.clearRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);

      this.drawMirrored(() => {
        this.canvasCtx.drawImage(results.image, 0, 0, this.outputCanvas.width, this.outputCanvas.height);

        if (results.multiHandLandmarks) {
          this.gameStarted = true;
          this.generateFood()
          for (let landmarks of results.multiHandLandmarks) {
            let snakeHead = this.drawSnake(landmarks[8])

            // Reset game when snake hits itself
            // Do not check collision before snake fully grows,
            // otherwise it will cause problem when game first started.
            if (this.currentLength > 100)
            {
              // Since points are too close, do not count first couple tails
              for (let i = 0; i < this.snake.length * 0.5; i++)
              {
                if (this.circleCollision(this.snake[i], snakeHead, this.snakeRadius * 0.8))
                  this.resetGame();
              }
            }

            // Reset game when a block is hit
            this.blocks.forEach(block => {
              if (this.boundingBoxCollision(block, snakeHead, this.blockWidth, this.blockHeight))
                this.resetGame();
            });

            // Check whether food is eaten or not
            if (this.boundingBoxCollision(this.food, snakeHead, this.foodWidth, this.foodHeight))
            {
              this.allowedLength += 50
              this.score += 10;
              this.food = null;
              this.generateFood();
            }
          }
        }
        else
        {
          this.resetGame();
        }
      });

      this.drawBlocks();
      this.drawFood();
      this.drawMouse();

      this.drawFps("black");
      this.drawText(this.canvasCtx, "Score: " + this.score, this.outputCanvas.width - 10, 30, "green", "right", "30px Comic Sans MS");
      this.canvasCtx.restore();
    },
    resetGame: function()
    {
      this.gameStarted = false;
      this.score = 0;
      this.snake = [],
      this.points = [];
      this.currentLength = 0;
      this.allowedLength = 150;
    },
    circleCollision: function(coordinate, snake, radius)
    {
      var dx = (coordinate.x + radius) - (snake.x + this.snakeRadius);
      var dy = (coordinate.y + radius) - (snake.y + this.snakeRadius);
      var distance = Math.sqrt(dx * dx + dy * dy);
      return (distance < radius + this.snakeRadius);
    },
    boundingBoxCollision: function(coordinate, snake, width, height)
    {
      let coordinateMinX = coordinate.x;
      let coordinateMaxX = coordinateMinX + width;
      let coordinateMinY = coordinate.y;
      let coordinateMaxY = coordinateMinY + height;

      let snakeMinX = snake.x - this.snakeRadius;
      let snakeMaxX = snake.x + this.snakeRadius;
      let snakeMinY = snake.y - this.snakeRadius;
      let snakeMaxY = snake.y + this.snakeRadius;

      return !(snakeMinX > coordinateMaxX
          || snakeMaxX < coordinateMinX
          || snakeMinY > coordinateMaxY
          || snakeMaxY < coordinateMinY);
    },
    randomFood: function (min, max) {
      return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    },
    checkFood: function (x, y) {
      // Do not create foods on snake or blocks
      this.snake.forEach(tail => {
        if (x == tail.x && y == tail.y)
          return false;
      })

      this.blocks.forEach(block => {
        if (x == block.x && y == block.y)
          return false;
      })

      return true;
    },
    generateFood: function () {
      if (!this.food)
      {
        var x = this.randomFood(0, this.outputCanvas.width - this.foodWidth);
        var y = this.randomFood(0, this.outputCanvas.height - this.foodHeight);
        if (this.checkFood(x, y))
          this.food = { x: x, y: y };
        else
          this.generateFood();
      }
    },
    calculateSnakeLength: function()
    {
      if (this.points.length > 2)
      {
        let length = 0;
        for (let i = 1; i < this.points.length; i++)
        {
          let currentHead = this.points[i];
          let previousHead = this.points[i - 1];
          length += Math.hypot(
            currentHead.x - previousHead.x,
            currentHead.y - previousHead.y);
        }
        return length;
      }
      return 0;
    },
    updateSnakeLength: function()
    {
      this.currentLength = this.calculateSnakeLength();
      if (this.currentLength > this.allowedLength)
      {
        this.points.splice(0, 1);
        this.snake.splice(0, 1);
        this.updateSnakeLength();
      }
    },
    updateBlocks: function (res, e) {
      if (this.gameStarted)
        return;

      // Round to nearest mouse dimensions
      // Since, positions are arranged for each 10px
      var x = e.clientX - this.outputCanvas.offsetLeft;
      x = Math.ceil(x / this.blockWidth) * this.blockWidth - this.blockWidth;

      var y = e.clientY - this.outputCanvas.offsetTop;
      y = Math.ceil(y / this.blockHeight) * this.blockHeight - this.blockHeight;

      if (res == 'down')
      {
        var foundBlock = this.blocks.find(element => element.x == x && element.y == y)
        if (e.button == 0) {
          // Do not place blocks on top of each other
          if (!foundBlock)
            this.blocks.push({ x: x, y: y });
        }
        else if (e.button == 1) {
          if (foundBlock)
            this.blocks.splice(this.blocks.indexOf(foundBlock), 1);
        }
      }
      else if (res == 'hover')
      {
        this.mouse = {x: x, y: y};
      }
    },
    updateView: function()
    {
      this.hideLoader = false;

      this.solution = new Hands.Hands({ locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3.1620248595/${file}`;
      }});
      this.solution.setOptions({
        maxNumHands: parseFloat(this.maxNumHands),
        minDetectionConfidence: parseFloat(this.minDetectionConfidence),
        minTrackingConfidence: parseFloat(this.minTrackingConfidence)
      });
      this.solution.onResults(this.onResults);

      this.inputVideo = document.createElement("video");
      this.inputVideo.msHorizontalMirror = false;
      this.inputVideo.addEventListener("loadedmetadata", () => {
        this.canvasHeight = this.inputVideo.videoHeight;
        this.canvasWidth = this.inputVideo.videoWidth;
        this.msHorizontalMirror = false;
      });

      this.camera = new CameraUtils.Camera(this.inputVideo, { onFrame: this.cameraOnFrame });
      this.camera.start();
    },
  },
};
</script>

<style scoped>
#name {
  text-align: center;
  font-size: 50px;
}
#instructions {
  text-align: center;
  font-size: 20px;
  padding-bottom: 10px;
}
#output {
  margin: auto;
  display: block;
}
#loader {
  z-index: -1;
  margin: auto;
  position: absolute;

  width: 120px;
  height: 120px;
  margin-top: 30vh;
  margin-left: calc(50vw - 80px);

  border: 16px solid lightgray;
  border-top: 16px solid blue;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
