const express = require("express");
const user = express.Router();
let mysql = require('mysql2/promise');
const axios = require("axios");
const cookieParser = require('cookie-parser');

user.use(cookieParser());

let DB__Conect={
    host: "69.62.88.214",
    port: 3306,
    user: "Devmaster",
    password: "HwWin10A.1",
    database: "traccar"
}

let cookieUser = {};
user.get("/user", async(req,res)=>{
    if(req.cookies.session_id){
        cookieUser.cookie = req.cookies.session_id;
        let data = await GetDataSessionUser(req.cookies.session_id);
        GetUserDataTraccar(cookieUser.cookie,data.email);
        res.send({email: data.email});
    }

});


// Traz o conjunto informações do usuário baseado no email e sessão no TRACCAR
async function GetUserDataTraccar(cookie,email){
    try {   
       let response = await axios.get(`${process.env.SERVER}:${process.env.PORT}/api/users`,{
            headers:{
                Cookie: cookie
            }
        });
        let dados ={};
        for(let indice=0;indice<response.data.length;indice++){
            if(response.data[indice].email===email){
                dados = response.data[indice];
            }
        }
        return dados;
    } catch (error) {
        console.log(error);
    }
}

//Pega os dados de sessão da base Devmaster
async function GetDataSessionUser(cookie){
    try {
        let conection = await mysql.createConnection(DB__Conect);
        await conection.connect();

        let sql = `SELECT * FROM session WHERE cookie = ?`;
        let [rows] = await conection.query(sql,[cookie]);
        await conection.end();
        return rows[0]||null;

    } catch (error) {
        console.log(error);
    }
}

module.exports={user,GetDataSessionUser, GetUserDataTraccar};