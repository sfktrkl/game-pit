<h1 align="center">Game Pit</h1>

<p align="center">
  <a href="https://game-pit.web.app/" >
    <img src="https://img.shields.io/github/actions/workflow/status/sfktrkl/game-pit/firebase-hosting-merge.yml" />
  </a>
  <a href="https://game-pit.vercel.app/" >
    <img src="https://img.shields.io/github/deployments/sfktrkl/game-pit/production?label=poztman-server" />
  </a>
  <a href="https://game-pit-chat-server.vercel.app/" >
    <img src="https://img.shields.io/github/deployments/sfktrkl/game-pit/game-pit-chat-server?label=chat-server" />
  </a>
  <a href="https://hub.docker.com/r/sfktrkl/game-pit" >
    <img src="https://img.shields.io/docker/pulls/sfktrkl/game-pit" />
  </a>
  <a href="https://hub.docker.com/r/sfktrkl/game-pit" >
    <img src="https://img.shields.io/docker/image-size/sfktrkl/game-pit" />
  </a>
</p>

## Setup and Build

```
# install dependencies
npm install

# Compile and hot reload
npm run serve

# Compile for production with minification
npm run build

# Lints and fixes files
npm run lint

# Vue router
npm i vue-router@next

# Vuex
npm i vuex@next

# Firebase
npm i firebase

# axios
npm i axios

# CryptoJS
npm i crypto-js

# Font Awesome
npm i @fortawesome/fontawesome-free

# body-parser
npm i body-parser

# xlsx
npm i xlsx

# Mediapipe utils
npm i @mediapipe/camera_utils
npm i @mediapipe/drawing_utils
npm i @mediapipe/control_utils

# Mediapipe hands
npm i @mediapipe/hands

# Mediapipe pose
npm i @mediapipe/pose

# Mediapipe face detection
npm i @mediapipe/face_detection@0.3

# Mediapipe face mesh
npm i @mediapipe/face_mesh

# Mediapipe holistic
npm i @mediapipe/holistic@0.3

# Docker build
docker build -t sfktkl/game-pit .

# Docker run
docker run -p 8000:80 sfktrkl/game-pit

# wasm-pack-plugin
npm i @wasm-tool/wasm-pack-plugin

# text-encoding
npm i text-encoding
```
