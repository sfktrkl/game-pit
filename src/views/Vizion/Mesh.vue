<template>
  <div id="mesh">
    <div id="name">Face Mesh</div>

    <div id="options">
      <div class="option">
        <label class="optionLabel" for="maxNumFaces">Maximum number of faces</label>
        <input id="maxNumFaces" type="number" min="1" max="5" step="1" v-model="maxNumFaces" @change="update" required>
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

import Mesh from '@mediapipe/face_mesh';

export default {
  data() {
    return {
      // Options
      maxNumFaces: 1,
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

      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          // V
          let headHeight = (landmarks[10].y - landmarks[152].y) * this.outputCanvas.height;
          let lineWidth = Math.abs(headHeight / 30); // Dynamically calculate the line width, so it can fit to head.
          let color = "#000000";

          // Face
          let face = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,378, 400, 377, 152,
          148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];
          this.drawFill(this.outputCanvas, this.canvasCtx, landmarks, face, "#FFFFFF");

          // Eyes
          let leftEye = [173, 157, 158, 159, 160, 161, 246, 7, 33, 163, 144, 145, 153, 154, 155, 173];
          this.drawFill(this.outputCanvas, this.canvasCtx, landmarks, leftEye, color);
          let leftEyebrow = [55, 107, 69, 104, 68];
          this.drawLines(this.outputCanvas, this.canvasCtx, landmarks, leftEyebrow, lineWidth, color);

          let rightEye = [398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382, 398];
          this.drawFill(this.outputCanvas, this.canvasCtx, landmarks, rightEye, color);
          let rightEyebrow = [285, 336, 299, 333, 298];
          this.drawLines(this.outputCanvas, this.canvasCtx, landmarks, rightEyebrow, lineWidth, color);

          // Moustache
          let leftMoustache = [164, 37, 39, 92, 206, 205];
          this.drawLines(this.outputCanvas, this.canvasCtx, landmarks, leftMoustache, lineWidth, color);

          let rightMoustache = [164, 267, 269, 322, 426, 425];
          this.drawLines(this.outputCanvas, this.canvasCtx, landmarks, rightMoustache, lineWidth, color);

          let mouche = [16, 17, 18, 200, 199, 175, 152];
          this.drawLines(this.outputCanvas, this.canvasCtx, landmarks, mouche, lineWidth * 2, color);

          // Lips
          let lips = [62, 96, 89, 179, 86, 15, 316, 403, 319, 325, 292, 272, 271, 268, 12, 38, 41, 42, 62];
          this.drawFill(this.outputCanvas, this.canvasCtx, landmarks, lips, color);
        }
      }
      this.canvasCtx.restore();
    },
    createSolution: function()
    {
      this.solution = new Mesh.FaceMesh({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      }});
      this.solution.setOptions({
        maxNumFaces: this.maxNumFaces,
        minDetectionConfidence: this.minDetectionConfidence,
        minTrackingConfidence: this.minTrackingConfidence
      });
      this.solution.onResults(this.onResults);
    }
  }
};
</script>

<style src='./form.css'></style>
