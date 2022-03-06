<template>
  <div id="vneyk">
    <div id="name">Vneyk</div>
    <div id="instructions">
      Vneyk is a very simple snake game.<br>
    </div>

    <video id="input" hidden="true"></video>
    <div id="loader" :hidden="hideLoader"></div>
    <canvas id="output" :hidden="!hideLoader" :width="canvasWidth" :height="canvasHeight" @click="pauseVideo"></canvas>

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
        this.drawHand(results);
      });

      this.drawFps();
      this.canvasCtx.restore();
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
