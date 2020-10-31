<template>
  <div class="zhips">
    <div id="name">Zhips</div>
    <div id="instructions">
      Zhips is a battleship game. Place your ships to tiles and attack to enemy tiles.
      There are two stages of game which are Placement Stage and Attack Stage.<br>
      <b>Placement Stage:</b> Ships have to be placed to friendly territory (right sea).
      To place the ships use left mouse button and to rotate them before place use middle mouse button.<br>
      During placement stage, <span style="color: green">Green</span> shows allowable moves,
      <span style="color: purple">Purple</span> shows placed ships,
      <span style="color: red">Red</span> shows forbidden moves.<br>
      <b>Attack Stage:</b> Attack the enemy territory (left sea) using left mouse button.
      Every ship tile which will be hit will count as 10 score.
      First player to reach 200 score will win.<br>
      During attack stage, <span style="color: green">Green</span> shows empty tiles and allowable moves,
      <span style="color: purple">Purple</span> shows your ships,
      <span style="color: red">Red</span> shows hit tiles and forbidden moves
    </div>
    <div id="game_state">{{get_game_state()}}</div>
    <div id="scores">
      <div id="player_score">Your Score: {{player_score}}</div>
      <div id="enemy_score">Enemy Score: {{enemy_score}}</div>
    </div>
    <canvas id="sea" tabindex="0" @mousemove="update_sea($event)"
      @mousedown="place_attack_ship($event)">
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
      m_tile_y: 0,

      // Scores
      enemy_score: 0,
      player_score: 0
    }
  },
  methods: {
    load_image: function (image) {
      const img = new Image();
      img.src = "./assets/zhips/" + image + ".png";
      img.onload = () => {
        this.images_.push(img);
        this.images.shift();
        if (this.images_loaded())
          this.clear_sea();
        else
          // Load images recursively to keep their order.
          this.load_image(this.images[0]);
      };
    },
    images_loaded: function () {
      return !this.images.length;
    },
    end_game: function (state) {
      this.game_state = state;
      this.cannot_place = true;
      this.cannot_attack = true;
    },
    get_game_state: function () {
      if (this.game_state == "placement")
        return "Placement Stage";
      else if (this.game_state == "attack")
        return "Attack Stage";
      else if (this.game_state == "win")
        return "You Win!"
      else if (this.game_state == "lose")
        return "You Lose!"
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
          var current_ship = this.get_current_ship();
          tile_x = this.m_tile_x; width = current_ship[0];
          tile_y = this.m_tile_y; height = current_ship[1];
          // Only allow placing ship, when it fits the sea
          // and when it does not collide with existing one.
          var current_ship_tiles = this.get_current_ship_tiles(current_ship, tile_x, tile_y);
          if (tile_x + width <= this.sea_tile_x && tile_y + height <= this.sea_tile_y &&
             !this.check_collision(this.ship_locations, current_ship_tiles))
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
      // Both player's and enemies' tiles are drawn.
      if (this.enemy_hit_tiles.length > 0) {
        this.enemy_hit_tiles.forEach(tiles => {
          this.change_tile(tiles[2] == 1 ? this.tile.RED : this.tile.GREEN, tiles[0], 1, tiles[1], 1);
        });
      }

      if (this.hit_tiles.length > 0) {
        this.hit_tiles.forEach(tiles => {
          this.change_tile(tiles[2] == 1 ? this.tile.RED : this.tile.GREEN, tiles[0], 1, tiles[1], 1);
        });
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
              return 1;
        }
      }
      return 0;
    },
    get_current_ship_tiles: function (current_ship, tile_x, tile_y) {
      var ship_tiles = [];
      for (let i = 0; i < current_ship[0]; i++) {
        for (let j = 0; j < current_ship[1]; j++) {
          ship_tiles.push([tile_x + i, tile_y + j]);
        }
      }
      return ship_tiles;
    },
    place_ship: function () {
      // Get the current ship and calculate its tiles locations
      var current_ship = this.get_current_ship();
      var ship_tiles = this.get_current_ship_tiles(current_ship, this.m_tile_x, this.m_tile_y);

      if(this.check_collision(this.ship_locations, ship_tiles))
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
        {
          hit = 1;
          this.player_score += 10;
          // If player reaches 200 score, finish game.
          if (this.player_score >= 200)
            this.end_game("win");
        }
      }

      this.enemy_hit_tiles.push([this.m_tile_x, this.m_tile_y, hit]);
      this.enemy_attack();
    },
    get_random_int: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min; // max exculuded
    },
    generate_enemy_ships: function () {
      // Get the current ship and calculate its tiles locations
      for (let i = 0; i < this.ships.length; i++) {
        var ship_tiles = [];

        var current_ship = this.ships[i];
        var random_x = this.get_random_int(0, 10);
        var random_y = this.get_random_int(0, 10);
        // Rotate the ship randomly
        if (this.get_random_int(0, 2))
          current_ship = [current_ship[1], current_ship[0]];

        var width = current_ship[0];
        var height = current_ship[1];
        // Only allow ships which fits the sea
        if (random_x + width <= 10 && random_y + height <= this.sea_tile_y)
          ship_tiles = this.get_current_ship_tiles(current_ship, random_x, random_y);

        // If no ship tile is generated (random values
        // does not fit the sea) or generated tiles
        // collide with existing ships, reiterate.
        if(ship_tiles.length < 1 ||
          this.check_collision(this.enemy_ship_locations, ship_tiles))
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
    is_already_hit: function (tile_x, tile_y) {
      // Check that tile is already hit
      for (let i = 0; i < this.hit_tiles.length; i++)
        if (tile_x == this.hit_tiles[i][0] && tile_y == this.hit_tiles[i][1])
          return true;
      return false;
    },
    enemy_predict: function (tile_x, tile_y, directions, check_similar) {
      var predicted_x = tile_x;
      var predicted_y = tile_y;
      if (directions.length >= 1)
      {
        // Check last four move, if there is any move
        // which hits any ship, try to find a pattern
        // or hit an adjacent tile.
        for (let i = 1; i <= 4 && this.hit_tiles.length >= i; i++)
        {
          var last_hit = this.hit_tiles[this.hit_tiles.length - i];
          if (last_hit[2] == 1)
          {
            // If similar history is exist, choose the same direction.
            var similar_found = false;
            if (check_similar)
            {
              for (let j = 1; j <= 4 && this.hit_tiles.length >= i + j; j++)
              {
                var previous_hit = this.hit_tiles[this.hit_tiles.length - i - j];
                if (previous_hit[2] == 1)
                {
                  // Get the difference of those two moves,
                  var diff_x = previous_hit[0] - last_hit[0];
                  var diff_y = previous_hit[1] - last_hit[1];
                  // If they are adjacent tiles,
                  // hit a tile in the same direction.
                  if (Math.abs(diff_x) + Math.abs(diff_y) == 1)
                  {
                    similar_found = true;
                    check_similar = false;
                    // Try going forward to last hit's direction.
                    // It may hit another tile, in that case, next iteration
                    // will find the same direction again.
                    predicted_x = last_hit[0] - diff_x;
                    predicted_y = last_hit[1] - diff_y;

                    // Or tile may be empty and in the next iteration
                    // same tiles and direction will be found from history.
                    // This time since next tile in last hit's direction is already
                    // hit, try to go in backwards direction to prev's direction.
                    if (this.is_already_hit(predicted_x, predicted_y))
                    {
                      predicted_x = previous_hit[0] + diff_x;
                      predicted_y = previous_hit[1] + diff_y;
                    }
                  }
                }
              }
            }

            // If there is no similarity found in the history,
            // Select an adjacent tile to last hit location.
            if (similar_found == false)
            {
              check_similar = false;
              // 0 right, 1 left, 2 up, 3 down
              var direction = directions[this.get_random_int(0, directions.length)];
              switch(direction) {
                case 0:
                  predicted_x = last_hit[0] + 1;
                  predicted_y = last_hit[1];
                  break;
                case 1:
                  predicted_x = last_hit[0] - 1;
                  predicted_y = last_hit[1];
                  break;
                case 2:
                  predicted_x = last_hit[0];
                  predicted_y = last_hit[1] - 1;
                  break;
                case 3:
                  predicted_x = last_hit[0];
                  predicted_y = last_hit[1] + 1;
                  break;
              }
              // Remove the selected direction, so if this move
              // is not valid, next iteration will not try it.
              directions.splice(directions.indexOf(direction), 1);
            }

            // Check that tile is inside the sea
            if (predicted_x < 21 && predicted_x > 10 && predicted_y < 10 && predicted_y > -1)
            {
              // Check that tile is already hit
              if (this.is_already_hit(predicted_x, predicted_y))
                  return this.enemy_predict(tile_x, tile_y, directions, check_similar);
              return [predicted_x, predicted_y];
            }
            else
              return this.enemy_predict(tile_x, tile_y, directions, check_similar);
          }
        }
      }

      // Check that tile is already hit
      if (this.is_already_hit(predicted_x, predicted_y))
          return this.enemy_predict(this.get_random_int(11, 21), this.get_random_int(0, 10), directions, check_similar);
      return [tile_x, tile_y];
    },
    enemy_attack: function () {
      var prediction = this.enemy_predict(this.get_random_int(11, 21),
       this.get_random_int(0, 10), [0, 1, 2, 3], true);
      var tile_x = prediction[0];
      var tile_y = prediction[1];

      // Check any ship is hit,
      // If it is, make that tile hit.
      var hit = 0;
      var ship_tiles = this.get_ship_tiles(this.ship_locations);
      for (let i = 0; i < ship_tiles.length; i++)
      {
        var ship_tile = ship_tiles[i];
        if (tile_x == ship_tile[0] && tile_y == ship_tile[1])
        {
          hit = 1;
          this.enemy_score += 10;
          // If enemy reaches 200 score, finish game
          if (this.enemy_score >= 200)
            this.end_game("lose");
        }
      }

      this.hit_tiles.push([tile_x, tile_y, hit]);
    },
    place_attack_ship: function (e) {
      if (this.cannot_place == false)
      {
        if (e.button == 1)
          this.ships_rotated = !this.ships_rotated;
        else
          this.place_ship()
      }
      else if (this.cannot_attack == false)
        this.attack();
    }
  },
  created() {
    // Load every tile image
    // load_image is a recursive function.
    this.load_image(this.images[0]);
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
}
#game_state {
  color: blue;
  text-align: center;
  font-size: 30px;
  padding-top: 10px;
}
#scores {
  text-align: center;
  font-size: 30px;
  padding-bottom: 10px;
}
#player_score {
  color: green;
  display: inline-block;
  margin: 0px 240px;
}
#enemy_score {
  color: red;
  display: inline-block;
  margin: 0px 240px;
}
</style>
