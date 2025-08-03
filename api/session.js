const express = require("express");
const session = express.Router();

//Rotas de Sessão
session.post("/session",(req,res)=>{
    //busca o email e senha "Indices" com os valores enviados na requisição.
    const {email,senha} = req.body;

    // Inicia o Método de Login
    let login_init = LoginTraccar(email,senha);

    // Envia a resposta em Json
    res.json({ status: 'sucesso'});
});

function LoginTraccar(email,senha){

    let srv = process.env.SERVER;
    let port = process.env.PORT;
    
    return"";
}

module.exports=session;