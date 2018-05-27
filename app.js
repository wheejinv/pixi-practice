const express = require("express");
const router = require('./router');
const app = express();

app.use(express.static('public'));
// app.use(express.static('pixi'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

router(app);


app.get('/', (req, res) => {
    res.send('Hello world!')
});

app.listen( 4040, () => console.log('Pixi-Practice app listening on port 4040!'));