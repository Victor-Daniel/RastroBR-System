
// Configurando SRV

let express = require("express");
let app = express();
let port = 3000;
let router = require("./router/router.js");
let path = require("path");
let {session} = require("./api/session.js");

require('dotenv').config(); 

// Configurando o ejs no srv
app.set('view engine', 'ejs');

// Configurando o SRV para aceitar json
//app.use(cors());
app.use(express.json());

// Configurando SRV para aceitar Arquivos estáticos
app.use(express.static(path.join(__dirname,"views")));

//Middle para os fronts
app.use("/", router);

// Trabalhar a segurança de Acessos aqui abaixo


//-----------------------------------------------------

//Middles para os request via POST
app.use("/api",session);

//Inicializando o Servidor
app.listen(port, function(error){
    if(error){
        console.log("Não foi possivel inicializar o Servidor!");
        return;
    }
    console.log("Url de uso: http://localhost:"+port);
    console.log("Ou http://IP:"+port);
});