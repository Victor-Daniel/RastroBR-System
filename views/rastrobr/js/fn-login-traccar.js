// Pegando as informações de login enviando para nossa API para realizar o login

let user_email= document.getElementById("email");
let user_senha = document.getElementById("senha");

let btn = document.getElementById('btnLogin');

let logoutbtn = document.getElementById("logoutbtn");

//Inicia uma requisição assincrona de login ao clicar no botão entrar.
btn.addEventListener("click",async function(){
    let val_email = ValidateEmail(user_email.value);
    let email = user_email.value;
    let senha = user_senha.value;

    if(val_email===true){
        //Aguarda que a requisição seja feita para poder continuar o Código
        var send_result = await fetch("/api/session",{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body:  JSON.stringify({email,senha})
        });
        //Recebe a resposta da requisição em espera.
        let response = await send_result.json();
        if(response.Code===200){
            window.location.href = response.url;
            //console.log(response);
        }
        else{
            console.log(response);
        }
        
        
    }

});

async function createCookie(cookie){
    let user = {
        sessionid: cookie
    }

    let jsonString = encodeURIComponent(JSON.stringify(user));

    document.cookie = "sessionID=" + jsonString + "; path=/; max-age=" + 60 * 60 * 24 * 7;
}

function removerCookie(){
    document.cookie = "sessionID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}


function ValidateEmail(email){
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

