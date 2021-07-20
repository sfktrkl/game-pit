<template>
  <div id="pose">
    <div id="name">Pose Estimation Tracking</div>

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

import Pose from '@mediapipe/pose';
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

      let landmarks = results.poseLandmarks;
      if (landmarks)
      {
        DrawingUtils.drawConnectors(this.canvasCtx, landmarks, Pose.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 3 });
        DrawingUtils.drawLandmarks(this.canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2, radius: 2 });

        // Landmarks of eyes: 2, 5
        let head = [2, 5];
        this.drawMiddle(this.outputCanvas, this.canvasCtx, landmarks, head, "Head");

        // Landmarks of arms: 13, 14
        let arms = [13, 14];
        this.drawPoint(this.outputCanvas, this.canvasCtx, landmarks, arms, "Arm");

        // Landmarks of hands: 19, 20
        let hands = [19, 20]
        this.drawPoint(this.outputCanvas, this.canvasCtx, landmarks, hands, "Hand");

        // Landmarks of knees: 25, 26
        let legs = [25, 26]
        this.drawPoint(this.outputCanvas, this.canvasCtx, landmarks, legs, "Leg");

        // Landmarks of feet: 31, 32
        let feet = [31, 32]
        this.drawPoint(this.outputCanvas, this.canvasCtx, landmarks, feet, "Foot");

        // Landmarks of body: 11, 12, 23, 24
        let body = [11, 12, 23, 24];
        this.drawMiddle(this.outputCanvas, this.canvasCtx, landmarks, body, "Body");
      }

      this.canvasCtx.restore();
    },
    createSolution: function()
    {
      this.solution = new Pose.Pose({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
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
