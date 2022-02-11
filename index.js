const express = require('express');
const { Game } = require('./game');

const app = express();
const game = new Game();

app.use('/', express.static('web'));

app.use('/api/current',(req, res) => {
  game.getCurrentWord().then(w => res.send(w));
})

// app.listen(80, () => console.log('listening!'));

async function testGame() {
game.getCurrentWord(5).then(w => console.log(w));

await game.checkWord('arise');
await game.checkWord('apple');
await game.checkWord('smile');
await game.checkWord('pecan');
await game.checkWord('aoeub');
await game.checkWord('cmeao');
await game.checkWord('shhhe');
await game.checkWord('arise');
}

testGame();