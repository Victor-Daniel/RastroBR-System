
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
    let {userData} =  await LoginTraccar(email,senha);

    // Envia a resposta em Json
    res.json({ status: 'sucesso',client_data: userData});
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
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    console.log(`✅ Login feito com sucesso para ${email}:`, response.status);

    // Salva o client e o cookieJar associados ao usuário
    userSessions[email] = { client, cookieJar };
    jsonUser[email] = response.data;
    return {userSessions,userData: jsonUser[email]};

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

}

async function Get_Cookies_Login(EMAIL){
  const cookies = await cookieJar.getCookies(`${process.env.SERVER}:${process.env.PORT}`);
  return cookies;
}

function CheckLogin(){

}

module.exports=session,userSessions;