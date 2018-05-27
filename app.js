const express = require("express");
const app = express();



app.get('/', (req, res) => {
    res.send('Hello world!')
});

app.listen( 4040, () => console.log('Example app listening on port 3000!'));