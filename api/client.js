const express = require("express");
const client = express.Router();
let {JWTVerifyToken} = require("./session");
let {SanitizerData,ValidaterData} = require("../utilities/DataOrganizer");
let mysql = require('mysql2/promise');

let DB__Conect={
    host: "69.62.88.214",
    port: 3306,
    user: "Devmaster",
    password: "HwWin10A.1",
    database: "traccar"
}

client.post("/client",async (req,res)=>{
    if(!req.cookies.session_id){
        return res.redirect("/login");
    }
    else{
        let verify = JWTVerifyToken(req.cookies.session_id);
        if(verify.Code===404){
            res.clearCookie("session_id",{ httpOnly: true,sameSite: 'strict',path:"/",secure: false});
            res.json({Code:404,url:`http://${req.headers.host}/login`});
        }
        else{
            let dados_Sanitized = ProcessingData(req.body);
            if(dados_Sanitized.data.cpf){
                let buscaDados = SearchClientDataForCPF(dados_Sanitized.data.cpf);
                if(buscaDados.Code==404){
                    console.log("OK");
                }
                else{
                    console.log("Usuario existente");
                } 
            }
            else if(dados_Sanitized.data.cnpj){
                let buscaDados = SearchClientDataForCPF(dados_Sanitized.data.cnpj);
                if(buscaDados.Code===404){
                    console.log("OK");
                }
                else{
                    console.log("Usuario existente");
                }  
            }
        }
       
        res.json({Code:200,Msg:"OK"});
    }
});

function ProcessingData(dados){
    if(dados.cpf){
        let data = {};
        let sanitizer = new SanitizerData();
        data.nome = sanitizer.sanitizeName(dados.nome);
        data.cpf = sanitizer.sanitizeCPF(dados.cpf);
        data.email = sanitizer.sanitizeEmail(dados.email);
        data.contato = sanitizer.sanitizerContato(dados.contato);
        data.endereco = sanitizer.sanitizerEndereco(dados.endereco);
        data.numero = sanitizer.sanitizerNumero(dados.numero);
        data.bairro = sanitizer.sanitizerBairro(dados.bairro);
        data.cidade = sanitizer.sanitizerCidade(dados.cidade);
        data.estado = sanitizer.sanitizerEstado(dados.estado);
        data.cep = sanitizer.sanitizerCEP(dados.cep);

        let Validador = new ValidaterData();
        let valid_cpf = Validador.validadorCPF(data.cpf);
        let valid_cep = Validador.ValidadorCEP(data.cep);
        let valid_email = Validador.ValidadorEMAIL(data.email);

        if((valid_cpf===true)&&(valid_cep===true)&&(valid_email===true)){
            return {Code:200,data};
        }
        else{
            return{Code:405};
        }

    }
    else{
        let data = {};
        let sanitizer = new SanitizerData();
        data.nome = sanitizer.sanitizeName(dados.nome);
        data.cnpj = sanitizer.sanitizeCNPJ(dados.cnpj);
        data.email = sanitizer.sanitizeEmail(dados.email);
        data.contato = sanitizer.sanitizerContato(dados.contato);
        data.endereco = sanitizer.sanitizerEndereco(dados.endereco);
        data.numero = sanitizer.sanitizerNumero(dados.numero);
        data.bairro = sanitizer.sanitizerBairro(dados.bairro);
        data.cidade = sanitizer.sanitizerCidade(dados.cidade);
        data.estado = sanitizer.sanitizerEstado(dados.estado);
        data.cep = sanitizer.sanitizerCEP(dados.cep);

        let Validador = new ValidaterData();
        let valid_cnpj = Validador.ValidadorCNPJ(data.cnpj);
        let valid_cep = Validador.ValidadorCEP(data.cep);
        let valid_email = Validador.ValidadorEMAIL(data.email);
        if((valid_cnpj===true)&&(valid_cep===true)&&(valid_email===true)){
            return  {Code:200,data};
        }
        else{
            return{Code:405};
        }

    }
}

async function SearchClientDataForCNPJ(cnpj){
     try {
        let connect = await mysql.createConnection(DB__Conect);
        let sql = `SELECT * FROM clientes WHERE cnpj = ?`;
        let [row] = await connect.query(sql,[cnpj]);
        await connect.end();
        if(row[0]!=null){
            return{Code:200,Dados: row[0]};
        }
        else{
            return {Code:404};
        }

    } catch (error) {
        return {Code:500,Erro: error.message};
    }
}

async function SearchClientDataForCPF(cpf){
     try {
        let connect = await mysql.createConnection(DB__Conect);
        let sql = `SELECT * FROM clientes WHERE cpf = ?`;
        let [row] = await connect.query(sql,[cpf]);
        await connect.end();
        if(row[0]!=null){
            return{Code:200,Dados: row[0]};
        }
        else{
            return {Code:404};
        }

    } catch (error) {
        return {Code:500,Erro: error.message};
    }
}

async function CreateClientCPF(dados){
    try {
        let connect = await mysql.createConnection(DB__Conect);
        let sql = `INSERT INTO clientes (nome,email,contato,cpf,cnpj,endereco,numero,bairro,cidade,estado,cep) Values (?,?,?,?,?,?,?,?,?,?,?)`;
        let [row] = await connect.query(sql,[dados.nome,dados.email,dados.contato,dados.cpf,"",dados.endereco,dados.numero,dados.bairro,dados.cidade,dados.estado,dados.cep]);
        await connect.end();
        if(row.affectedRows>0){
            return{Code:200,Msg: "Cliente cadastrado com Sucesso!"};
        }

    } catch (error) {
        return {Code:500,Erro: error.message};
    }
}
async function CreateClientCNPJ(dados){
    try {
        let connect = await mysql.createConnection(DB__Conect);
        let sql = `INSERT INTO clientes (nome,email,contato,cpf,cnpj,endereco,numero,bairro,cidade,estado,cep) Values (?,?,?,?,?,?,?,?,?,?,?)`;
        let [row] = await connect.query(sql,[dados.nome,dados.email,dados.contato,"",dados.cnpj,dados.endereco,dados.numero,dados.bairro,dados.cidade,dados.estado,dados.cep]);
        await connect.end();
        if(row.affectedRows>0){
            return{Code:200}
        }

    } catch (error) {
        return {Code:500,Erro: error.message};
    }
}
module.exports={client};