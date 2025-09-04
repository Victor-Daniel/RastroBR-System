
// Configurando SRV

let express = require("express");
const http = require("http");
let app = express();
let port = 3000;
let host = "0.0.0.0";
let router = require("./router/router.js");
let path = require("path");
let {session} = require("./api/session.js");
let {user} = require("./api/user.js");
let rateLimit = require("express-rate-limit");

require('dotenv').config();

// Instalando dependencias de seguransa
let cors = require("cors");
let helmet = require("helmet");
let bodyParser = require("body-parser");
 
//app.use(helmet());

app.use(cors({origin:["localhost:3000","192.168.0.17:3000"],methods: ["GET", "POST", "PUT", "DELETE"]})); 

app.use(bodyParser.json({limit:"10kb"}));

let limiter = rateLimit({
    windowMs:5*60*1000,
    max:100,
    message:{
        status:429,
        message:"Foi detectado muita tentativas de request, por favor aguarde 5 minutos."
    },
    standardHeaders:true,
    legacyHeaders:false
});
//app.use(limiter);



//-----------------------------------------------------
// Configurando o ejs no srv
app.set('view engine', 'ejs');

// Configurando o SRV para aceitar json
app.use(express.json());

// Configurando SRV para aceitar Arquivos estáticos
app.use(express.static(path.join(__dirname,"views")));

//Middle para os fronts
app.use("/", router);

//Middles para os request via POST
app.use("/api",session);
app.use("/api",user);

//Inicializando o Servidor
http.createServer(app).listen(port,host,function(error){
    if(error){
        console.log("Não foi possivel inicializar o Servidor!");
        return;
    }
    console.log("Url de uso: http://localhost:"+port);
    console.log("Ou http://IP:"+port);
});