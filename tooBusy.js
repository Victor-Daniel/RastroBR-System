let tooBusy = require("toobusy-js");

async function tooBusyCheck(req,res,next) {
    if(tooBusy()){
        res.status(503).send("Request Denied");
    }
    else{
        next();
    }
}
module.exports={tooBusyCheck};