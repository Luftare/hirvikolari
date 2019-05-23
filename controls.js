const controlsApp = new Vue({
  el: '.controls',
  data: gameConfig,
  computed: {
    promilles() {
      return Math.ceil(this.drunkness * 25) / 10
    }
  },
  methods: {
    handleBreak() {
      this.breaking = true;
    },
    reset() {
      this.breaking = false;
      setupGame();
    }
  }
});