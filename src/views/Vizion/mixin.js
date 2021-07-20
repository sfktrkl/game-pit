// We can use mixins to externalize popular pieces of codes
// which are used in different components.
import CameraUtils from '@mediapipe/camera_utils';

export default {
  data() {
    return {
      // To hide/show loader
      hideLoader: false,

      // Initial dimensions of canvas,
      // they will be updated during updateView
      canvasWidth: 1280,
      canvasHeight: 720,

      // Used during drawFps method
      currentTime: 1,
      previousTime: 0,
    };
  },
  props: {
    cameraEnabled: { type: Boolean },
    filePath: { type: String }
  },
  methods: {
    drawFps: function() {
      // Show fps
      this.currentTime = new Date();
      let fps = parseInt(1000 / (this.currentTime - this.previousTime));
      this.previousTime = this.currentTime;
      this.canvasCtx.font = "20px Comic Sans MS";
      this.canvasCtx.fillStyle = "lightgreen";
      this.canvasCtx.fillText("FPS: " + fps, 10, 20);

      // Hide loader when canvas rendered for the first time
      this.hideLoader = true;
    },
    drawLine: function(canvasCtx, moveTo, lineTo, lineWidth, color) {
      canvasCtx.lineWidth = lineWidth;
      canvasCtx.strokeStyle = color;

      canvasCtx.beginPath();
      canvasCtx.moveTo(moveTo.x, moveTo.y);
      canvasCtx.lineTo(lineTo.x, lineTo.y);
      canvasCtx.stroke();
    },
    drawLines: function(outputCanvas, canvasCtx, landmarks, array, lineWidth, color) {
      canvasCtx.lineWidth = lineWidth;
      canvasCtx.strokeStyle = color;
      canvasCtx.beginPath();
      for (let i = 0; i < array.length; i++)
      {
        let coord = landmarks[array[i]];
        let x = coord.x * outputCanvas.width;
        let y = coord.y * outputCanvas.height;
        this.canvasCtx.lineTo(x, y);
      }
      canvasCtx.stroke();
    },
    drawFill: function(outputCanvas, canvasCtx, landmarks, array, color) {
      canvasCtx.fillStyle = color;
      canvasCtx.beginPath();
      for (let i = 0; i < array.length; i++)
      {
        let coord = landmarks[array[i]];
        let x = coord.x * outputCanvas.width;
        let y = coord.y * outputCanvas.height;
        this.canvasCtx.lineTo(x, y);
      }
      canvasCtx.closePath();
      canvasCtx.fill();
    },
    drawText: function(canvasCtx, text, x, y, color = "yellow", alignment = "center") {
      canvasCtx.font = "20px Comic Sans MS";
      canvasCtx.fillStyle = color;
      canvasCtx.textAlign = alignment;
      canvasCtx.fillText(text, x, y);
    },
    drawMiddle: function(outputCanvas, canvasCtx, landmarks, array, text, color = "yellow", alignment = "center")
    {
      let x = 0, y = 0;
      for (let mark of array)
      {
        let coordinates = landmarks[mark];
        x += coordinates.x / array.length * outputCanvas.width;
        y += coordinates.y / array.length * outputCanvas.height;
      }

      x = parseInt(x), y = parseInt(y);
      this.drawText(canvasCtx, text, x, y, color, alignment);
    },
    drawPoint: function(outputCanvas, canvasCtx, landmarks, array, text, color = "yellow", alignment = "center")
    {
      let x = 0, y = 0;
      for (let mark of array)
      {
        let coordinates = landmarks[mark];
        x = coordinates.x * outputCanvas.width;
        y = coordinates.y * outputCanvas.height;
        x = parseInt(x), y = parseInt(y);
        this.drawText(canvasCtx, text, x, y, color, alignment);
      }
    },
    pauseVideo: function()
    {
      if (!this.inputVideo.paused)
        this.inputVideo.pause();
      else
        this.inputVideo.play();
    },
    update: function() {
      this.updateView(this.cameraEnabled, this.filePath);
    },
    cameraOnFrame: async function () {
      await this.solution.send({ image: this.inputVideo });
    },
    updateView: function(cameraEnabled, filePath)
    {
      this.hideLoader = false;

      // Delete them properly, otherwise it is causing memory leak
      delete this.solution;
      delete this.inputVideo;
      delete this.timerCallback;
      if (this.camera)
      {
        // video property has to be removed first to stop the camera
        // since camera doesn't have a stop method.
        this.camera.video = null;
        delete this.camera;
      }

      this.createSolution();
      this.inputVideo = document.createElement("video");

      if (cameraEnabled)
      {
        this.camera = new CameraUtils.Camera(this.inputVideo, { onFrame: this.cameraOnFrame });
        this.camera.start();
      }
      else
      {
        if (filePath != "")
        {
          this.inputVideo.src = filePath;
          this.inputVideo.autoplay = true;
          this.inputVideo.muted = true;
          this.inputVideo.loop = true;

          const timerCallback = async () => {
            if (this.inputVideo.paused)
              return;

            await this.solution.send({ image: this.inputVideo });
            setTimeout(() => { timerCallback(); }, 0);
          };

          this.inputVideo.addEventListener('playing', async () => {
            timerCallback();
          });
        }
      }

      this.inputVideo.addEventListener("loadedmetadata", () => {
        this.canvasHeight = this.inputVideo.videoHeight;
        this.canvasWidth = this.inputVideo.videoWidth;
      });
    }
  },
  mounted() {
    this.outputCanvas = document.getElementById("output");
    this.inputVideo = document.getElementById("input");
    this.canvasCtx = this.outputCanvas.getContext("2d");

    this.updateView(this.cameraEnabled, this.filePath);
  },
  beforeUnmount() {
    this.inputVideo = null;
    this.solution = null;
    this.camera = null;
  }
  
}