<template>
  <div class="app">
    <div class="outer">
      <div class="inner">
        <app-header></app-header>
        <router-view></router-view>
      </div>

      <div class="snow">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="99%"
             viewBox="0 0 1024 490" preserveAspectRatio="none">
          <g fill="#FFF" fill-opacity=".15" transform="translate(55 42)">
            <g id="snow-bottom-layer">
              <ellipse cx="6" cy="1009.5" rx="6" ry="5.5"/>
              <ellipse cx="138" cy="1110.5" rx="6" ry="5.5"/>
              <ellipse cx="398" cy="1055.5" rx="6" ry="5.5"/>
              <ellipse cx="719" cy="1284.5" rx="6" ry="5.5"/>
              <ellipse cx="760" cy="1155.5" rx="6" ry="5.5"/>
              <ellipse cx="635" cy="1459.5" rx="6" ry="5.5"/>
              <ellipse cx="478" cy="1335.5" rx="6" ry="5.5"/>
              <ellipse cx="322" cy="1414.5" rx="6" ry="5.5"/>
              <ellipse cx="247" cy="1234.5" rx="6" ry="5.5"/>
              <ellipse cx="154" cy="1425.5" rx="6" ry="5.5"/>
              <ellipse cx="731" cy="773.5" rx="6" ry="5.5"/>
              <ellipse cx="599" cy="874.5" rx="6" ry="5.5"/>
              <ellipse cx="339" cy="819.5" rx="6" ry="5.5"/>
              <ellipse cx="239" cy="1004.5" rx="6" ry="5.5"/>
              <ellipse cx="113" cy="863.5" rx="6" ry="5.5"/>
              <ellipse cx="102" cy="1223.5" rx="6" ry="5.5"/>
              <ellipse cx="395" cy="1155.5" rx="6" ry="5.5"/>
              <ellipse cx="826" cy="943.5" rx="6" ry="5.5"/>
              <ellipse cx="626" cy="1054.5" rx="6" ry="5.5"/>
              <ellipse cx="887" cy="1366.5" rx="6" ry="5.5"/>
              <ellipse cx="6" cy="241.5" rx="6" ry="5.5"/>
              <ellipse cx="138" cy="342.5" rx="6" ry="5.5"/>
              <ellipse cx="398" cy="287.5" rx="6" ry="5.5"/>
              <ellipse cx="719" cy="516.5" rx="6" ry="5.5"/>
              <ellipse cx="760" cy="387.5" rx="6" ry="5.5"/>
              <ellipse cx="635" cy="691.5" rx="6" ry="5.5"/>
              <ellipse cx="478" cy="567.5" rx="6" ry="5.5"/>
              <ellipse cx="322" cy="646.5" rx="6" ry="5.5"/>
              <ellipse cx="247" cy="466.5" rx="6" ry="5.5"/>
              <ellipse cx="154" cy="657.5" rx="6" ry="5.5"/>
              <ellipse cx="731" cy="5.5" rx="6" ry="5.5"/>
              <ellipse cx="599" cy="106.5" rx="6" ry="5.5"/>
              <ellipse cx="339" cy="51.5" rx="6" ry="5.5"/>
              <ellipse cx="239" cy="236.5" rx="6" ry="5.5"/>
              <ellipse cx="113" cy="95.5" rx="6" ry="5.5"/>
              <ellipse cx="102" cy="455.5" rx="6" ry="5.5"/>
              <ellipse cx="395" cy="387.5" rx="6" ry="5.5"/>
              <ellipse cx="826" cy="175.5" rx="6" ry="5.5"/>
              <ellipse cx="626" cy="286.5" rx="6" ry="5.5"/>
              <ellipse cx="887" cy="598.5" rx="6" ry="5.5"/>
            </g>
          </g>
          <g fill="#FFF" fill-opacity=".3" transform="translate(65 63)">
            <g id="snow-top-layer">
              <circle cx="8" cy="776" r="8"/>
              <circle cx="189" cy="925" r="8"/>
              <circle cx="548" cy="844" r="8"/>
              <circle cx="685" cy="1115" r="8"/>
              <circle cx="858" cy="909" r="8"/>
              <circle cx="874" cy="1438" r="8"/>
              <circle cx="657" cy="1256" r="8"/>
              <circle cx="443" cy="1372" r="8"/>
              <circle cx="339" cy="1107" r="8"/>
              <circle cx="24" cy="1305" r="8"/>
              <circle cx="8" cy="8" r="8"/>
              <circle cx="189" cy="157" r="8"/>
              <circle cx="548" cy="76" r="8"/>
              <circle cx="685" cy="347" r="8"/>
              <circle cx="858" cy="141" r="8"/>
              <circle cx="874" cy="670" r="8"/>
              <circle cx="657" cy="488" r="8"/>
              <circle cx="443" cy="604" r="8"/>
              <circle cx="339" cy="339" r="8"/>
              <circle cx="24" cy="537" r="8"/>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  name: 'App',
  components: {
    'app-header': Header,
  }
}
</script>

<style>
html, body, #app {
  margin: 0;
  height: 100%;
}

.app {
  height: 100%;
}

.outer {
  height: 100%;
  background: radial-gradient(ellipse at top, #008000 40%, #000B80 160%);
}

.inner {
  width: 100%;
  position: absolute;
}

.snow {
  height: 100%;
}

#snow-top-layer {
  width: 100%;
  height: 100%;
  transform: translateY(-100%);
  animation: fall 22.5s infinite linear;
}

#snow-bottom-layer {
  width: 100%;
  height: 100%;
  transform: translateY(-100%);
  animation: fall 45s infinite linear;
}

@keyframes fall {
    100% {
        transform: translateY(0);
    }
}
</style>
