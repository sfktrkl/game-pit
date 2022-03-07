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

      if (results.multiFaceLandmarks)
        for (const landmarks of results.multiFaceLandmarks)
          this.drawVMask(this.outputCanvas, this.canvasCtx, landmarks);
      this.canvasCtx.restore();
    },
    createSolution: function()
    {
      this.solution = new Mesh.FaceMesh({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1626476802/${file}`;
      }});
      this.solution.setOptions({
        maxNumFaces: parseFloat(this.maxNumFaces),
        minDetectionConfidence: parseFloat(this.minDetectionConfidence),
        minTrackingConfidence: parseFloat(this.minTrackingConfidence)
      });
      this.solution.onResults(this.onResults);
    }
  }
};
</script>

<style src='./form.css'></style>
