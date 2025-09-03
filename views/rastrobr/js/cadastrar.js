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