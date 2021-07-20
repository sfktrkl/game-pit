<template>
  <div id="face">
    <div id="name">Face Detection</div>

    <div id="options">
      <div class="option">
        <label class="optionLabel" for="modelSelection">Model selection</label>
        <input id="modelSelection" type="number" min="0" max="1" step="1" v-model="modelSelection" @change="update" required>
      </div>

      <div class="option">
        <label class="optionLabel" for="minDetection">Minimum detection confidence</label>
        <input id="minDetection" type="number" min="0" max="1" step="0.1" v-model="minDetectionConfidence" @change="update" required>
      </div>
    </div>

    <video id="input" hidden="true"></video>
    <div id="loader" :hidden="hideLoader"></div>
    <canvas id="output" :hidden="!hideLoader" :width="canvasWidth" :height="canvasHeight" @click="pauseVideo"></canvas>

  </div>
</template>

<script>
import mixin from './mixin';

import Face from '@mediapipe/face_detection';
import DrawingUtils from '@mediapipe/drawing_utils';

export default {
  data() {
    return {
      // Options
      modelSelection: 0,
      minDetectionConfidence: 0.5
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

      if (results.detections) {
        for (let detection of results.detections) { // There may be more than one faces
          DrawingUtils.drawRectangle(this.canvasCtx, detection.boundingBox, { color: '#00FF00', lineWidth: 2, fillColor: '#00000000' });

          // Draw score
          let score = detection.G[0].score * 100;
          let width = detection.boundingBox.width * this.outputCanvas.width;
          let height = detection.boundingBox.height * this.outputCanvas.height;
          let x = (detection.boundingBox.xCenter - detection.boundingBox.width / 2) * this.outputCanvas.width;
          let y = (detection.boundingBox.yCenter - detection.boundingBox.height / 2) * this.outputCanvas.height;
          this.drawText(this.canvasCtx, parseInt(score) + "%", x, y - 5 /* 5px offset */, "yellow", "left")

          // Fancy bounding box
          let lineWidth = 6;
          let color = "#00FF00";
          let lineLength = Math.min(height / 4, width / 4);

          // Top left corner
          this.drawLine(this.canvasCtx, { x: x, y: y + lineLength }, { x: x, y: y - lineWidth / 2 }, lineWidth, color);
          this.drawLine(this.canvasCtx, { x: x, y: y }, { x: x + lineLength, y: y }, lineWidth, color);

          // Top right corner
          this.drawLine(this.canvasCtx, { x: x + width, y: y + lineLength }, { x: x + width, y: y - lineWidth / 2 }, lineWidth, color);
          this.drawLine(this.canvasCtx, { x: x + width, y: y }, { x: x + width - lineLength, y: y }, lineWidth, color);

          // Bottom left corner
          this.drawLine(this.canvasCtx, { x: x, y: y + height - lineLength }, { x: x, y: y + height + lineWidth / 2 }, lineWidth, color);
          this.drawLine(this.canvasCtx, { x: x, y: y + height }, { x: x + lineLength, y: y + height }, lineWidth, color);

          // Bottom right corner
          this.drawLine(this.canvasCtx, { x: x + width, y: y + height - lineLength }, { x: x + width, y: y + height + lineWidth / 2 }, lineWidth, color);
          this.drawLine(this.canvasCtx, { x: x + width, y: y + height }, { x: x + width - lineLength, y: y + height }, lineWidth, color);
        }
      }
      this.canvasCtx.restore();
    },
    createSolution: function()
    {
      this.solution = new Face.FaceDetection({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.3/${file}`;
      }});
      this.solution.setOptions({
        modelSelection: this.modelSelection,
        minDetectionConfidence: this.minDetectionConfidence
      });
      this.solution.onResults(this.onResults);
    }
  }
};
</script>

<style src='./form.css'></style>
