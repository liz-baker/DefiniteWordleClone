const { WordStore } = require('./word_store');

/**
 * Class to represent the game logic
 */
class Game {
  constructor() {
    this.store = new WordStore();
  }

  async getCurrentWord(size) {
    return this.store.getCurrentWord(size);
  }

  async checkWord(word) {
    return this.store.checkWord(word);
  }

  async clearStore() {
    return this.store.clearStorage();
  }
}

module.exports = { Game }