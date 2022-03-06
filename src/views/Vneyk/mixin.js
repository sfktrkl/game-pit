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
    }
  }
}