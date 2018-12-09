<h1>Mysql CRUD</h1> <br>
<h3>Create, Read, Update & Delete</h3>

This is simple CRUD in node.js using Mysql database. To start with this, you will need to create database using this command: </br>

<pre>
CREATE DATABASE uzivatelia;
CREATE TABLE IF NOT EXISTS `uzivatel` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `number` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `user_name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
)
</pre> </br>

To connect to your database you need to config your app in app.js </br>

<pre>
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'uzivatelia'
});
</pre>
This CRUD is just for explanation purposes. Before deploying this you need to improve this code and create XSS protection.
