/////////////////////////
const mongoose = require("mongoose");
// const MongoClient=require('mongodb').MongoClient;
// const ObjectID =require('mongodb').ObjectID;
const url=require('./secret');  
const logger=require('./logger'); 



mongoose.connect(url,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=> logger.info("connection sucessful..."))
// .catch((err)=> logger.info(err));

const userSchema=new mongoose.Schema({
  name:String
})
 

const myDB=new mongoose.model("User",userSchema);


// //get users
module.exports.getUsers = (req, res) => {
    logger.info('GET ALL USERS')
    myDB.find().then(results => {
        res.contentType('application/json');
        res.send(JSON.stringify(results));
    })
}


//ADD USERS
module.exports.storeUser = async (req, res) => {
    logger.info('STORE USER IN DATABASE', JSON.stringify(req.body))
    if (req.body.name == " "){
        res.status(400).send("Invalid user name");
    }   
    else{
        const resp= await myDB.create(req.body);
        // console.log(23456);
        res.contentType("application/json");
        res.send(JSON.stringify(resp));
    }
    
}

//filter user
module.exports.getUser = async (req, res) => {
    logger.info('GET METHOD', JSON.stringify(req.params))
    await myDB.find(req.params).then(results => {
        res.contentType('application/json');
        if(results.length === 0){
            res.status(404).json("User not present");
        }
        else{
            res.json(results);
        }
    })
}



//delete user

module.exports.deleteUser = async (req, res) => {
    logger.info('DELETE USER FROM DATABASE', JSON.stringify(req.body))
    // console.log(3333333333,req.body);
    if(req.body.name==" " || req.body._id==" "){
        res.status(500).json("User not present");
    }
    else{
        await myDB.deleteOne(
            {
            _id: req.body._id
            }).then(results=>{
                // console.log(results);
                    let boo =true;
                        if(results.deletedCount==0){
                            boo:false
                        }
                    res.send({"status":boo})
            })
            // .catch(error=>{
            //     res.status(500).send(error);
            // })
    }
}

//delete user by name

module.exports.deleteUserbyName = async (req, res) => {
    logger.info('DELETE USER FROM DATABASE')

    await myDB.deleteOne(
        {
        name: req.params.name
        }).then(results=>{
            // console.log(results);
                let boo =true;
                    if(results.deletedCount==0){
                        boo:false
                    }
                res.status(boo).send("Sucessfully deleted")
        })
        .catch(error=>console.log(error))
        
        // , (err,result)=>{
        //     if (err) throw err
        //     res.send('User is deleted')
        // })
}


//update user

module.exports.updateUser = async (req, res) => {
    logger.info('UPDATE USER IN DATABASE', JSON.stringify(req.body));
    if(req.body.name==" " && req.body._id==" "){
        res.status(400).json("User not present");
    
    }
    else if(req.body._id==" "){
        res.status(500).json("User not present");
    }
    else{

        await myDB.findOneAndUpdate(
            {
              _id: req.body._id
            }, 
            {
            $set: {
                name: req.body.name
                }
            }, 
            { 
                upsert: false 
            }
            // , function(err,doc){
            //     if (err) return res.send(500,{error:err});
            //     else{
            //             logger.info('RESPONSE', JSON.stringify(results))
            //             res.contentType('application/json');
            //             res.send({status:true});
            //             // res.status(true).send("sucess");
            //     }
    
            // }
            ).then(results=>{
                logger.info('RESPONSE', JSON.stringify(results))
                res.contentType('application/json');
                res.send({status:true});
            })
    }
}



//update user by name

module.exports.updateUserbyName = async (req, res) => {
    logger.info('UPDATE USER IN DATABASE');
    await myDB.findOneAndUpdate(
        {
          name: req.params.name
        }, 
        {
        $set: {
            name: req.body.name
            }
        }, 
        { 
            upsert: false 
        }).then(results=>{
            res.send({"status":true})
        })
        .catch(error=>console.log(error))
}

