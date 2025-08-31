let rateLimit = require("express-rate-limit");

let rateLimiter = rateLimit({
    max:300,
    windowMs: 24*60*60*1000, //24h
    message:"request limit of 300 requests per 24h exceeded"
});

module.exports={rateLimiter};