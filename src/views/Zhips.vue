<template>
  <div class="zhips">
    <div id="name">Zhips</div>
    <div id="instructions">Under construction :)</div>
    <canvas id="sea" tabindex="0" @mousemove="update_sea($event)"
      @mousedown="place_attack_ship()">
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
      enemy_ship_locations: [],

      // Hit tiles
      hit_tiles: [],
      enemy_hit_tiles: [],

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

      // Draw placed ships
      var ship_tiles = this.get_ship_tiles(this.ship_locations);
      if (ship_tiles.length > 0) {
        ship_tiles.forEach(tiles => {
            this.change_sea_color(this.color_reddish, tiles[0], 64, tiles[1], 64);
        })
      }

      // Draw every hit tile,
      // green color for already hit empty tiles,
      // red color for hit ship tiles
      if (this.enemy_hit_tiles.length > 0) {
        this.enemy_hit_tiles.forEach(tiles => {
            this.change_sea_color(tiles[2] == 1 ? this.color_reddish : this.color_greenish, tiles[0], 64, tiles[1], 64);
        })
      }

      this.drawing = false;
    },
    get_ship_tiles: function(ship_locations) {
      var ship_tiles = [];
      if (ship_locations) {
        ship_locations.forEach(ships => {
          for (var ship in ships) {
            ships[ship].forEach(tiles => {
              ship_tiles.push(tiles);
            });
          }
        });
      }
      return ship_tiles;
    },
    check_collision: function (existing_tiles, ship_tiles) {
      // Check whether given ship tile, collides with an existing one
      // return 1 if it is colliding.
      var existing_ship_tiles = this.get_ship_tiles(existing_tiles);
      for (let i = 0; i < existing_ship_tiles.length; i++) {
        for (let j = 0; j < ship_tiles.length; j++) {
          if (existing_ship_tiles[i][0] == ship_tiles[j][0] &&
              existing_ship_tiles[i][1] == ship_tiles[j][1])
              return 0;
        }
      }
      return 1;
    },
    place_ship: function () {
      // Get the current ship and calculate its tiles locations
      var ship_tiles = [];
      var current_ship = this.get_current_ship();
      for (let i = 0; i < current_ship[0]; i++) {
        for (let j = 0; j < current_ship[1]; j++) {
          ship_tiles.push([this.m_rounded_x + i * 64, this.m_rounded_y + j * 64]);
        }
      }

      if(!this.check_collision(this.ship_locations, ship_tiles))
        return;

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
        this.generate_enemy_ships();

        this.game_state = 'attack';
        this.cannot_place = null;
        this.cannot_attack = false;
      }
    },
    attack: function () {
      var hit = 0;
      // Check that tile is already hit.
      for (let i = 0; i < this.enemy_hit_tiles.length; i++)
      {
        var enemy_hit_tile = this.enemy_hit_tiles[i];
        if (this.m_rounded_x == enemy_hit_tile[0] && this.m_rounded_y == enemy_hit_tile[1])
          return;
      }

      // Check any ship is hit,
      // if it is make that tile hit.
      var enemy_ship_tiles = this.get_ship_tiles(this.enemy_ship_locations);
      for (let i = 0; i < enemy_ship_tiles.length; i++)
      {
        var enemy_ship_tile = enemy_ship_tiles[i];
        if (this.m_rounded_x == enemy_ship_tile[0] && this.m_rounded_y == enemy_ship_tile[1])
          hit = 1;
      }

      this.enemy_hit_tiles.push([this.m_rounded_x, this.m_rounded_y, hit]);
    },
    getRandomTile: function (dir) {
      return Math.floor(Math.random() * Math.floor(dir == "x" ? 9 : 8)) * 64;
    },
    generate_enemy_ships: function () {
      // Get the current ship and calculate its tiles locations
      for (let i = 0; i < this.ships.length; i++) {
        var ship_tiles = [];

        var current_ship = this.ships[i];
        var random_x = this.getRandomTile("x");
        var random_y = this.getRandomTile("y");

        var width = 64 * current_ship[0];
        var height = 64 * current_ship[1];
        // Only allow ships which fits the sea
        if (random_x + width <= this.sea.width && random_y + height <= this.sea.height)
        {
          for (let i = 0; i < current_ship[0]; i++) {
            for (let j = 0; j < current_ship[1]; j++) {
              ship_tiles.push([random_x + i * 64, random_y + j * 64]);
            }
          }
        }

        // If no ship tile is generated (random values
        // does not fit the sea) or generated tiles
        // collide with existing ships, reiterate.
        if(ship_tiles.length < 1 ||
          !this.check_collision(this.enemy_ship_locations, ship_tiles))
        {
          i--;
          continue;
        }

        // Store ship tiles in ship locations array
        var ship_location = {};
        ship_location[this.ship_to_place] = ship_tiles;
        this.enemy_ship_locations.push(ship_location);
      }
    },
    place_attack_ship: function () {
      if (this.cannot_place == false)
        this.place_ship();
      else if (this.cannot_attack == false)
        this.attack();
    }
  },
  created() {
    // Load canvas image,
    // It is created using, sea.png and beach.png tiles
    const img = new Image();
    img.src = "./assets/zhips/canvas.png";
    img.onload = () => {
      this.canvas_img = img;
      this.clear_sea();
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
