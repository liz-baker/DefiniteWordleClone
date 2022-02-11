var axios = require("axios").default;

async function getRandomWord(size) {
  var options = {
    method: 'GET',
    url: 'https://wordsapiv1.p.rapidapi.com/words/',
    params: {
      letterPattern: '^[a-zA-Z0-9]{1,10}$',
      random: 'true',
      letters: `${size}`,
      hasDetails: 'definitions',
      limit: '1'
    },
    headers: {
      'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
      'x-rapidapi-key': process.env['rapid_api_key']
    }
  };

  return axios.request(options).then(function(response) {
    console.dir(response.data);
    return response.data.word.toLowerCase();
  }).catch(function(error) {
    console.error(error);
  });
}

/**
 * Checks whether a word is a valid word
 * @param {string} word - the word to validate
 */
async function checkWord(word) {
  // TODO: Input validation
  var options = {
    method: 'GET',
    url: `https://wordsapiv1.p.rapidapi.com/words/${word}`,
    headers: {
      'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
      'x-rapidapi-key': process.env['rapid_api_key']
    }
  };

  return axios.request(options).then(function(response) {
    // console.dir(response.data);
    return response.data.word.toLowerCase() === word.toLowerCase();
  }).catch(function(error) {
    // TODO: Retry logic?
    // console.error(error);
    return false;
  });
}

module.exports = { getRandomWord, checkWord };