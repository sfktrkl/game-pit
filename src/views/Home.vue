<template>
  <div class="home-container">
    <figure class="card">
      <router-link class="card-link" to="/Zneyk" exact>
        <img class="card-img" src="./../../public/assets/home/zneyk.jpg" alt="zneyk" />
        <input class="card-input" type="radio" name="radio-set" checked="checked" />
        <figcaption class="card-caption">
            <div class="card-description">
              <span class="card-title">Zneyk</span>
              <span>
                Zneyk is a very simple snake game.
                Try to eat foods, do not hit any blocks which you placed and make a good score.
              </span>
            </div>
        </figcaption>
      </router-link>

      <figure class="card">
        <router-link class="card-link" to="/Zhips" exact>
          <img class="card-img" src="./../../public/assets/home/zhips.jpg" alt="zneyk" />
          <input class="card-input" type="radio" name="radio-set" />
          <figcaption class="card-caption">
            <div class="card-description">
              <span class="card-title">Zhips</span>
              <span>
                Zhips is a battleship game.
                Place your ships to tiles and attack to enemy tiles.
              </span>
            </div>
          </figcaption>
        </router-link>

        <figure class="card">
          <router-link class="card-link" to="/Aidl" exact>
            <img class="card-img" src="./../../public/assets/home/aidl.jpg" alt="zneyk" />
            <input class="card-input" type="radio" name="radio-set" />
            <figcaption class="card-caption">
              <div class="card-description">
                <span class="card-title">Aidl</span>
                <span>
                  Aidl is an idle rpg game game.
                  Create your character, go to adventures and level up!
                </span>
                <span class="card-additional">(under construction)</span>
              </div>
            </figcaption>
          </router-link>

          <figure class="card">
            <router-link class="card-link" to="/Morz" exact>
              <img class="card-img" src="./../../public/assets/home/morz.jpg" alt="zneyk" />
              <input class="card-input" type="radio" name="radio-set" />
              <figcaption class="card-caption">
                <div class="card-description">
                  <span class="card-title">Morz</span>
                  <span>
                    Morz is an application which may help you to learn morse code.
                  </span>
                </div>
              </figcaption>
            </router-link>

            <figure class="card">
              <router-link class="card-link" to="/Pass" exact>
                <img class="card-img" src="./../../public/assets/home/pass.jpg" alt="zneyk" />
                <input class="card-input" type="radio" name="radio-set" />
                <figcaption class="card-caption">
                  <div class="card-description">
                    <span class="card-title">Pass</span>
                    <span>
                      Pass is a password generator which you can create your own unique password and send encrypted version of your password to your e-mail.
                    </span>
                  </div>
                </figcaption>
              </router-link>

              <figure class="card">
                <router-link class="card-link" to="/Chat" exact>
                  <img class="card-img" src="./../../public/assets/home/chat.jpg" alt="zneyk" />
                  <input class="card-input" type="radio" name="radio-set" />
                  <figcaption class="card-caption">
                    <div class="card-description">
                      <span class="card-title">Chat</span>
                      <span>
                        Chat application which you can join to a room and chat with your friends.
                      </span>
                    </div>
                  </figcaption>
                </router-link>

                <figure class="card">
                  <router-link class="card-link" to="/Poztman" exact>
                    <img class="card-img" src="./../../public/assets/home/poztman.jpg" alt="zneyk" />
                    <input class="card-input" type="radio" name="radio-set" />
                    <figcaption class="card-caption">
                      <div class="card-description">
                        <span class="card-title">Poztman</span>
                        <span>
                          A postman clone which uses its own api.
                          Try the requests and add your words to the api.
                        </span>
                      </div>
                    </figcaption>
                  </router-link>

                  <figure class="card">
                    <router-link class="card-link" to="/Vizion" exact>
                      <img class="card-img" src="./../../public/assets/home/vizion.jpg" alt="zneyk" />
                      <input class="card-input" type="radio" name="radio-set" />
                      <figcaption class="card-caption">
                        <div class="card-description">
                          <span class="card-title">Vizion</span>
                          <span>
                            Vizion is an application which contains pose estimation, hand tracking, face detection and face meshing solutions using MediaPipe.
                          </span>
                        </div>
                      </figcaption>
                    </router-link>

                  </figure>
                </figure>
              </figure>
            </figure>
          </figure>
        </figure>
      </figure>
    </figure>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style src='./home.css'></style>