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
      setTimeout(() => {
        this.breaking = true;
      }, this.drunkness * 1500);
    },
    reset() {
      this.breaking = false;
      setupGame();
    }
  }
});