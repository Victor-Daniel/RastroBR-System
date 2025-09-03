let path = require("path");
let fs = require("fs");

class GeneralUtility{
    // Verifica de existe a pasta de acordo com o Subdomain
    searchDirectoryClient(subdomain){
        return path.join(__dirname, "../views",subdomain);
    }

    // Verifica a existencia do arquivo de Home
    searchFileToLoad(filepath){
        if(fs.existsSync(filepath)){
            return true;
        }
        else{
            return false;
        }
    }
    
}
module.exports = GeneralUtility;