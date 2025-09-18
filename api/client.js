const express = require("express");
const client = express.Router();
let {JWTVerifyToken} = require("./session");
let {SanitizerData,ValidaterData} = require("../utilities/DataOrganizer");
let mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

let DB__Conect={
    host: "69.62.88.214",
    port: 3306,
    user: "Devmaster",
    password: "HwWin10A.1",
    database: "rastrobr_db"
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
            //Tratando os dados recebidos
            let dados_Sanitized = ProcessingData(req.body);
            if(dados_Sanitized.Code==405){
                res.json({Code:405,Msg:"Dados fornecidos não são válidos. Verifique os dados informados!"});
            }
            if(dados_Sanitized.data.cpf){

                //Iniciando Buscas por CPF e Email
                let buscaDadosCPF = await SearchClientDataForCPF(dados_Sanitized.data.cpf);
                let buscarDadosEmail = await SearchClientDataForEmailCPF(dados_Sanitized.data.email);

                //Faz as Tratativas de erros e executa se os requisitos baterem
                if(buscarDadosEmail.Code==200 && buscaDadosCPF.Code==404){
                    res.json({Code:405,Msg:"Já existe um Cliente cadastrado nesse Email. Refaça o cadastro!"});
                }

                else if(buscaDadosCPF.Code==200 && buscarDadosEmail.Code==404){
                    res.json({Code:405,Msg:"Já existe um Cliente cadastrado nesse CPF. Refaça o cadastro!"});
                } 

                if(buscaDadosCPF.Erro){
                    res.json(buscaDadosCPF);
                }
                if(buscarDadosEmail.Erro){
                    res.json(buscaDadosCPF);
                }
                  
                if(buscarDadosEmail.Code==200 && buscaDadosCPF.Code==200){
                    res.json({Code:403,Msg:"Já existe cliente com esses dados. Refaça o cadastro!"});
                }

                if(buscaDadosCPF.Code==404 && buscarDadosEmail.Code==404){
                    res.json(await CreateClientCPF(dados_Sanitized.data));
                }

            }
            else if(dados_Sanitized.data.cnpj){
                //Iniciando Buscas por CNPJ e Email
                let buscaDadosCNPJ =  await SearchClientDataForCNPJ(dados_Sanitized.data.cnpj);
                let buscarDadosEmail = await SearchClientDataForEmailCNPJ(dados_Sanitized.data.email);
                console.log(buscarDadosEmail);
                //Faz as Tratativas de erros e executa se os requisitos baterem
                if(buscarDadosEmail.Code==200 && buscaDadosCNPJ.Code==404){
                    res.json({Code:403,Msg:"Já existe um usuário nesse Email. Refaça o cadastro!"});
                }

                if(buscaDadosCNPJ.Code==200 && buscarDadosEmail.Code==404){
                    res.json({Code:403,Msg:"Já existe um Cliente cadastrado nesse CNPJ. Refaça o cadastro!"});
                }

                if(buscaDadosCNPJ.Code==200 && buscarDadosEmail.Code==200){
                     res.json({Code:403,Msg:"Já existe cliente com esses dados. Refaça o cadastro!"});
                }

                if(buscaDadosCNPJ.Erro){
                    res.json(buscaDadosCNPJ);
                }
                if(buscarDadosEmail.Erro){
                    res.json(buscarDadosEmail);
                }

                if(buscaDadosCNPJ.Code==404 && buscarDadosEmail.Code==404){
                   res.json(await CreateClientCNPJ(dados_Sanitized.data));
                }
                
            }
        }
       
    }
});

client.get("/client/clientes",async(req,res)=>{
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
            res.json({Code:200,Msg: verify});
        }
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
        let sql = `SELECT uuid,nome,email,contato,cnpj,endereco,numero,bairro,cidade,estado,cep FROM clientes_pj WHERE cnpj = ?`;
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

async function SearchClientDataForEmailCNPJ(email){
     try {
        let connect = await mysql.createConnection(DB__Conect);
        let sql = `SELECT uuid,nome,email,contato,cnpj,endereco,numero,bairro,cidade,estado,cep FROM clientes_pj WHERE email = ?`;
        let [row] = await connect.query(sql,[email]);
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
        let sql = `SELECT uuid,nome,email,contato,cpf,endereco,numero,bairro,cidade,estado,cep FROM clientes_pf WHERE cpf = ?`;
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

async function SearchClientDataForEmailCPF(email){
    try {
        let connect = await mysql.createConnection(DB__Conect);
        let sql = `SELECT uuid,nome,email,contato,cpf,endereco,numero,bairro,cidade,estado,cep FROM clientes_pf WHERE email = ?`;
        let [row] = await connect.query(sql,[email]);
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
        let uuid=uuidv4();
        let connect = await mysql.createConnection(DB__Conect);
        let sql = `INSERT INTO clientes_pf (uuid,nome,email,contato,cpf,endereco,numero,bairro,cidade,estado,cep) Values (?,?,?,?,?,?,?,?,?,?,?)`;
        let [row] = await connect.query(sql,[uuid,dados.nome,dados.email,dados.contato,dados.cpf,dados.endereco,dados.numero,dados.bairro,dados.cidade,dados.estado,dados.cep]);
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
        let uuid=uuidv4();
        let connect = await mysql.createConnection(DB__Conect);
        let sql = `INSERT INTO clientes_pj (uuid,nome,email,contato,cnpj,endereco,numero,bairro,cidade,estado,cep) Values (?,?,?,?,?,?,?,?,?,?,?)`;
        let [row] = await connect.query(sql,[uuid,dados.nome,dados.email,dados.contato,dados.cnpj,dados.endereco,dados.numero,dados.bairro,dados.cidade,dados.estado,dados.cep]);
        await connect.end();
        if(row.affectedRows>0){
            return{Code:200,Msg: "Cliente cadastrado com Sucesso!"}
        }

    } catch (error) {
        return {Code:500,Erro: error.message};
    }
}

module.exports={client};