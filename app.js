const express = require('express'); //Express Framework
const fileUpload = require('express-fileupload'); // Nahrávanie súboro cez express
const bodyParser = require('body-parser'); //Spracovanie údajov z formulára
const mysql = require('mysql');// Spracovanie mysql databázy
const path = require('path'); // správne určenie cesty
const app = express(); // aplikovanie frameworku

// routy na stránky //
const {zobrazHlavnuStranku} = require('./routes/index');
const {pridatUzivatela, pridatUzivatelaPost, zmazUzivatela, editovatUzivatelaPost, editovatUzivatela} = require('./routes/uzivatel');


// Konfigurácia pripojenia cez mysql.createConnection funkciu, má v sebe konfigŕaciu obsahujúcu názov a cestu k db, meno a heslo .
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'uzivatelia'
});

// samotné pripojenie k databáze
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Úspešne pripojený');
});

global.db = db;

// middleware
app.set('views', __dirname + '/views'); // natavenie expresu v ktorom priečinku sa nachádzajú ejs súbory
app.set('view engine', 'ejs'); // nastavenie zobrazovania cez ejs
app.use(bodyParser.urlencoded({ extended: false }));//nastavenie body parsera
app.use(express.static(path.join(__dirname, 'public'))); // nastavenie expresu aby použival priečinok public
app.use(fileUpload()); // Konfigurácia nahrávania súborov

// samotné cesty k routes

app.get('/', zobrazHlavnuStranku);
app.get('/pridat', pridatUzivatela);
app.get('/edit/:id', editovatUzivatela);
app.get('/vymazat/:id', zmazUzivatela);
app.post('/pridat', pridatUzivatelaPost);
app.post('/edit/:id', editovatUzivatelaPost);

module.exports = app;

// zachytenie errorov a presmenoravnie na 404
app.use(function(req, res, next) {
  next(createError(404));
});

// zobrazenie chybových hlášok
app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});
