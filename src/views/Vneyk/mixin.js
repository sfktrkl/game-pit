// We can use mixins to externalize popular pieces of codes
// which are used in different components.
import Hands from '@mediapipe/hands';
import DrawingUtils from '@mediapipe/drawing_utils';

export default {
  data() {
    return {
      // Hand Tracking Options
      maxNumHands: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    };
  },
  methods: {
    drawHand: function(results)
    {
      if (results.multiHandLandmarks) {
        for (let landmarks of results.multiHandLandmarks) {
          DrawingUtils.drawConnectors(this.canvasCtx, landmarks, Hands.HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 3 });
          DrawingUtils.drawLandmarks(this.canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2, radius: 2 });
        }
      }
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
  }
}