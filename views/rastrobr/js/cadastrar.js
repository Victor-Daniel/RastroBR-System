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

let btn_cliente = document.getElementById("btn-salvar-cliente");
btn_cliente.addEventListener("click",function(){
    let nome = document.getElementById("nome");
    let cpfcnpj = document.getElementById("cpfcnpj");
    let email = document.getElementById("email");
    let contato  = document.getElementById("contato");
    let endereco = document.getElementById("endereco");
    let numero = document.getElementById("numero");
    let bairro = document.getElementById("bairro");
    let cidade = document.getElementById("cidade");
    let estado = document.getElementById("estado");
    let cep = document.getElementById("cep");

    let radio_pf = document.getElementById("rd_pf");
    let radio_pj = document.getElementById("rd_pj");

    if(radio_pf.checked){
        let dados = {
            nome: nome.value,
            cpf:cpfcnpj.value,
            email: email.value,
            contato: contato.value,
            endereco: endereco.value,
            numero: numero.value,
            bairro: bairro.value,
            cidade: cidade.value,
            estado: estado.value,
            cep: cep.value
        }
    }
    else if(radio_pj.checked){
        let dados = {
            nome: nome.value,
            cnpj:cpfcnpj.value,
            email: email.value,
            contato: contato.value,
            endereco: endereco.value,
            numero: numero.value,
            bairro: bairro.value,
            cidade: cidade.value,
            estado: estado.value,
            cep: cep.value
        }
    }
});