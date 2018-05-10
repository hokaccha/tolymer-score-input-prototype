/* eslint-disable */
new Vue({
  el: '#app',
  data: {
    viewMode: 'list',
    members: [
      'hokaccha',
      '1000ch',
      'hiloki',
      'tan-yuki',
    ],
    games: [
      { id: 1, scores: [41, 11, -35, -17] },
      { id: 2, scores: [-51, 48, 16, -13] },
      { id: 3, scores: [0, -24, -51, 75] },
      { id: 4, scores: [-13, -38, 9, 42] },
      { id: 5, scores: [-16, 11, -50, 55] },
    ],
    inputScores: [null, null, null, null],
    updateGame: null,
  },
  methods: {
    calcTotalScores() {
      return this.games.reduce((acc, game) => {
        game.scores.forEach((score, i) => {
          if (acc[i] == null) {
            acc[i] = 0
          } else {
            acc[i] += score;
          }
        });
        return acc;
      }, []);
    },
    toNewScore() {
      this.switchViewTo('form');
    },
    toEditScore(game) {
      this.switchViewTo('form');
      this.updateGame = game;
      const topScore = Math.max(...game.scores);
      this.inputScores = game.scores.map(s => s === topScore ? 'top' : s);
    },
    switchViewTo(view) {
      this.inputScores = [null, null, null, null];
      this.updateGame = null;
      this.viewMode = view;
    },
    save() {
      if (!this.isValidInput()) return;

      const scores = this.inputScores.map(s => s === 'top' ? this.topScore() : Number(s));

      if (this.updateGame) {
        this.games.find(g => g.id === this.updateGame.id).scores = scores;
      }
      else {
        this.games.push({ id: this.games.length + 1, scores })
      }

      this.switchViewTo('list');
    },
    cancel() {
      this.switchViewTo('list');
    },
    onInputScore() {
      // 'top'という値は入力されていないとみなす
      // 0 は入力されているとみなす
      const isExistScore = score => score === 0 || (score && score !== 'top');

      // 入力されているフィールドの値だけを抽出
      const existingScores = this.inputScores.filter(isExistScore);

      if (existingScores.length < 3) {
        // 入力が3未満の場合はまだ不完全
        // 全部入力済みの状態でどこかが消された場合は'top'がある状態でここにくるので'top'をnullに戻す
        this.inputScores = this.inputScores.map(s => isExistScore(s) ? s : null);
      }
      else if (existingScores.length === 3) {
        // 入力が3以上の場合はトップ以外入力済み
        this.inputScores = this.inputScores.map(s => s === 0 || s ? s : 'top');
      }
      else {
        throw new Error('Invalid input');
      }
    },
    topScore() {
      const amount = this.inputScores.map(s => Number(s) || 0).reduce((acc, v) => acc + v, 0);
      return amount < 0 ? -amount : null;
    },
    isValidInput() {
      const existingScores = this.inputScores.filter(s => s === 0 || (s && s !== 'top'));
      if (existingScores.length !== 3) return false;

      const topScore = this.topScore();
      const secondScore = Math.max(...existingScores.map(Number));

      // 1位より2位のほうが点数が大きい場合はinvalid
      return topScore && secondScore && topScore > secondScore;
    },
  },
});
