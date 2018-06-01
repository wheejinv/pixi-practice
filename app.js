const express = require("express");
const router = require('./router');
const app = express();

app.use('/assets', express.static('assets'));
app.use('/src', express.static('src'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

router(app);

app.get('/', (req, res) => {
    res.send('Hello world!')
});

app.listen( 4040, () => console.log('Pixi-Practice app listening on port 4040!'));