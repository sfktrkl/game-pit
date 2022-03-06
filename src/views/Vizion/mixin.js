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
    drawVMask: function(outputCanvas, canvasCtx, landmarks)
    {
        // V
        let headHeight = (landmarks[10].y - landmarks[152].y) * outputCanvas.height;
        let lineWidth = Math.abs(headHeight / 30); // Dynamically calculate the line width, so it can fit to head.
        let color = "#000000";

        // Face
        let face = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,378, 400, 377, 152,
        148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];
        this.drawFill(outputCanvas, canvasCtx, landmarks, face, "#FFFFFF");

        // Eyes
        let leftEye = [173, 157, 158, 159, 160, 161, 246, 7, 33, 163, 144, 145, 153, 154, 155, 173];
        this.drawFill(outputCanvas, canvasCtx, landmarks, leftEye, color);
        let leftEyebrow = [55, 107, 69, 104, 68];
        this.drawLines(outputCanvas, canvasCtx, landmarks, leftEyebrow, lineWidth, color);

        let rightEye = [398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382, 398];
        this.drawFill(outputCanvas, canvasCtx, landmarks, rightEye, color);
        let rightEyebrow = [285, 336, 299, 333, 298];
        this.drawLines(outputCanvas, canvasCtx, landmarks, rightEyebrow, lineWidth, color);

        // Moustache
        let leftMoustache = [164, 37, 39, 92, 206, 205];
        this.drawLines(outputCanvas, canvasCtx, landmarks, leftMoustache, lineWidth, color);

        let rightMoustache = [164, 267, 269, 322, 426, 425];
        this.drawLines(outputCanvas, canvasCtx, landmarks, rightMoustache, lineWidth, color);

        let mouche = [16, 17, 18, 200, 199, 175, 152];
        this.drawLines(outputCanvas, canvasCtx, landmarks, mouche, lineWidth * 2, color);

        // Lips
        let lips = [62, 96, 89, 179, 86, 15, 316, 403, 319, 325, 292, 272, 271, 268, 12, 38, 41, 42, 62];
        this.drawFill(outputCanvas, canvasCtx, landmarks, lips, color);
    },
    drawCircle: function(outputCanvas, canvasCtx, landmark, radius, lineWidth = 5, color = "green",)
    {
      let x = 0, y = 0;
      x = landmark.x * outputCanvas.width;
      y = landmark.y * outputCanvas.height;
      x = parseInt(x), y = parseInt(y);
      
      canvasCtx.fillStyle = color;
      canvasCtx.lineWidth = lineWidth;
      canvasCtx.beginPath();
      canvasCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
      canvasCtx.fill();
      canvasCtx.stroke();
    },
    drawRectangle: function(canvasCtx, x, y, width, height, color)
    {
      canvasCtx.fillStyle = color;
      canvasCtx.fillRect(x, y, width, height);
    },
    calculateAngle: function(outputCanvas, landmarks, a, b, c)
    {
      let pt1 = { x: landmarks[a].x * outputCanvas.width, y: landmarks[a].y * outputCanvas.height };
      let pt2 = { x: landmarks[b].x * outputCanvas.width, y: landmarks[b].y * outputCanvas.height };
      let pt3 = { x: landmarks[c].x * outputCanvas.width, y: landmarks[c].y * outputCanvas.height };
      return (Math.atan2(pt3.y - pt2.y, pt3.x - pt2.x) - Math.atan2(pt1.y - pt2.y, pt1.x - pt2.x)) * (180 / Math.PI);
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