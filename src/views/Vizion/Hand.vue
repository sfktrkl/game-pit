<template>
  <div id="hand">
    <div id="name">Hand Tracking</div>

    <div id="options">
      <div class="option">
        <label class="optionLabel" for="maxNumHands">Maximum number of hands</label>
        <input id="maxNumHands" type="number" min="1" max="5" step="1" v-model="maxNumHands" @change="update" required>
      </div>

      <div class="option">
        <label class="optionLabel" for="minDetection">Minimum detection confidence</label>
        <input id="minDetection" type="number" min="0" max="1" step="0.1" v-model="minDetectionConfidence" @change="update" required>
      </div>

      <div class="option">
        <label class="optionLabel" for="minTracking">Minimum tracking confidence</label>
        <input id="minTracking" type="number" min="0" max="1" step="0.1" v-model="minTrackingConfidence" @change="update" required>
      </div>
    </div>

    <video id="input" hidden="true"></video>
    <div id="loader" :hidden="hideLoader"></div>
    <canvas id="output" :hidden="!hideLoader" :width="canvasWidth" :height="canvasHeight" @click="pauseVideo"></canvas>

  </div>
</template>

<script>
import mixin from './mixin';

import Hands from '@mediapipe/hands';
import DrawingUtils from '@mediapipe/drawing_utils';

export default {
  data() {
    return {
      // Options
      maxNumHands: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    };
  },
  mixins: [
    mixin
  ],
  methods: {
    onResults: function(results)
    {
      this.canvasCtx.save();
      this.canvasCtx.clearRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);
      this.canvasCtx.drawImage(results.image, 0, 0, this.outputCanvas.width, this.outputCanvas.height);

      this.drawFps();

      if (results.multiHandLandmarks) {
        for (let landmarks of results.multiHandLandmarks) { // There may be more than one hand
          DrawingUtils.drawConnectors(this.canvasCtx, landmarks, Hands.HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 3 });
          DrawingUtils.drawLandmarks(this.canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2, radius: 2 });

          // Landmarks of hand: 0, 5, 9, 13, 17
          let hand = [0, 5, 9, 13, 17];
          this.drawMiddle(this.outputCanvas, this.canvasCtx, landmarks, hand, "Hand");
        }
      }
      this.canvasCtx.restore();
    },
    createSolution: function()
    {
      this.solution = new Hands.Hands({ locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3.1620248595/${file}`;
      }});
      this.solution.setOptions({
        maxNumHands: parseFloat(this.maxNumHands),
        minDetectionConfidence: parseFloat(this.minDetectionConfidence),
        minTrackingConfidence: parseFloat(this.minTrackingConfidence)
      });
      this.solution.onResults(this.onResults);
    }
  }
};
</script>

<style src='./form.css'></style>
