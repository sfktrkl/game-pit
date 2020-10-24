<template>
  <div class="zhips">
    <div id="name">Zhips</div>
    <div id="instructions">Under construction :)</div>
    <canvas id="sea" tabindex="0" @mousemove="update_sea($event)"
      @mousedown="place_ship($event)">
    </canvas>
  </div>
</template>

<script>
export default {
  data () {
    return {
      canvas_img: null,

      // Initial game state
      game_state: 'placement',
      cannot_place: false,
      cannot_attack: true,

      // Ship information to place them
      ships: [[1, 2], [1, 3], [1, 3], [1, 4], [2, 4]],
      ships_rotated: false,
      ship_to_place: 0,

      // Locations of ships
      ship_locations: [],

      // Color multipliers
      color_default: [1, 1, 1],
      color_greenish: [0.3, 1, 0.3],
      color_reddish: [2, 0.3, 0.3],

      // Mouse locations
      m_x: 0,
      x_y: 0,
      m_rounded_x: 0,
      m_rounded_y: 0
    }
  },
  methods: {
    clear_sea: function () {
      if (!this.canvas_img)
        return;

      this.sea_ctx.drawImage(this.canvas_img, 0, 0, this.sea.width, this.sea.height);
    },
    change_sea_color: function (color, dx, width, dy, height) {
      // top left x, y; rectange width, height
      var image_data = this.sea_ctx.getImageData(dx, dy, width, height);
      for (var t = 0; t < image_data.data.length; t += 4) {
        image_data.data[t] = color[0] * image_data.data[t];
        image_data.data[t+1] = color[1] * image_data.data[t + 1];
        image_data.data[t+2] = color[2] * image_data.data[t + 2];
      }
      // top left x, y; top left which image will be extracted; rectangle width, height
      this.sea_ctx.putImageData(image_data, dx, dy, 0, 0, width, height);
    },
    round_to_multiples_of_64: function (number) {
      var remainder = number % 64;
      if (remainder == 0) return number;
      return number - remainder;
    },
    update_mouse_locations: function (e) {
      // Round to multiples of 64
      this.m_x = e.clientX - this.sea.offsetLeft;
      this.m_rounded_x = this.round_to_multiples_of_64(this.m_x);
      this.m_y = e.clientY - this.sea.offsetTop;
      this.m_rounded_y = this.round_to_multiples_of_64(this.m_y);
    },
    get_current_ship: function () {
      var ship = this.ships[this.ship_to_place];
      if (this.ships_rotated)
        return [ship[1], ship[0]]
      else
        return ship;
    },
    update_sea: function (e) {
      // Clear the sea and get mouse locations
      this.clear_sea();
      this.update_mouse_locations(e);

      // Do not update sea, when mouse is located at beach
      var leftEnd = 640, rightStart = 640 + 64;
      if (this.m_x < rightStart && this.m_x > leftEnd)
        return;

      var dx = 0, width = 0;
      var dy = 0, height = 0;

      var color = this.color_default;
      if (this.game_state == 'placement')
      {
        // When game is in placement state,
        // Do not allow placing to left sea (enemy territory)
        // Give a red color to sea, so player can easily
        // understand it is forbidden.
        if (this.m_x <= leftEnd)
        {
          // For every tile in the sea
          dx = 0; width = 64 * 10;
          dy = 0; height = 64 * 10;
          color = this.color_reddish;
          this.cannot_place = true;
        }
        else if (this.m_x >= rightStart)
        {
          // If mouse is in friendly territory,
          // Get the current ship which will be placed,
          // and calculate image width which will be changed.
          dx = this.m_rounded_x; width = 64 * this.get_current_ship()[0];
          dy = this.m_rounded_y; height = 64 * this.get_current_ship()[1];
          // Only allow placing ship, when it fits the sea
          if (dx + width <= this.sea.width && dy + height <= this.sea.height)
          {
            color = this.color_greenish;
            this.cannot_place = false;
          }
          // Otherwise, make ship red color and forbid placing it
          else
          {
            color = this.color_reddish;
            this.cannot_place = true;
          }
        }
      }
      else if (this.game_state == 'attack')
      {
        // Do not allow attacking to right sea (friendly territory)
        if (this.m_x >= rightStart)
        {
          // For every tile in the sea
          dx = rightStart; width = 64 * 10;
          dy = 0; height = 64 * 10;
          color = this.color_reddish;
          this.cannot_attack = true;
        }
        else if (this.m_x <= leftEnd)
        {
          // Only one tile can be attacked
          dx = this.m_rounded_x; width = 64;
          dy = this.m_rounded_y; height = 64;
          // Do not allow attacking outside the sea
          if (dx + width <= leftEnd && dy + height <= this.sea.height)
          {
            color = this.color_greenish;
            this.cannot_attack = false;
          }
          else
          {
            color = this.color_reddish;
            this.cannot_attack = true;
          }
        }
      }
      this.change_sea_color(color, dx, width, dy, height);
    },
    place_ship: function () {
      if (this.cannot_place)
        return;

      // Get the current ship and calculate its tiles locations
      var ship_tiles = [];
      var current_ship = this.get_current_ship();
      for (let i = 0; i < current_ship[0]; i++) {
        for (let j = 0; j < current_ship[1]; j++) {
          ship_tiles.push([this.m_rounded_x + i * 64, this.m_rounded_y + j * 64]);
        }
      }

      // Store ship tiles in ship locations array
      var ship_location = {};
      ship_location[this.ship_to_place] = ship_tiles;
      this.ship_locations.push(ship_location);

      // Start placing next ship
      this.ship_to_place += 1;

      // If there is no other ship to be placed
      // start attacking to enemy.
      if (this.ship_to_place >= this.ships.length)
      {
        this.game_state = 'attack';
        this.cannot_place = null;
        this.cannot_attack = false;
      }
    }
  },
  created() {
    // Load canvas image,
    // It is created using, sea.png and beach.png tiles
    const img = new Image();
    img.src = "./assets/zhips/canvas.png";
    img.onload = () => {
      this.canvas_img = img;
    };
  },
  mounted() {
    // Create a high dpi canvas
    this.sea = document.getElementById("sea");
    var rect = this.sea.getBoundingClientRect();
    var dpr = (window.devicePixelRatio || 1);
    this.sea.width = rect.width * dpr;
    this.sea.height = rect.height * dpr;
    this.sea_ctx = this.sea.getContext("2d");
  }
}
</script>

<style scoped>
#sea {
  padding-left: 0;
  padding-right: 0;
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 1344px;
  height: 640px;
}
#name {
  text-align: center;
  font-size: 50px;
}
#instructions {
  text-align: center;
  font-size: 20px;
  padding-bottom: 10px;
}
</style>
