
const express = require("express");
const session = express.Router();
const jwt = require('jsonwebtoken');
//const axios = require("axios");
const {GetDataUsers} = require("../api/user");
const argon2 = require("argon2");
let mysql = require('mysql2/promise');

const cookieParser = require('cookie-parser');

session.use(cookieParser());



let DB__Conect={
    host: "69.62.88.214",
    port: 3306,
    user: "Devmaster",
    password: "HwWin10A.1",
    database: "traccar"
}

//Rotas de para fazer Login e realizar login
 session.post("/session",async(req,res)=>{
    //busca o email e senha "Indices" com os valores enviados na requisição. 
    const {email,senha} = req.body;
    
    if( await login(email,senha)){
      let data = await GetDataUsers(email);
      let token = JWTCreateSign({username:data.username,id:data.id,email: data.email});
      res.cookie("session_id",token,{httpOnly: true, maxAge: 24 * 60 * 60 * 1000,sameSite: 'strict',path:"/",secure: false});
      res.json({Code:200,url:`http://${req.headers.host}/home`});
    }
    else{
      res.json({Code:404,msg:`Não foi possível fazer login!`});
    }

});

//Rotas de para fazer Log off
session.delete("/session/logout",async(req,res)=>{
  if(req.cookies.session_id){
    res.clearCookie("session_id",{ httpOnly: true,sameSite: 'strict',path:"/",secure: false});
    res.json({Code:200,url:`http://${req.headers.host}/login`});
  } 
});

//Método para realizar login
async function login(email,senha) {
  return  await VerifyHashPassword(email,senha);
}


//Cria um hash de senha para salvar na base
async function CreateHashPassword(password){
  try {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id, // Usa Argon2id (o mais seguro atualmente)
      memoryCost: 2 ** 16,   // quantidade de memória usada (64 MB)
      timeCost: 5,           // iterações (ajusta a velocidade)
      parallelism: 1         // threads usadas
    });

    console.log("Hash gerado:", hash);
  } catch (error) { 
    console.log(error);
  }
}

// Verifica e compara o hash de senha guardado com a senha informada pelo usuario
async function VerifyHashPassword(email,password){
  try {
    let conect = await mysql.createConnection(DB__Conect);
    let sql = `SELECT password FROM usuarios WHERE email = ?`;
    let [row]=await conect.query(sql,[email]);
    await conect.end();
    const confere = await argon2.verify(row[0].password, password);
    if(confere){
      return true;
    }
    else{
      return false;
    }
  } catch (err) {
    console.error(err);
  }
}

// Cria um token de assinatura de token
function JWTCreateSign(payload){
  const SECRETKEY = process.env.JWT_SECRETKEY;
  try {
    let token = jwt.sign(payload,SECRETKEY, { expiresIn: '1d' });
    return token;
  } catch (error) {
    console.log(error);
  }
}

// Verifica o token e retorna os dados usados para fazer a assinatura 
function JWTVerifyToken(cookie){
  const SECRETKEY = process.env.JWT_SECRETKEY;
  try {
    let payoad = jwt.verify(cookie,SECRETKEY);
    return payoad;
  } catch (error) {
    return{Code:404};
  }
}

module.exports={session,JWTVerifyToken};