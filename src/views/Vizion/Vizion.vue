<template>
  <div id="vizion">
    <div id="name">Vizion</div>

    <video id="input" hidden="true"></video>
    <div id="hint" :hidden="hideLoader">
      <div class="inner" id="loader"></div>
      <h3 class="center" id="hint_text">Give me the pose!</h3>
      <img class="center inner" src="./../../../public/assets/vizion/v.jpg">
    </div>
    <canvas id="output" :width="canvasWidth" :height="canvasHeight" @click="pauseVideo"></canvas>

  </div>
</template>

<script>
import mixin from './mixin';

import Holistic from '@mediapipe/holistic';

export default {
  data() {
    return {
      // Options
      modelComplexity: 0,
      smoothLandmarks: true,
      minDetectionConfidence: 0.75,
      minTrackingConfidence: 0.75
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

      if (results.faceLandmarks && results.poseLandmarks)
      {
        let v = true; // If pose match with v, draw it.
        {
          // Landmarks
          let pose =  [ [12, 14, 16],    // Left arm
                        [11, 13, 15],    // Right arm
                        [24, 26, 28],    // Left leg
                        [23, 25, 27] ];  // Right leg

          for (let i = 0; i < pose.length; i++)
          {
            let angle = this.calculateAngle(this.outputCanvas, results.poseLandmarks, pose[i][0], pose[i][1], pose[i][2]);
            if (Math.abs(angle - 180) > 20)
            {
              v = false;
              break;
            }
          }
        }
        if (v) this.drawVMask(this.outputCanvas, this.canvasCtx, results.faceLandmarks);
        //TODO: Draw his outfit somehow https://i.pinimg.com/originals/db/42/e1/db42e1e873f7bdae9734c58468c70176.jpg
      }

      this.canvasCtx.restore();
    },
    createSolution: function()
    {
      this.solution = new Holistic.Holistic({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.3.1620694839/${file}`;
      }});
      this.solution.setOptions({
        modelComplexity: parseFloat(this.modelComplexity),
        smoothLandmarks: this.smoothLandmarks,
        minDetectionConfidence: parseFloat(this.minDetectionConfidence),
        minTrackingConfidence: parseFloat(this.minTrackingConfidence)
      });
      this.solution.onResults(this.onResults);
    }
  }
};
</script>

<style src='./form.css'></style>
<style>
#hint {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  height: 100%;
}

#hint_text {
  color:red;
  font-size: 30px;
}

.center {
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
}

.inner {
  position: absolute;
  z-index: -2;
}

img {
  max-width: 500px;
  height: auto;
}
</style>
