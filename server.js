let express = require("express");
let app = express();
let port = 3000;
let router = require("./router/router.js");

app.set('view engine', 'ejs');
app.use("/", router);


app.listen(port, function(error){
    if(error){
        console.log("Erro encontrado!");
        return;
    }
    console.log("Url de uso: http://localhost:"+port);
    console.log("Ou http://IP:"+port);
});