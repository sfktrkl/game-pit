import { createStore } from 'vuex'

const store = createStore({
  state: {
    // Informations are used to give information to user
    // about change of their stats. For example, when they
    // go to an adventure, to be able to show how much
    // experience they gained, these informations will be used.
    // They are stored here since, these informations may be needed
    // not only during the adventure also in the shop
    // and character screen.
    informations: [],
    user: {
      // When user logged in (means authentication state
      // has been changed and a user id found) update this
      // flag, so it can be used in components to enable
      // different templates.
      loggedIn: false,
      // Data will be stored in the database 
      // according to the user id's
      // So, store this in the state.
      uid: null
    },
    // State of Aidl game
    aidl: {
      // Character Name
      name: '',

      // Level and stats
      level: 1,
      gold: 100,
      experience: [0, 100],
      health: [100, 100],
      stamina: [100, 100],

      attribute_point: 5,
      // Attributes
      intelligence: 5,  // experience gain
      endurance: 5,     // health
      strength: 5,      // physical power
      dexterity: 5,     // stamina
      charisma: 5,      // influence
      luck: 5,          // just luck :)
    }
  },
  mutations: {
    set_user: function (state, uid) {
      state.user.uid = uid;
      state.user.loggedIn = uid != null;
    },
    reset_aidl: function (state, { name, aidl }) {
      // While registering, only the name information is taken from the
      // user, hence aidl will be null and can be set to default.
      // Or while signing out, name and aidl state has to be cleared.
      // So, check whether they are null or not accordin to these possibilities.
      if (name == null) name = '';
      if (aidl == null) aidl = { name: '', level: 1, gold: 100, experience: [0, 100], health: [100, 100], stamina: [100, 100],
                                attribute_point: 5, intelligence: 5, endurance: 5, strength: 5, dexterity: 5, charisma: 5, luck: 5 };
      state.aidl = aidl;
      state.aidl.name = name;
    }
  },
  actions: {
    fetch_user: function ({ commit }, user) {
      // If there is a user (after login or signup)
      // get the user id and change the login status.
      if (user)
        commit("set_user", user.uid);
      // If no user exist, probably user has signed out.
      // Clear the login status and user information.
      else
        commit("set_user", null);
    }
  }
});

export default store;