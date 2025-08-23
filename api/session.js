
const express = require("express");
const session = express.Router();

const axios = require("axios");
const { wrapper } = require('axios-cookiejar-support');
const tough = require('tough-cookie');

let mysql = require('mysql2/promise');

 let userData={};
 let usersessionData = {}; 

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
    try{
      //let verCookie = await VerifyCookie(email);
      let logout = await LogoutTraccar(email);
      if(logout.Code===200){
        let resposta = await LoginTraccar(email,senha);
        let saveSession = await SaveSession(userData,usersessionData);
        if(resposta.Code===200){
           res.json({Code:resposta.Code,url:"http://localhost:3000/home"});
        }
        else{
          res.json(resposta);
        }
      }
    } 
    catch(erro){
      console.log(erro);
    }

});

session.post("/session/user",async(req,res)=>{
  let {email} = req.body;
  
});

session.post("/session/logout",async(req,res)=>{
  let {email} = req.body;
  let result = await LogoutTraccar(email);
  return res.json(result);
});

async function LoginTraccar(email,senha){
 try {
    
    const { client, cookieJar } = createClient();

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

    return {Code:200,Response: response.data};
  }
   catch (error) {
    if (error.response) {
      return {Code: 500,Msg:`Erro ao realizar login com ${email}! Usuário ou Senha não existe!`}
    } else {
      return{Code:501,Msg: `Erro inesperado ${email}: ${error.message}`};
    }
    return null;
   
  }
}

async function SaveSession(userData,usersessionData){
  try{
    let conection = await mysql.createConnection(DB__Conect);
    await conection.connect();

    let sql = `INSERT INTO session ( id_client, email, cookie, adm, auth)VALUES(?,?,?,?,?)`;

    let cookie = `${usersessionData.key}=${usersessionData.value}`;

    let [result] = await conection.query(sql,[userData.id,userData.email,cookie,userData.adm,true]);
    await conection.end();
     
     if(result.affectedRows>0) {
        console.log("Registro inserido com sucesso!");
        return {Code: 200};
    }
  }
  catch(Erro){
    console.log(Erro);
  }
}

async function VerifyCookie(email) {
  try{
    let conection = await mysql.createConnection(DB__Conect);
    await conection.connect();

    let sql = `SELECT * FROM session WHERE email= ?`;
    let [row] = await conection.query(sql,[email]);
    await conection.end();

    if(row.length>0){
      return {Code:200};
    }
    else{
      return {Code: 501};
    }
  }
  catch(error){
    console.log(error);
  }
}

async function GetCookie(email){
  try{
    let conection = await mysql.createConnection(DB__Conect);
    await conection.connect();

    let sql = `select * from session where email =  ?`;
    let [rows] = await conection.query(sql,[email]);
    await conection.end();

    return rows[0]||null;
  }
  catch(Erro){
    console.log(Erro);
  }
}

async function GetUser(email){
  try {

    let result = await GetCookie(email);
    const response = await axios.get(`${process.env.SERVER}:${process.env.PORT}/api/users`,{
       headers: {
        Cookie: result.cookie 
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function LogoutTraccar(email) {

  let Retorno = 0;
  if(usersessionData.key){
    delete usersessionData.key;
    delete usersessionData.value;
    delete userData.id;
    delete userData.adm;
    delete userData.email;
    Retorno = 200;
  }
  else {
    Retorno = 200;
  }

  let result = await GetCookie(email);
  if(result!=null){
    try {
      let conection = await mysql.createConnection(DB__Conect);
      let sql = `DELETE FROM session WHERE email= ?`;
      let [rows] = await conection.query(sql,[email]);
      await conection.end();

      if(rows.affectedRows>0){
        Retorno = 200;
        return {Code: Retorno};
      }

    } catch (error) {
      console.log(error);
      Retorno = 401;
      return {Code: Retorno};
    }
  }
  else{
    Retorno = 200;
    return {Code: Retorno};
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



module.exports=session;