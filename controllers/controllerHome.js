let {userData} = require("../api/session");

class ControllerHome{
    LoadInfoHome(){
        return userData.email;
    }

}
module.exports = ControllerHome;