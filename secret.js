const dotenv=require("dotenv");


dotenv.config({path:'./config.env'});
const url= process.env.DATABASE;

module.exports =url;