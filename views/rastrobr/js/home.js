let btn_logout = document.getElementById("logout");

btn_logout.addEventListener("click",async function(){
    let send_result  = await fetch("/api/session/logout",{
            method:'DELETE',
        });
    //Resultado
     let response = await send_result.json();
     if(response.Code===200){
        window.location.href = response.url;
     }
});


let btn_cadastro = document.getElementById("cadastro");

btn_cadastro.addEventListener("click",async function(){
     let get_response = await fetch("/registrar",{
        method:'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    response = await get_response.json();
    if(response.code===200){
        window.location.href = response.url;
    }
    else{
        console.log(response);
    }
});