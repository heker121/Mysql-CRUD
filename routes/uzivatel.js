const fs = require('fs');

module.exports = {
  // --- GET - Pridať užívateľa ---
  pridatUzivatela: (req, res) => {
    res.render('pridat.ejs', {
      title: "Vitajte | Pridať nového užívateľa",
      message: ''
    });
  },
  // --- POST - Pridať užívateľa ---
  pridatUzivatelaPost: (req, res) => {
    //Kontrola súboru
    if (!req.files) {
      return res.status(400).send("Nič nebolo nahraté.");
    }
    // Spracovanie údajov z formuláru cez body parser
    let message = '';
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let position = req.body.position;
    let number = req.body.number;
    let username = req.body.username;
    let uploadedFile = req.files.image;
    let image_name = uploadedFile.name;
    let fileExtension = uploadedFile.mimetype.split('/')[1];
    image_name = username + '.' + fileExtension; // zmen nazov nahratého súboru na užívateľ.prípona

    let usernameQuery = "SELECT * FROM `uzivatel` WHERE user_name = '" + username + "'"; // query na kontrolu či už užívateľ neexistuje

    db.query(usernameQuery, (err, result) => { //ak chyba vyhod err
      if (err) {
        return res.status(500).send(err);
      }
      if (result.length > 0) {
        message = 'Užívateľ už existuje';
        res.render('pridat.ejs', {
          message,
          title: "Vitajte | Pridať nového užívateľa"
        });
      } else { //ak nieje chyba vykonaj tento úkon
        // skontorluj či je správny súbor fotky podľa koncovky súboru(png, gif, jpeg)
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
          // nahrať do /public/images
          uploadedFile.mv(`public/images/${image_name}`, (err) => {
            if (err) {
              return res.status(500).send(err);
            }
            // nahrať údaje z formuláru do db
            /*  ----*/
            let query = "INSERT INTO `uzivatel` (first_name, last_name, position, number, image, user_name) VALUES ('" +
              /* |   */
              first_name + "', '" + last_name + "', '" + position + "', '" + number + "', '" + image_name + "', '" + username + "')";
            /* -->*/
            db.query(query, (err, result) => { //kontrola
              if (err) {
                return res.status(500).send(err);
              }
              res.redirect('/');
            });
          });
        } else {
          message = "Nesprávny formát. Sú povolené iba formáty 'gif', 'jpeg' a 'png'."; //ako chybný formát obrázka vyšle túto spravu
          res.render('pridat.ejs', {
            message,
            title: "Vitajte | Pridať nového užívateľa"
          });
        }
      }
    });
  },
  editovatUzivatela: (req, res) => { // Editácia užívateľa
    let userId = req.params.id; // stiahni všetky údaje použitím body parser
    let query = "SELECT * FROM `uzivatel` WHERE id = '" + userId + "' "; // query pre mysql
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.render('edit.ejs', { // vygeneruj formulár v ktorom už budu predpísané hodnoty
        title: "Editácia užívateľa",
        uzivatel: result[0],
        message: ''
      });
    });
  },
  editovatUzivatelaPost: (req, res) => { //POST req. pre editáciu
    let userId = req.params.id; // --- Vezmi všetky údaje a ulož
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let position = req.body.position;
    let number = req.body.number; // --- Vezmi všetky údaje a ulož

    /* query update pre mysql */
    let query = "UPDATE `uzivatel` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "' WHERE `uzivatel`.`id` = '" + userId + "'";
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect('/');
    });
  },
  zmazUzivatela: (req, res) => { //zmaz uzivatela
    let userId = req.params.id; // cez body parser stiahni ID
    let getImageQuery = 'SELECT image from `uzivatel` WHERE id = "' + userId + '"'; // najdi fotku
    let deleteUserQuery = 'DELETE FROM uzivatel WHERE id = "' + userId + '"'; // a zmaz

    db.query(getImageQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      let image = result[0].image;

      fs.unlink(`public/images/${image}`, (err) => { // cez fs.unlink zmaze zo súoru fotografiu podľa mena užívateľa
        if (err) {
          return res.status(500).send(err);
        }
        db.query(deleteUserQuery, (err, result) => { // zmaze aj ostatné údaje
          if (err) {
            return res.status(500).send(err);
          }
          res.redirect('/');
        });
      });
    });
  }
};
