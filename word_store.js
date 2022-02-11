const { Mutex } = require('async-mutex');
const moment = require('moment');
const DbClient = require('@replit/database');
const wordsApi = require('./words_api.js');

/**
 * Class to represent word storage and loading
 */
class WordStore {
  constructor() {
    this.db = new DbClient();
    this.newWordMutex = new Mutex();
    this.wordLookupMutex = new Mutex();
  }

  async getCurrentWord(size) {
    const m = moment();
    const key = `${m.year()}${m.dayOfYear()}${size}`;

    // using a mutex to avoid race conditions on the DB
    // this will also make it easier to rate limit if necessary
    return this.newWordMutex.runExclusive(async () => {
      const currentWord = await this.db.get(key);
      if (currentWord) {
        console.log(`Word already in DB ${currentWord}`);
        return currentWord;
      }

      console.log(`Calling API for new word of size ${size}`);

      // word still not found, use mutex to call API
      const newWord = await wordsApi.getRandomWord(size);
      await this.db.set(key, newWord);

      console.log(`New word ${newWord}`);
      return newWord;
    });
  }

  async checkWord(word) {
    if (!word || word.length < 1) {
      return false;
    }

    const size = word.length;
    const first = word[0];
    const goodKey = `${size}${first}_g`;
    const badKey = `${size}${first}_b`;
    return this.wordLookupMutex.runExclusive(async () => {
      let goodWords = await this.db.get(goodKey);
      let badWords = await this.db.get(badKey);
      if (goodWords && goodWords.length >= size) {
        console.log(goodWords);
        // This is definitely a hack because I'm using replit's key-value db
        const goodArr = goodWords.match(new RegExp(`.{${size}}`, 'g'));
        console.dir(goodArr);
        if (goodArr.some(w => w === word.toLowerCase())) {
          return true;
        }
      } else {
        goodWords = '';
      }

      if (badWords && badWords.length >= size) {
        console.log(badWords);
        // This is definitely a hack because I'm using replit's key-value db
        const badArr = badWords.match(new RegExp(`.{${size}}`, 'g'));
        console.dir(badArr);
        if (badArr.some(w => w === word.toLowerCase())) {
          return true;
        }
      } else {
        badWords = '';
      }

      // not found on either list, check the API
      console.log(`Checking API for ${word}`);
      const good = await wordsApi.checkWord(word);
      if (good) {
        console.log('Word was valid');
        goodWords += word;
        this.db.set(goodKey, goodWords);
        return true;
      } else {
        console.log('Word was not valid');
        badWords += word;
        this.db.set(badKey, badWords);
        return false
      }
    });
  }

  async clearStorage() {
    return this.db.empty();
  }
}

module.exports = { WordStore }