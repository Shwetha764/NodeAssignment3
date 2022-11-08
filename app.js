const express=require('express');
const bodyParser= require('body-parser');
const app = express();
const url=require('./secret');  
const logger=require('./logger'); 
const userRouter=require('./routes');
const swaggerJSDoc=require('swagger-jsdoc');
const swaggerUi=require('swagger-ui-express');


app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


emptyUserChecker = function (str) {
    if (typeof str === "string" && str.trim().length === 0) {
        return false;
    } else {
        return true;
    }
};

const options ={
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Nodejs API project',
            version: '1.0.0'
        },
        servers:[{
            url: 'http://localhost:8082/'
        }]
    },
    apis: ['./app.js']
}

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Fetch users 
/**
 * @swagger
 *      components:
 *          schema:
 *              Node:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *     
 */


/**
 * @swagger
 * /users:
 *  get:
 *      summary: fetch users
 *      description: fetch users
 *      responses:
 *        200:
 *          description: fetch data from mongodb
 *          content:
 *              application/json: 
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#components/schema/Node'
 */


//Add user

/**
 * @swagger
 * /users:
 *  post:
 *      summary: used to insert data to mongodb
 *      description: this api is used insert data
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/Node'
 *      responses: 
 *          200:
 *              description: Added successfully
 */
app.route('/users')
	.get(userRouter.getUsers)
	.post(userRouter.storeUser)
    .delete(userRouter.deleteUser)
    .put(userRouter.updateUser);





/**
 * @swagger
 * /user/{name}:
 *  get:
 *      summary: filter users
 *      description: filter users
 *      parameters:
 *          - in: path
 *            name: name
 *            required: true
 *            description: String name required
 *            schema:
 *              type: string
 *      responses:
 *        200:
 *          description: filter data from mongodb
 *          content:
 *              application/json: 
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#components/schema/Node'
 */


//delete users

/**
 * @swagger
 * /user/{name}:
 *  delete:
 *      summary: delete user by name
 *      description: delete users
 *      parameters:
 *          - in: path
 *            name: name
 *            required: true
 *            description: String name required
 *            schema:
 *              type: string
 *      responses:
 *        200:
 *          description: delete data from mongodb
 */
    
//UPDATE users

/**
 * @swagger
 * /user/{name}:
 *  put:
 *      summary: update user
 *      description: update user
 *      parameters:
 *          - in: path
 *            name: name
 *            required: true
 *            description: String name required
 *            schema:
 *              type: string
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/Node'
 *      responses:
 *        200:
 *          description: updated sucessfully
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#components/schema/Node'
 */

app.route('/user/:name')
	.get(userRouter.getUser)
    .delete(userRouter.deleteUserbyName)
    .put(userRouter.updateUserbyName)

/**
 * @swagger
 * /:
 *  get:
 *      summary: This api is used to check if get method is working or not
 *      description: This api is used to check if get method is working or not
 *      responses:
 *          200:
 *              description: To test Get Method 
 */

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html');
})


// if(!module.parent){
app.listen(8083,()=>{
        logger.log('info','server ready ....');
    })
// }


module.exports= {emptyUserChecker,app};

// export default app