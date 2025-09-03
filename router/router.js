// Iniciando as rotas partindo do Express (SRV) e inicinando os Directorys dos html
const express = require("express");
const router = express.Router();

const GeneralUtility = require("../utilities/GeneralUtility");
const utility = new GeneralUtility();

let {JWTVerifyToken} = require("../api/session");
const cookieParser = require('cookie-parser');

router.use(cookieParser());


// Rotas padrão para o front
router.get("/",function(req,res){
    //Pegando o subdominio do Home
    let subdomain = getSubdomain(req.headers.host);
    let directory = ControllerGeneral.searchDirectoryClient(subdomain);
    let result = ControllerGeneral.searchFileToLoad(directory+"/index.ejs");
    if(result===true){
        res.render(directory+"/index.ejs");
    }
    else{
        res.status(404).send("Arquivo Index não encontrado!");
    }
});
router.get("/login",function(req,res){
    if(req.cookies.session_id){
        return res.redirect("/home");
    }
    //Pegando o subdominio do Home
    let subdomain = getSubdomain(req.headers.host);
    let directory = utility.searchDirectoryClient(subdomain);
    let result = utility.searchFileToLoad(directory+"/login.ejs");
    if(result===true){
        res.render(directory+"/login.ejs");
    }
    else{
        res.status(404).send("Arquivo Login não encontrado!");
    }
});

router.get("/registrar", function(req,res){
    if(!req.cookies.session_id){
        return res.redirect("/login");
    }
    else{
        let dados = JWTVerifyToken(req.cookies.session_id);
        if(dados.Code===404){
            res.clearCookie("session_id",{ httpOnly: true,sameSite: 'strict',path:"/",secure: false});
            res.json(dados);
        }
        else{
            res.json({code:200,url:`http://${req.headers.host}/cadastro`});
        }
    }
});

router.get("/cadastro",function(req,res){
    if(!req.cookies.session_id){
        return res.redirect("/login");
    }
    else{ 
        //Validando token antes das funções
        let dados =  JWTVerifyToken(req.cookies.session_id);
        if(dados.Code===404){
            res.clearCookie("session_id",{ httpOnly: true,sameSite: 'strict',path:"/",secure: false});
            res.redirect("/login"); 
        }
        else{
            //Pegando o subdominio do Home
            let subdomain = getSubdomain(req.headers.host);
            let directory = utility.searchDirectoryClient(subdomain);
            let result = utility.searchFileToLoad(directory+"/cadastrar.ejs");
            if(result===true){
                res.render(directory+"/cadastrar.ejs");
            }
            else{
                 res.status(404).send("Arquivo Login não encontrado!");
            }
        }
    }
});

router.get("/home", function(req,res){
    if(!req.cookies.session_id){
        return res.redirect("/login");
    }
    else{

        //Validando token antes das funções
        let dados = JWTVerifyToken(req.cookies.session_id);
        if(dados.Code===404){
            res.clearCookie("session_id",{ httpOnly: true,sameSite: 'strict',path:"/",secure: false});
            res.redirect("/login"); 
        }
        else{
            //Pegando o subdominio do Home
            let subdomain = getSubdomain(req.headers.host);
            let directory = utility.searchDirectoryClient(subdomain);
            let result = utility.searchFileToLoad(directory+"/home.ejs");
             if(result===true){
                res.render(directory+"/home.ejs",{
                    user: dados.username
                });
            }
            else{
                res.status(404).send("Arquivo Login não encontrado!");
            }
        }
    }
    
});



// Função que retorna o Subdominio
function getSubdomain(host){
    let hostWithoutPort = host.split(':')[0];
    let myhost =hostWithoutPort.split('.');
    let subdomain = "";

    if(myhost.length<=3){
        subdomain = myhost[0].replace(/[^a-z]/g, '');
        subdomain = subdomain.toLowerCase();
        // Gambiarra abaixo, comente a proxima linha
        subdomain = "rastrobr";
    }
    if(myhost.length===4&& myhost.every(part => !isNaN(part))){
        subdomain = "rastrobr";
    }

    return subdomain;
}

module.exports=router;