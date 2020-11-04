import { createStore } from 'vuex'

const store = createStore({
  state: {
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
      experience: [0, 100],
      health: [100, 100],
      stamina: [100, 100]
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
      if (aidl == null) aidl = { name: '', level: 1, experience: [0, 100], health: [100, 100], stamina: [100, 100] };
      state.aidl.name = name;
      state.aidl.level = aidl.level;
      state.aidl.experience = aidl.experience;
      state.aidl.health = aidl.health;
      state.aidl.stamina = aidl.stamina;
    },
    gain_experience: function (state, experience) {
      state.aidl.experience[0] += experience;
      if (state.aidl.experience[0] >= state.aidl.experience[1])
      {
        state.aidl.level++;
        state.aidl.experience[0] = state.aidl.experience[0] - state.aidl.experience[1];
        state.aidl.experience[1] = state.aidl.experience[1] * 1.05 ^ state.aidl.level;
      }
    },
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