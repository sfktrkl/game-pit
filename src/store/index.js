import { createStore } from 'vuex'

const store = createStore({
  state: {
    user: {
      loggedIn: false,
      data: null
    },
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
    set_user: function (state, data) {
      state.user.data = data;
      state.user.loggedIn = data !== null;
      if (state.user.loggedIn)
        state.aidl.name = state.user.data.displayName;
    },
    set_name: function(state, name) {
      state.aidl.name = name;
    },
    gain_experience: function (state, experience) {
      state.aidl.experience[0] += experience;
      if (state.aidl.experience[0] >= state.aidl.experience[1])
      {
        state.aidl.level++;
        state.aidl.experience[0] = state.aidl.experience[0] - state.aidl.experience[1];
        state.aidl.experience[1] = state.aidl.experience[1] * 1.05 ^ state.aidl.level;
      }
    }
  },
  actions: {
    fetch_user: function ({ commit }, user) {
      if (user)
        commit("set_user", { displayName: user.displayName });
      else
        commit("set_user", null);
    }
  }
});

export default store;