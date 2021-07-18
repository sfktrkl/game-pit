<template>
  <div id="hand">
    <div id="name">Hand Tracking</div>

    <div id="options">
      <label for="maxNumHands">Maximum number of hands </label>
      <input id="maxNumHands" type="number" min="1" max="5" step="1" v-model="maxNumHands" @change="updateHands" required>
      <label for="minDetection">  Minimum detection confidence </label>
      <input id="minDetection" type="number" min="0" max="1" step="0.1" v-model="minDetectionConfidence" @change="updateHands" required>
      <label for="minTracking">  Minimum tracking confidence </label>
      <input id="minTracking" type="number" min="0" max="1" step="0.1" v-model="minTrackingConfidence" @change="updateHands" required>
    </div>

    <video id="input" hidden="true"></video>
    <div id="loader" :hidden="hideLoader"></div>
    <canvas id="output" :width="canvasWidth" :height="canvasHeight"></canvas>

  </div>
</template>

<script>
import Hands from '@mediapipe/hands';
import CameraUtils from '@mediapipe/camera_utils';
import DrawingUtils from '@mediapipe/drawing_utils';

export default {
  data() {
    return {
      hideLoader: false,

      canvasWidth: 1280,
      canvasHeight: 720,

      currentTime: 1,
      previousTime: 0,

      maxNumHands: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    };
  },
  methods: {
    onResults: function(results)
    {
      this.canvasCtx.save();
      this.canvasCtx.clearRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);
      this.canvasCtx.drawImage(results.image, 0, 0, this.outputCanvas.width, this.outputCanvas.height);

      // Show fps
      this.currentTime = new Date();
      let fps = parseInt(1000 / (this.currentTime - this.previousTime));
      this.previousTime = this.currentTime;
      this.canvasCtx.font = "20px Comic Sans MS";
      this.canvasCtx.fillStyle = "lightgreen";
      this.canvasCtx.fillText("FPS: " + fps, 10, 20);

      // Hide loader when canvas rendered for the first time
      this.hideLoader = true;

      // Draw hand marks
      if (results.multiHandLandmarks) {
        for (let landmarks of results.multiHandLandmarks) {
          DrawingUtils.drawConnectors(this.canvasCtx, landmarks, Hands.HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
          DrawingUtils.drawLandmarks(this.canvasCtx, landmarks, {color: '#FF0000', lineWidth: 5});

          // Landmarks of palm of hand
          // 0, 5, 9, 13, 17
          let x = 0, y = 0;
          let palm = [0, 5, 9, 13, 17];
          for (let mark of palm)
          {
            let coordinates = landmarks[mark];
            x += coordinates.x / palm.length * this.outputCanvas.width;
            y += coordinates.y / palm.length * this.outputCanvas.height;
          }

          x = parseInt(x), y = parseInt(y);
          this.canvasCtx.font = "20px Comic Sans MS";
          this.canvasCtx.fillStyle = "blue";
          this.canvasCtx.textAlign = "center";
          this.canvasCtx.fillText(x + ", " + y, x, y);
        }
      }
      this.canvasCtx.restore();
    },
    updateHands: function()
    {
      this.hands.setOptions({
        maxNumHands: parseFloat(this.maxNumHands),
        minDetectionConfidence: parseFloat(this.minDetectionConfidence),
        minTrackingConfidence: parseFloat(this.minTrackingConfidence)
      });
    }
  },
  mounted() {
    this.outputCanvas = document.getElementById("output");
    this.inputVideo = document.getElementById("input");
    this.canvasCtx = this.outputCanvas.getContext("2d");

    console.log(this.outputCanvas);
    console.log(this.canvasCtx);

    this.hands = new Hands.Hands({ locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    this.hands.onResults(this.onResults);
    this.updateHands();

    this.camera = new CameraUtils.Camera(this.inputVideo, {
      onFrame: async () => { await this.hands.send({ image: this.inputVideo }); },
    });
    this.camera.start();
  }
};
</script>

<style src='./form.css'></style>
<style scoped>
#options {
  margin: auto;
  text-align: center;
}
</style>