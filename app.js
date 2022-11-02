const express=require('express');
const bodyParser= require('body-parser');
const MongoClient=require('mongodb').MongoClient;
const ObjectID =require('mongodb').ObjectID;
const router=express.Router();
const app=express();
const url=require('./secret');  
const logger=require('./logger'); 
// const { ObjectID } = require('bson');


// const PORT = 8081;
app.use(bodyParser.json());

const client=new MongoClient(url,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})

// app.use(bodyParser.json());


const emptyUserChecker = function (str) {
    if (typeof str === "string" && str.trim().length === 0) {
        return false;
    } else {
        return true;
    }
};


client.connect(err=> {
    if(err){
        console.log("cannot connect db" + err);
    }
    // console.log('ready');
    const myDB= client.db('people').collection('friends');
    app.get('/user/:name',(req,res)=>{
        console.log(req.params);
        myDB.find(req.params).toArray().then(results=>{
            console.log(results);
            res.contentType('application/json');
            res.send(JSON.stringify(results));
        })

    })

    // const myObj={name:"xyz"};
    // coll.insertOne(myObj,(err,res)=>{
    //     console.log('inserted');
    //     client.close(); 
    // });
    app.route('/users')
    .get((req,res)=>{
        myDB.find().toArray().then(results=>{
            console.log(results);
            res.contentType('application/json');
            res.send(JSON.stringify(results));
        })
    })
    // .post(async(req,res)=>{
    //     console.log(req.body);
    //    await myDB.insertOne(req.body).then(results=>{
    //         console.log(results,'testttt');
    //         res.contentType('application/json');
    //         res.send(JSON.stringify(req.body));
    //     })
    // })
    .post(async (req, res) => {
        try {
            console.log("REQ:", req.body)
            if (req.body.name == "") {
                res.status(400).send("Invalid user name")
            }
            else {
                const resp = await myDB.insertOne(req.body)
                res.contentType("application/json");
                res.send(JSON.stringify(resp));
            }
        } catch (err) {
            console.log("[ERROR:]", err)
        }
    })
    .put(async(req,res)=>{
        console.log(req.body);
       await myDB.findOneAndUpdate(
            {
                _id:ObjectID(req.body._id)
            },
            {$set:{
                name:req.body.name
            }},{
                upsert:false
            }).then(results=>{
            // console.log(results,'testttt');
            res.contentType('application/json');
            res.send({"status":true});
        })
        
    })
    .delete(async(req,res)=>{
        console.log(req.body);
       await myDB.deleteOne({
            _id:ObjectID(req.body._id)
       }).then(results=>{
            let boo =true;
            if(results.deletedCount==0){
                boo:false
            }
            res.send({"status":boo})
       })
       .catch(error=>console.log(error))
        
    })

})




app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html');
})

if(!module.parent){

    app.listen(8083,()=>{
        logger.log('info','server ready');
    })
}

module.exports = { emptyUserChecker };