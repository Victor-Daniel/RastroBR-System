
const express = require("express");
const session = express.Router();

const axios = require("axios");
const { wrapper } = require('axios-cookiejar-support');
const tough = require('tough-cookie');

let mysql = require('mysql2/promise');

const cookieParser = require('cookie-parser');

session.use(cookieParser());

// Necessário para fazer requisições para o traccar
const { client, cookieJar } = createClient();

let DB__Conect={
    host: "69.62.88.214",
    port: 3306,
    user: "Devmaster",
    password: "HwWin10A.1",
    database: "traccar"
}

//Rotas de Sessão
 session.post("/session",async(req,res)=>{
    //busca o email e senha "Indices" com os valores enviados na requisição. 
    const {email,senha} = req.body;

    //Gambiarra
    let teste = await LogoutTraccarEmail(email);
    try{
        let resposta = await LoginTraccar(email,senha);
        if(resposta.Code===200){
          let saveSession = await SaveSessionTraccar(resposta.userData,resposta.usersessionData);
          if(saveSession.Code===200){
            res.cookie("session_id",saveSession.cookie,{httpOnly: true, maxAge: 1000 * 60 * 60,sameSite: 'strict',path:"/"});
            res.json({Code:resposta.Code,url:`http://${req.headers.host}/home`});
          }
          else{
            res.json(saveSession);
          }
        }
        else{
            res.json(resposta);
        }

    } 
    catch(erro){
      console.log(erro);
    }

});

session.post("/session/logout",async(req,res)=>{
  //let my_cookie = req.cookies.session_id.value
  //res.clearCookie("session_id",{ httpOnly: true,secure: true,sameSite: 'strict',});
  return res.json({});
});

//Faz o Login no traccar e traz o cookie de sessão
async function LoginTraccar(email,senha){
 try {
    
    //const { client, cookieJar } = createClient();
    let userData={};
    let usersessionData = {};

    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', senha);

    const response = await client.post(`${process.env.SERVER}:${process.env.PORT}/api/session`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });


    // Salva o client e o cookieJar associados ao usuário
    let cookie = await cookieJar.getCookies(`${process.env.SERVER}:${process.env.PORT}`);

    // Salvando as informações
    usersessionData.key = cookie[0].key;
    usersessionData.value = cookie[0].value;

    userData.id = response.data.id;
    userData.adm=response.data.administrator;
    userData.email=response.data.email;
    userData.nome = response.data.name;

    return {Code:200,userData,usersessionData};
  }
  catch (error) {
    if (error.response) {
      return {Code: 500,Msg:`Erro ao realizar login com ${email}! Usuário ou Senha não existe!`}
    } else {
      return{Code:501,Msg: `Erro inesperado ${email}: ${error.message}`};
    }
   
  }
}

//Salva os dados da sessão do traccar na base do Devmaster
async function SaveSessionTraccar(userData,usersessionData){
  try{
    let conection = await mysql.createConnection(DB__Conect);
    await conection.connect();

    let sql = `INSERT INTO session ( id_client, email, cookie, adm, auth)VALUES(?,?,?,?,?)`;

    let cookie = `${usersessionData.key}=${usersessionData.value}`;
    let [result] = await conection.query(sql,[userData.id,userData.email,cookie,userData.adm,true]);
    await conection.end();
     
     if(result.affectedRows>0) {
        console.log("Registro inserido com sucesso!");
        return {Code: 200,cookie: cookie};
    }
  }
  catch(Erro){
    //console.log(Erro);
    if (Erro.response) {
      return {Code: 500,Msg:`Erro ao salvar sessão!`}
    } else {
      return{Code:501,Msg: `Erro inesperado ${userData.email}: ${Erro.message}`};
    }
  }
}

//Ferifica se existe cookie na base do devmaster
async function VerifyCookieExists(cookie) {
  try{
    let conection = await mysql.createConnection(DB__Conect);
    await conection.connect();

    let sql = `SELECT * FROM session WHERE cookie= ?`;
    let [row] = await conection.query(sql,[cookie]);
    await conection.end();

    if(row[0].length>0){
      return {Code:200};
    }
    else{
      return {Code: 401};
    }
  }
  catch(error){
    console.log(error);
  }
}

//Tras todos os dados de sessão da base devmaster
async function GetCookie(cookie){
  try{
    let conection = await mysql.createConnection(DB__Conect);
    await conection.connect();

    let sql = `select * from session where cookie =  ?`;
    let [rows] = await conection.query(sql,[cookie]);
    await conection.end();
    return rows[0]||null;
  }
  catch(Erro){
    console.log(Erro);
  }
}

//Realiza comparação de cookies
async function VerificationCookie(cookie) {
  try {
    //Continuar...
  } catch (error) {
    
  }
}

async function LogoutTraccar(cookie) {

  let result = await VerifyCookieExists(cookie);
  if(result.Code===200){
    try {
      let conection = await mysql.createConnection(DB__Conect);
      let sql = `DELETE FROM session WHERE cookie= ?`;
      let [rows] = await conection.query(sql,[cookie]);
      await conection.end();

      if(rows.affectedRows>0){
        return {Code: 200};
      }

    } catch (error) {
      console.log(error);
      Retorno = 401;
      return {Code: 401};
    }
  }
  else{
   return {Code:result.Code};
  }


}

// Gambiarra do logout por enquanto

async function LogoutTraccarEmail(email) {
  try {
      let conection = await mysql.createConnection(DB__Conect);
      let sql = `DELETE FROM session WHERE email= ?`;
      let [rows] = await conection.query(sql,[email]);
      await conection.end();

      if(rows.affectedRows>0){
        return {Code: 200};
      }

    } catch (error) {
      console.log(error);
      Retorno = 401;
      return {Code: 401};
    }

}

// Cria o armazenamento dos cookies
function createClient() {
  const cookieJar = new tough.CookieJar();
  const client = wrapper(axios.create({
    baseURL: `${process.env.SERVER}:${process.env.PORT}`,
    jar: cookieJar,
    withCredentials: true
  }));
  return { client, cookieJar };
}



module.exports={session,client,VerificationCookie};