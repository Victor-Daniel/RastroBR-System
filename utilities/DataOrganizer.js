let validator = require("validator");
let sanitizeHTML = require("sanitize-html");

class SanitizerData{
    sanitizeName(Nome) {
        let clean = sanitizeHTML(Nome,{ allowedTags: [], allowedAttributes: {} });
        clean = clean.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
        return clean.trim().replace(/\s+/g, " ");
    }
    sanitizeCPF(CPF){
        let cpfClean = sanitizeHTML(CPF,{ allowedTags: [], allowedAttributes: {} });
        let cpfSatinized = cpfClean.replace(/\D/g, "");
        return cpfSatinized;
    }
    sanitizeCNPJ(CNPJ){
        let cnpjClean = sanitizeHTML(CNPJ,{ allowedTags: [], allowedAttributes: {} });
        let cnpjSatinized = cnpjClean.replace(/\D/g, "");
        return cnpjSatinized;
    }
    sanitizeEmail(Email){
        return sanitizeHTML(Email,{ allowedTags: [], allowedAttributes: {} });
    }
    sanitizerContato(Contato){
        let contatoClean = sanitizeHTML(Contato,{ allowedTags: [], allowedAttributes: {} });
        let contatoSanitized = contatoClean.replace(/\D/g, "");
        return contatoSanitized;
    }
    sanitizerEndereco(Endereco){
        return sanitizeHTML(Endereco,{ allowedTags: [], allowedAttributes: {} });
    }
    sanitizerNumero(Numero){
        let numeroClean = sanitizeHTML(Numero,{ allowedTags: [], allowedAttributes: {} });
        let numeroSatinized = numeroClean.replace(/\D/g, "");
        return numeroSatinized;
    }
    sanitizerBairro(Bairro){
        return sanitizeHTML(Bairro,{ allowedTags: [], allowedAttributes: {} });
    }
    sanitizerCidade(Cidade){
        return sanitizeHTML(Cidade,{ allowedTags: [], allowedAttributes: {} });
    }
    sanitizerEstado(UF){
        return sanitizeHTML(UF,{ allowedTags: [], allowedAttributes: {} });
    }
    sanitizerCEP(CEP){
        let cepClean = sanitizeHTML(CEP,{ allowedTags: [], allowedAttributes: {} });
        let cepSatinized = cepClean.replace(/\D/g, "");
        return cepSatinized;
    }
    


}
class ValidaterData{
    validadorCPF(arraycpf){
        let i,j,soma,dv1,dv2,resto;

        // Calculando Digito Verificador 1
        i,soma=0;
        j = 10;
        for(i=0; i<9; i++){
            soma+=arraycpf[i]*j;
            j = j-1;
        }
        
        resto = soma % 11;

        if(resto < 2){
            dv1 = 0;
        }
        else{
            dv1 = 11 - resto;
        }

        //Calcular Digito verificador 2

        soma = 0;
        j = 11;

        for(i=0; i<10; i++){
            soma+=arraycpf[i]*j;
            j = j-1;
        }

        resto = soma % 11;

        if(resto < 2){
            dv2 = 0;
        }
        else{
            dv2 = 11 - resto;
        }

        //Comparação com os resultados.
        if((dv1 == arraycpf[9])&&(dv2 == arraycpf[10])){
            return true;
        }
        else{
            return false;
        }
    }
    ValidadorCNPJ(arraycnpj){
        let i, soma, dv1, dv2, resto;

        //Calculando Digito Validador 1
        let pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        soma = 0;

        for (i = 0; i < 12; i++) {
            soma += arraycnpj[i] * pesos1[i];
        }

        resto = soma % 11;

        if(resto < 2){
            dv1 = 0;
        }
        else{
            dv1 = 11 - resto;
        }

        //Digito validador 2

        let pesos2 = [6].concat(pesos1); // mesma lista, mas começa com 6
        soma = 0;
        for (i = 0; i < 13; i++) {
            soma += arraycnpj[i] * pesos2[i];
        }

        resto = soma % 11;

        if(resto < 2){
            dv2 = 0;
        }
        else{
            dv2 = 11 - resto;
        }
        

        //Comparação

        if((dv1 == arraycnpj[12])&&(dv2==arraycnpj[13])){
            return true;
        }
        else{
            return false;
        }

    }
    ValidadorCEP(cep){
        const regex = /^\d{5}-?\d{3}$/;

        if (!regex.test(cep)) {
            return false;
        }
        else{
            return true;
        }
    }
    ValidadorEMAIL(email){
        let cleanerEmail = validator.trim(email);
        let email_norm = validator.normalizeEmail(cleanerEmail);
        return validator.isEmail(email_norm);
    }
}
module.exports={SanitizerData,ValidaterData};