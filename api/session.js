
const express = require("express");
const session = express.Router();

const axios = require("axios");
const { wrapper } = require('axios-cookiejar-support');
const tough = require('tough-cookie');

let userSessions = {};
let jsonUser = {};


//Rotas de Sessão
 session.post("/session",async(req,res)=>{
    //busca o email e senha "Indices" com os valores enviados na requisição.
    const {email,senha} = req.body;

    // Inicia o Método de Login
    let {userData,Code} =  await LoginTraccar(email,senha);
    // Envia a resposta em Json
    res.json({Data: userData,Code: Code});
});

session.post("/session/verify",async(req,res)=>{
    let {email} = req.body;
    let Result = await CheckLogin(email);
    res.json(Result);
});

session.post("/session/logout", async(req,res)=>{
  let {email} = req.body;
  let result = await LogoutTraccar(email);
  res.json(result);
});

// Função responsável por realizar o Login no Traccar
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

    //console.log( "Login realizado com Sucesso! StatusCode "+response.status);

    // Salva o client e o cookieJar associados ao usuário
    userSessions[email] = { client, cookieJar };
    jsonUser[email] = response.data;
    return {userSessions,userData: jsonUser[email],Code:response.status};

  }
   catch (error) {
    if (error.response) {
      console.error(`❌ Erro no login (${email}):`, error.response.status);
      console.error('🔍 Detalhes:', error.response.data);
    } else {
      console.error(`⚠️ Erro inesperado (${email}):`, error.message);
    }
    return null;
   
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

async function LogoutTraccar(email) {
  let {Code} = await CheckLogin(email);
  if(Code!=404){
    let {client} = userSessions[email];
    let response = await client.delete(`${process.env.SERVER}:${process.env.PORT}/api/session`);
    delete userSessions[email];
    delete jsonUser[email];
    return {Code: response.status}
  }
  else{
    return{Code: Code}
  }

}


async function Get_Cookies_Login(email){
  let session = userSessions[email];

  if(session && session.client && session.cookieJar){
    const cookies = await session.cookieJar.getCookies(`${process.env.SERVER}:${process.env.PORT}`);
    return {Cookie: cookies,Code:200};
  }
  else{
    return {Code:401}
  }
}

async function CheckLogin(email){
  let session = userSessions[email];

  if(session && session.client && session.cookieJar){

    let response = await session.client.get(`${process.env.SERVER}:${process.env.PORT}/api/session`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if(response.status === 200){
        return {Data: session,Code: response.status};
      }
      else{
        return {Code: response.status};
      }
  }
  else{
    return {Msg: "Session not found",Code: 404};
  }

}

module.exports=session,userSessions;