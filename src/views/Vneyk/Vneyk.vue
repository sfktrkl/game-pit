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
      points: [],
      snakeWidth: 12,
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
            let snakeHead = landmarks[8];
            this.drawCircle(this.outputCanvas, this.canvasCtx, snakeHead, this.snakeWidth);

            let currentHead = { 
              x: snakeHead.x * this.outputCanvas.width,
              y: snakeHead.y * this.outputCanvas.height
            };

            this.points.push(currentHead);
            if (this.points.length > 2)
            {
              this.updateSnakeLength();
              for (let i = 1; i < this.points.length; i++)
                this.drawLine(this.canvasCtx, this.points[i], this.points[i - 1], this.snakeWidth * 0.8, "green")
            }
            this.previousHead = currentHead;
          }
        }
        else
        {
          this.gameStarted = false;
          this.points = [];
        }
      });

      this.blocks.forEach(block => {
        this.drawRectangle(this.canvasCtx, block.x, block.y, this.blockWidth, this.blockHeight, "red");
      });

      if (this.gameStarted && this.food)
        this.drawRectangle(this.canvasCtx, this.food.x, this.food.y, this.foodWidth, this.foodHeight, "yellow");

      if (this.gameStarted == false && this.mouse)
        this.drawRectangle(this.canvasCtx, this.mouse.x, this.mouse.y, this.blockWidth, this.blockHeight, "blue");

      this.drawFps("black");
      this.canvasCtx.restore();
    },
    randomFood: function (min, max) {
      return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    },
    checkFood: function (x, y) {
      // Do not create foods on snake or blocks
      this.points.forEach(tail => {
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
