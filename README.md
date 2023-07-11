<h1 align="center">Game Pit</h1>

<p align="center">
  <a href="https://game-pit.web.app/" >
    <img src="https://img.shields.io/github/actions/workflow/status/sfktrkl/game-pit/firebase-hosting-merge.yml" />
  </a>
  <a href="https://game-pit.web.app/Chat" >
    <img src="https://img.shields.io/website?down_message=offline&label=chat-server&up_message=online&url=https%3A%2F%2Fgame-pit-chat-server.herokuapp.com%2F" />
  </a>
  <a href="https://game-pit.web.app/Poztman" >
    <img src="https://img.shields.io/website?down_message=offline&label=poztman-server&up_message=online&url=https%3A%2F%2Fgame-pit-poztman-server.herokuapp.com%2F" />
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
