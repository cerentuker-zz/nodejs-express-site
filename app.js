//require express, data.json 

const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('about');
    //res.send('<h1> I love treehouse! </h1>');
});

app.listen(3000, () => {
    console.log("The app is running on localhost:3000!");
});

//app.listen(3000);