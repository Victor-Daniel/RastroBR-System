let path = require("path");
let fs = require("fs");

class controllerGeneral{
    // Verifica de existe a pasta de acordo com o Subdomain
    searchDirectoryHome(subdomain){
        return path.join(__dirname, "../views",subdomain);
    }

    // Verifica a existencia do arquivo de Home
    searchFileHome(filepath){
        if(fs.existsSync(filepath)){
            return true;
        }
        else{
            return false;
        }
    }
}
module.exports = controllerGeneral;