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
      images: ["beach", "sea", "sea_red", "sea_green", "sea_purple"],
      tile: { BEACH: 0, SEA: 1, RED: 2, GREEN: 3, PURPLE: 4 },
      images_: [],

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

      // Sea tile counts
      sea_tile_x: 21,
      sea_tile_y: 10,

      // Mouse locations
      m_x: 0,
      x_y: 0,
      m_tile_x: 0,
      m_tile_y: 0
    }
  },
  methods: {
    images_loaded: function () {
      return this.images.length == this.images_.length;
    },
    clear_sea: function () {
      if (!this.images_loaded())
        return;

      this.tiles = [];
      for (let i = 0; i < this.sea_tile_y; i++) {
        var row = [];
        for (let j = 0; j < this.sea_tile_x; j++) {
          if (j == 10)
            row.push(this.tile.BEACH)
          else
            row.push(this.tile.SEA);
        }
        this.tiles.push(row);
      }
      this.draw_sea();
    },
    draw_sea: function () {
      for (let i = 0; i < this.sea_tile_y; i++) {
        for (let j = 0; j < this.sea_tile_x; j++) {
          this.sea_ctx.drawImage(this.images_[this.tiles[i][j]], j * 64, i * 64, 64, 64);
        }
      }
    },
    change_tile: function (tile, tile_x, width, tile_y, height) {
      for (let i = tile_y; i < tile_y + height && i < this.sea_tile_y; i++) {
        for (let j = tile_x; j < tile_x + width && j < this.sea_tile_x; j++) {
          this.tiles[i][j] = tile;
        }
      }
    },
    round_to_multiples_of_64: function (number) {
      var remainder = number % 64;
      if (remainder == 0) return number;
      return number - remainder;
    },
    update_mouse_locations: function (e) {
      // Round to multiples of 64
      this.m_x = e.clientX - this.sea.offsetLeft;
      this.m_tile_x = this.round_to_multiples_of_64(this.m_x) / 64;
      this.m_y = e.clientY - this.sea.offsetTop;
      this.m_tile_y = this.round_to_multiples_of_64(this.m_y) / 64;
    },
    get_current_ship: function () {
      var ship = this.ships[this.ship_to_place];
      if (this.ships_rotated)
        return [ship[1], ship[0]]
      else
        return ship;
    },
    update_sea: function (e) {
      if (!this.images_loaded())
        return;

      // Clear the sea and get mouse locations
      this.clear_sea();
      this.update_mouse_locations(e);

      var leftEnd = 640, rightStart = 640 + 64;

      var tile_x = 0, width = 0;
      var tile_y = 0, height = 0;

      var tile = this.tile.SEA;
      if (this.game_state == 'placement')
      {
        // When game is in placement state,
        // Do not allow placing to left sea (enemy territory)
        // Give a red color to sea, so player can easily
        // understand it is forbidden.
        if (this.m_x <= leftEnd)
        {
          // For every tile in the sea
          tile_x = 0; width = 10;
          tile_y = 0; height = 10;
          tile = this.tile.RED;
          this.cannot_place = true;
        }
        else if (this.m_x >= rightStart)
        {
          // If mouse is in friendly territory,
          // Get the current ship which will be placed,
          // and get the tile count which will be changed.
          tile_x = this.m_tile_x; width = this.get_current_ship()[0];
          tile_y = this.m_tile_y; height = this.get_current_ship()[1];
          // Only allow placing ship, when it fits the sea
          if (tile_x + width <= this.sea_tile_x && tile_y + height <= this.sea_tile_y)
          {
            tile = this.tile.GREEN;
            this.cannot_place = false;
          }
          // Otherwise, make ship red color and forbid placing it
          else
          {
            tile = this.tile.RED;
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
          tile_x = 11; width = 10;
          tile_y = 0; height = 10;
          tile = this.tile.RED;
          this.cannot_attack = true;
        }
        else if (this.m_x <= leftEnd)
        {
          // Only one tile can be attacked
          tile_x = this.m_tile_x; width = 1;
          tile_y = this.m_tile_y; height = 1;
          // Do not allow attacking outside the sea
          if (tile_x + width <= 10 && tile_y + height <= this.sea_tile_y)
          {
            tile = this.tile.GREEN;
            this.cannot_attack = false;
          }
          else
          {
            tile = this.tile.RED;
            this.cannot_attack = true;
          }
        }
      }
      this.change_tile(tile, tile_x, width, tile_y, height);

      // Draw placed ships
      var ship_tiles = this.get_ship_tiles(this.ship_locations);
      if (ship_tiles.length > 0) {
        ship_tiles.forEach(tiles => {
            this.change_tile(this.tile.PURPLE, tiles[0], 1, tiles[1], 1);
        })
      }

      // Draw every hit tile,
      // green color for already hit empty tiles,
      // red color for hit ship's tiles
      if (this.enemy_hit_tiles.length > 0) {
        this.enemy_hit_tiles.forEach(tiles => {
            this.change_tile(tiles[2] == 1 ? this.tile.RED : this.tile.GREEN, tiles[0], 1, tiles[1], 1);
        })
      }

      this.draw_sea();
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
      // Check whether given ship tile collides with an existing one
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
          ship_tiles.push([this.m_tile_x + i, this.m_tile_y + j]);
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
        if (this.m_tile_x == enemy_hit_tile[0] && this.m_tile_y == enemy_hit_tile[1])
          return;
      }

      // Check any ship is hit,
      // if it is make that tile hit.
      var enemy_ship_tiles = this.get_ship_tiles(this.enemy_ship_locations);
      for (let i = 0; i < enemy_ship_tiles.length; i++)
      {
        var enemy_ship_tile = enemy_ship_tiles[i];
        if (this.m_tile_x == enemy_ship_tile[0] && this.m_tile_y == enemy_ship_tile[1])
          hit = 1;
      }

      this.enemy_hit_tiles.push([this.m_tile_x, this.m_tile_y, hit]);
    },
    getRandomTile: function (dir) {
      return Math.floor(Math.random() * Math.floor(dir == "x" ? 9 : 8));
    },
    generate_enemy_ships: function () {
      // Get the current ship and calculate its tiles locations
      for (let i = 0; i < this.ships.length; i++) {
        var ship_tiles = [];

        var current_ship = this.ships[i];
        var random_x = this.getRandomTile("x");
        var random_y = this.getRandomTile("y");

        var width = current_ship[0];
        var height = current_ship[1];
        // Only allow ships which fits the sea
        if (random_x + width <= this.sea_tile_x && random_y + height <= this.sea_tile_y)
        {
          for (let i = 0; i < current_ship[0]; i++) {
            for (let j = 0; j < current_ship[1]; j++) {
              ship_tiles.push([random_x + i, random_y + j]);
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
    // Load every tile image
    this.images.forEach(image => {
      const img = new Image();
      img.src = "./assets/zhips/" + image + ".png";
      img.onload = () => {
        this.images_.push(img);
        if (this.images_loaded())
          this.clear_sea();
      };
    });
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
