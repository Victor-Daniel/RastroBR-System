
let user_email;

window.addEventListener("DOMContentLoaded",async function(){
    var send_result = await fetch("/api/user",{
        method:'GET',
    });
    //Recebe a resposta da requisição em espera.
    let response = await send_result.json();
    console.log(response);
    user_email = response.email;
    let user = document.getElementById("user");
    user.textContent = user_email;
    

});



