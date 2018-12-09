module.exports = {
    zobrazHlavnuStranku: (req, res) => {//zonraz hlavnu stranku
        let query = "SELECT * FROM `uzivatel` ORDER BY id ASC"; // query z mysql databazy

        // vykonať query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');//ak chyba chod na hlavnu stranku
            }
            res.render('index.ejs', { //ak je vsetko ok vygeneruj index.ejs a pošli všetky results do stranky
                title: "Vitajte | Prehľad užívateľov",
                uzivatlia: result
            });
        });
    },
};
