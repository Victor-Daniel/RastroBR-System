const express = require("express");
const user = express.Router();
let mysql = require('mysql2/promise');

const cookieParser = require('cookie-parser');

user.use(cookieParser());

let DB__Conect={
    host: "69.62.88.214",
    port: 3306,
    user: "Devmaster",
    password: "HwWin10A.1",
    database: "traccar"
}


user.get("/user", async(req,res)=>{
    if(req.cookies.session_id){
        
    }
    let data = await GetDataSessionUser(req.cookies.session_id);
    res.send({email: data.email});
});


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

module.exports={user};