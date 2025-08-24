// Iniciando as rotas partindo do Express (SRV) e inicinando os Directorys dos html
const express = require("express");
const router = express.Router();
const controllerGeneral = require("../controllers/controllerGeneral");
const ControllerGeneral = new controllerGeneral();
const ControllerHome = require("../controllers/controllerHome");
const controllerHome = new ControllerHome();

// Rotas padrão para o front
router.get("/", function(req,res){
    //Pegando o subdominio do Home
    let subdomain = getSubdomain(req.headers.host);
    let directory = ControllerGeneral.searchDirectoryHome(subdomain);
    let result = ControllerGeneral.searchFileHome(directory+"/index.ejs");
    if(result===true){
        res.render(directory+"/index.ejs");
    }
    else{
        res.status(404).send("Arquivo Index não encontrado!");
    }
});
router.get("/login",function(req,res){
    //Pegando o subdominio do Home
    let subdomain = getSubdomain(req.headers.host);
    let directory = ControllerGeneral.searchDirectoryHome(subdomain);
    let result = ControllerGeneral.searchFileHome(directory+"/login.ejs");
    if(result===true){
        res.render(directory+"/login.ejs");
    }
    else{
        res.status(404).send("Arquivo Login não encontrado!");
    }
});

router.get("/cadastro",function(req,res){
    res.send("OK");
});

router.get("/home",function(req,res){
    //Pegando o subdominio do Home
    let subdomain = getSubdomain(req.headers.host);
    let directory = ControllerGeneral.searchDirectoryHome(subdomain);
    let result = ControllerGeneral.searchFileHome(directory+"/home.ejs");
    if(result===true){
        res.render(directory+"/home.ejs",{
           teste: controllerHome.LoadInfoHome() 
        });
    }
    else{
        res.status(404).send("Arquivo Login não encontrado!");
    }
    
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