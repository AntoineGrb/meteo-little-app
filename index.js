//Création serveur Express
const express = require('express');
const app = express();

//Router
const router = require('./app/router');

//Set up dotenv (pour les variables environnement du projet)
const dotenv = require('dotenv');
dotenv.config();

//Set up ejs
app.set('view engine' , 'ejs');
app.set('views' , './app/views'); //Le dossier des views

//Middlewares
app.use(express.static('./public'));
app.use('/src' , express.static('./src'));
app.use(router);
app.use((req , res) => {
    res.status(404).send("Erreur 404 : la ressource demandée n'existe pas");
});

//Ecoute du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening @ http://localhost:${port} ...`);
});