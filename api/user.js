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
    database: "rastrobr_db"
}

let cookieUser = {};
user.get("/user", async(req,res)=>{
    if(req.cookies.session_id){
    }

});

// Busca os dados de usuário baseado no email
async function GetDataUsers(email){
    try {
         let conect = await mysql.createConnection(DB__Conect);
            let sql = `SELECT uuid,usuario,email,tipo,status,permissao FROM users WHERE email = ?`;
            let [row]=await conect.query(sql,[email]);
            await conect.end();

            return row[0];
    } catch (error) {
        
    }
}

module.exports={user,GetDataUsers};