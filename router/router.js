// Iniciando as rotas partindo do Express (SRV) e inicinando os Directorys dos html
const express = require("express");
const router = express.Router();
const ControllerHome = require("../controllers/controllerHome");
const ControlHome = new ControllerHome();


router.get("/", function(req,res){
    //Pegando o subdominio do Home
    let subdomain = getSubdomain(req.headers.host);
    let directory = ControlHome.searchDirectoryHome(subdomain);
    let result = ControlHome.searchFileHome(directory+"/index.ejs");
    if(result===true){
        res.render(directory+"/index.ejs");
    }
    else{
        res.status(404).send("Arquivo Index não encontrado!");
    }
});
router.get("/cadastro",function(req,res){
    res.send("OK");
});

// Função que retorna o Subdominio
function getSubdomain(host){
    let myhost = host.split('.');
    let subdomain = "";
    if(myhost.length>=2){
       subdomain = myhost[0].replace(/[^a-z]/g, '');
       subdomain = subdomain.toLowerCase();
    }
    else{
        subdomain = "rastrobr";
    }
    return subdomain;
}

module.exports=router;