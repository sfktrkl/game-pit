// Use mixins to externalize popular pieces of codes
// which are used in different components.
export default {
  computed: {
    // aidl and user are usen in,
    // Main, Header and Register components
    aidl: function () {
      return this.$store.state.aidl;
    },
    user: function () {
      return this.$store.state.user;
    }
  }
}
