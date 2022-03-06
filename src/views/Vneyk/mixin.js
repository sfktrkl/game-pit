// We can use mixins to externalize popular pieces of codes
// which are used in different components.
import Hands from '@mediapipe/hands';
import DrawingUtils from '@mediapipe/drawing_utils';

export default {
  data() {
    return {
      // Hand Tracking Options
      maxNumHands: 1,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.8,
    };
  },
  methods: {
    drawHand: function(landmarks)
    {
      DrawingUtils.drawConnectors(this.canvasCtx, landmarks, Hands.HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 3 });
      DrawingUtils.drawLandmarks(this.canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2, radius: 2 });
    },
    drawMirrored: function(drawFunc)
    {
      let x = 0, y = 0;
      let horizontal = true;
      let vertical = false;
      let image = this.canvasCtx.getImageData(0, 0, this.outputCanvas.width, this.outputCanvas.height);

      this.canvasCtx.save();  // save the current canvas state
      this.canvasCtx.setTransform(
          horizontal ? -1 : 1, 0, // set the direction of x axis
          0, vertical ? -1 : 1,   // set the direction of y axis
          x + horizontal ? image.width : 0, // set the x origin
          y + vertical ? image.height : 0   // set the y origin
      );
      drawFunc();
      this.canvasCtx.restore();
    },
    drawSnake: function(snakeHead)
    {
      this.drawCircle(this.outputCanvas, this.canvasCtx, snakeHead, this.snakeRadius);

      let currentHead = { 
        x: snakeHead.x * this.outputCanvas.width,
        y: snakeHead.y * this.outputCanvas.height
      };

      // Mirror point to find the position of the snake
      let mirrored = { x: this.outputCanvas.width - currentHead.x, y: currentHead.y };
      this.snake.push(mirrored);

      this.points.push(currentHead);
      if (this.points.length > 2)
      {
        this.updateSnakeLength();
        for (let i = 1; i < this.points.length; i++)
          this.drawLine(this.canvasCtx, this.points[i], this.points[i - 1], this.snakeRadius * 0.8, "green")
      }

      return mirrored;
    },
    drawBlocks: function()
    {
      this.blocks.forEach(block => {
        this.drawRectangle(this.canvasCtx, block.x, block.y, this.blockSize, this.blockSize, "red");
      });
    },
    drawFood: function()
    {
      if (this.gameStarted && this.food)
        this.drawRectangle(this.canvasCtx, this.food.x, this.food.y, this.foodSize, this.foodSize, "yellow");
    },
    drawMouse: function()
    {
      if (this.gameStarted == false && this.mouse)
        this.drawRectangle(this.canvasCtx, this.mouse.x, this.mouse.y, this.blockSize, this.blockSize, "blue");
    }
  }
}