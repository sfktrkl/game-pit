<template>
  <div id="holistic">
    <div id="name">Holistic</div>

    <div id="options">
      <div class="option">
        <label class="optionLabel" for="modelComplexity">Model complexitiy</label>
        <input id="modelComplexity" type="number" min="1" max="2" step="1" v-model="modelComplexity" @change="update" required>
      </div>

      <div class="option">
        <input id="smoothLandmarks" type="checkbox" v-model="smoothLandmarks" @change="update" required>
        <label class="optionLabel" for="smoothLandmarks">Smooth landmarks</label>
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
    <canvas id="output" :width="canvasWidth" :height="canvasHeight" @click="pauseVideo"></canvas>

  </div>
</template>

<script>
import mixin from './mixin';

import Holistic from '@mediapipe/holistic';
import DrawingUtils from '@mediapipe/drawing_utils';

export default {
  data() {
    return {
      // Options
      modelComplexity: 1,
      smoothLandmarks: true,
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

      if (results.poseLandmarks)
      {
        DrawingUtils.drawConnectors(this.canvasCtx, results.poseLandmarks, Holistic.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        DrawingUtils.drawLandmarks(this.canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2});
      }
      if (results.faceLandmarks)
        DrawingUtils.drawConnectors(this.canvasCtx, results.faceLandmarks, Holistic.FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
      if (results.leftHandLandmarks)
      {
        DrawingUtils.drawConnectors(this.canvasCtx, results.leftHandLandmarks, Holistic.HAND_CONNECTIONS, { color: '#CC0000', lineWidth: 5 });
        DrawingUtils.drawLandmarks(this.canvasCtx, results.leftHandLandmarks, { color: '#00FF00', lineWidth: 2});
      }
      if (results.rightHandLandmarks)
      {
        DrawingUtils.drawConnectors(this.canvasCtx, results.rightHandLandmarks, Holistic.HAND_CONNECTIONS, {color: '#00CC00', lineWidth: 5 });
        DrawingUtils.drawLandmarks(this.canvasCtx, results.rightHandLandmarks, { color: '#FF0000', lineWidth: 2});
      }

      this.canvasCtx.restore();
    },
    createSolution: function()
    {
      this.solution = new Holistic.Holistic({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      }});
      this.solution.setOptions({
        modelComplexity: this.modelComplexity,
        smoothLandmarks: this.smoothLandmarks,
        minDetectionConfidence: this.minDetectionConfidence,
        minTrackingConfidence: this.minTrackingConfidence
      });
      this.solution.onResults(this.onResults);
    }
  }
};
</script>

<style src='./form.css'></style>
