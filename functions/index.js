const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dbFunctions = require('./helpers');
const cors = require('cors');
const nodemailer = require('nodemailer');
//const serviceAccount = require('./ServiceAccountKey.json');
var serviceAccount = require("./discoinpay-api-firebase.json");
//*
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://discoinpay-api.firebaseio.com"
});
//*/
const express = require('express');

//admin.initializeApp(functions.config().firebase);
//const firestore = new Firestore();
//const settings = { timestampsInSnapshots: true};
//firestore.settings(settings);
const db = admin.firestore();

const app = express();
app.use(cors());


app.post('/email', (req, res) => {
    

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        if(err){
            return res.status(401).send({
                status:401,
                message: 'error',
                data: {
                    result: err,
                }
            }) 
        }
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            //host: 'smtp.ethereal.email',
            //port: 587,
            //secure: false, // true for 465, false for other ports
            service: 'gmail',
            auth: {
                user: 'discoinpay@zoho.com', // generated ethereal user
                pass: '[1]Discoinpay1' // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"No Reply" <discoinpay@zoho.com>', // sender address
            to: 'sampladoc@gmail.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world?', // plain text body
            html: '<b>Hello world?</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                //return console.log(error);
            }

            if(error){
                return res.status(401).send({
                    status:401,
                    message: 'error',
                    data: {
                        result: error,
                    }
                }) 
            }else{
                return res.send({
                    status:200,
                    message: 'success',
                    data: {
                        result: info,
                    }
                }) 
            }
            
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
})

///=============================================================== ADD
app.put('/generate/keypair', (req, res) => {
    /* 
    In the request body we need to have the developerID
    the developer key object will look like this
    {
        developerId:'dcId_0',
        keys: {
            public:[],
            private:[],
        }
    }
    */
    let pk = 'pk_'+dbFunctions.randomString(20)
    let sk = 'sk_'+dbFunctions.randomString(24)
    let reqObj = req.body
    reqObj.keys.push({public:pk, secret:sk, url:req.body.url || ''})
    
    let ob = {
        db:db,
        dbName:['users','keys'],
        type:'addUserKeys',
        data: reqObj,
    }
    delete req.body.url
    let body = req.body
    dbFunctions.dbOperations(ob).then((message) => {  
        if(message.error){
            return res.status(401).send({
                status:401,
                message: 'error',
                data: {
                    result: message,
                }
            }) 
        }else{
            return res.send({
                status:200,
                message: 'success',
                data: {
                    result: message,
                }
            }) 
        }
        
    }).catch(err =>{
        console.log(err)
    })
})
app.put('/user/update', (req, res) => {
        
    let reqObj = req.body
    let ob = {
        db:db,
        dbName:['users','keys'],
        type:'updateUser',
        data: reqObj,
    }
    delete req.body.url
    let body = req.body
    
    dbFunctions.dbOperations(ob).then((message) => {  
        if(message.error){
            return res.status(401).send({
                status:401,
                message: 'error',
                data: {
                    result: message,
                }
            }) 
        }else{
            return res.send({
                status:200,
                message: 'success',
                data: {
                    result: message,
                }
            }) 
        }
    }).catch(err =>{
        console.log(err)
    })
})

app.post('/user/password/code', (req, res) => {
    
    let reqObj = req.body
    let ob = {
        db:db,
        dbName:['users','keys'],
        type:'updatePassword',
        data: reqObj,
    }
    delete req.body.url
    let body = req.body
    const verifyCode = dbFunctions.randomString(10)

    // create reusable transporter object using the default SMTP transport
    nodemailer.createTestAccount((err, account) => {
        if(err){
            return res.status(401).send({
                status:401,
                message: 'error',
                data: {
                    results: err,
                }
            }) 
        }
        /*
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            //service: 'gmail',
            auth: {
                user: 'discoinpay@gmail.com', // generated ethereal user
                pass: '[1]Discoin1', // generated ethereal password
            }
        });
    

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"DiscoinPay" <discoinpay@zoho.com>', // sender address
            to: ob.data.email, // list of receivers
            subject: 'Reset password', // Subject line
            text: 'Password code: '+verifyCode, // plain text body
            html: '<b>Password code:</b><br>'+verifyCode // html body
        };
        //*/
        let mailOptions = {
            from: '"DiscoinPay" <'+account.user+'>', // sender address
            to: ob.data.email, // list of receivers
            subject: 'Reset password', // Subject line
            text: 'Password code: '+verifyCode, // plain text body
            html: '<b>Password code:</b><br>'+verifyCode // html body
        };
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: account.user, // generated ethereal user
                pass: account.pass  // generated ethereal password
            }
        });
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                return res.status(401).send({
                    status:401,
                    message: 'error',
                    data: {
                        rresults: error,
                        test: ob.data.email,
                    }
                }) 
            }else{
                return res.send({
                    status:200,
                    message: 'success',
                    data: {
                        result: verifyCode,
                        //account: account,
                    }
                }) 
            } 
        });

    })
})

app.put('/user/update/password', (req, res) => {
    
    let reqObj = req.body
    let ob = {
        db:db,
        dbName:['users','keys'],
        type:'updatePassword',
        data: reqObj,
    }
    delete req.body.url
    let body = req.body
   
    dbFunctions.dbOperations(ob).then((message) => {  
        if(message.error){
            return res.status(401).send({
                status:401,
                message: 'error',
                data: {
                    result: message,
                }
            }) 
        }else{
            return res.send({
                status:200,
                message: 'success',
                data: {
                    result: message,
                }
            }) 
        }
    }).catch(err =>{
        console.log(err)
    })
})

app.post('/developer/signup', (req, res) => {
    
    let obj = {
        dcId:'',
        transactions: [],
        keys:[],
        domains:[],
        verificationCode:dbFunctions.randomString(10),
        verified:false,
        businessAccount:{
            email:'',
            id:'',
            accountNumber:'',
            picture:'',
        }
    }
    
    let body = Object.assign(obj, req.body)
    let ob = {
        db:db,
        dbName:'users', 
        type:'addUser',
        data: body,
    }
    dbFunctions.dbOperations(ob).then((message) => {  
        if(message.error){
            return res.status(401).send({
                status:401,
                message: 'error',
                data: {
                    result: message,
                }
            }) 
        } 
        /*
        Production
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            //service: 'gmail',
            auth: {
                user: 'discoinpay@gmail.com', // generated ethereal user
                pass: '[1]Discoinpay1' // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"DiscoinPay" <discoinpay@gmail.com>', // sender address
            to: ob.data.email, // list of receivers
            subject: 'Verify email', // Subject line
            text: 'Verification code: '+ob.data.verificationCode, // plain text body
            html: '<b>Verification code:</b><br>'+ob.data.verificationCode // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            
            if(error){
                return res.status(401).send({
                    status:401,
                    message: 'error',
                    data: {
                        result: error,
                    }
                }) 
            }else{
                return res.send({
                    status:200,
                    message: 'success',
                    data: {
                        result: message,
                    }
                }) 
            }
            
        });
        //*/
        nodemailer.createTestAccount((err, account) => {
            if(err){
                return res.status(401).send({
                    status:401,
                    message: 'error',
                    data: {
                        results: err,
                    }
                }) 
            }
            /*
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // use SSL
                //service: 'gmail',
                auth: {
                    user: 'discoinpay@gmail.com', // generated ethereal user
                    pass: '[1]Discoinpay1', // generated ethereal password
                }
            });
        
            let mailOptions = {
                from: '"DiscoinPay" <discoinpay@gmail.com>', // sender address
                to: ob.data.email, // list of receivers
                subject: 'Reset password', // Subject line
                text: 'Password code: '+ob.data.verificationCode, // plain text body
                html: '<b>Password code:</b><br>'+ob.data.verificationCode // html body
            };
            //*/
            let mailOptions = {
                from: '"DiscoinPay" <'+account.user+'>', // sender address
                to: ob.data.email, // list of receivers
                subject: 'Reset password', // Subject line
                text: 'Password code: '+ob.data.verificationCode, // plain text body
                html: '<b>Password code:</b><br>'+ob.data.verificationCode // html body
            };
            let transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: account.user, // generated ethereal user
                    pass: account.pass  // generated ethereal password
                }
            });
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if(error){
                    return res.status(401).send({
                        status:401,
                        message: 'error',
                        data: {
                            result: error,
                        }
                    }) 
                }else{
                    return res.send({
                        status:200,
                        message: 'success',
                        data: {
                            result: message,
                        }
                    }) 
                }
            });
    
        })
        
    }).catch(err =>{
        console.log(err)
    })
    
})

app.post('/developer/signin', (req, res) => {
    /*
    password should be sent encoded to be decoded and matched with its counterpart in database also after it is decoded
    response is an object with all the user data
    {
        email:"sampladoc@gmail.com",
        discoinBusinessEmail:'',
        name:"Lopez Oliver",
        dcId:"0003",
        password: "test",
        discoinBusinessPassword:'',
        transactions: [],
        keys:[
            {
              public:'',
              private:'',
              url:'',
            }
        ],
        discoinBusinessId: ''
    }
    */
    let ob = {
        db:db,
        dbName:'users',
        type:'verifyUser',
        data: req.body,
    }
    let body = req.body
    dbFunctions.dbOperations(ob).then((message) => {  
        if(message.error){
            return res.status(401).send({
                status:401,
                message: 'error',
                data: {
                    result: message,
                }
            }) 
        }else{
            return res.send({
                status:200,
                message: 'success',
                data: {
                    result: message,
                }
            }) 
        } 
    }).catch(err =>{
        console.log(err)
    })
})

app.post('/developer/token', (req, res) => {
    /*
    password should be sent encoded to be decoded and matched with its counterpart in database also after it is decoded
    response is an object with all the user data
    {
        "email":"sampladoc@gmail.com",
        "password": "test",
        "platform_id": "3",
        "language_id": "1",
    }
    */
    
    let ob = {
        db:db,
        dbName:'users',
        type:'link',
        data: req.body,
        url: '/user/login',
    }
    
    dbFunctions.dbOperations(ob).then((message) => {  
        if(message.error){
            return res.status(401).send({
                status:401,
                message: 'error',
                data: {
                    result: message,
                }
            }) 
        }else{
            return res.send({
                status:200,
                message: 'success',
                data: {
                    result: message,
                }
            }) 
        }  
    }).catch(err =>{
        console.log(err)
    })
})

app.post('/transaction/verify', (req, res) => {
    /*
    password should be sent encoded to be decoded and matched with its counterpart in database also after it is decoded
    response is an object with all the user data
    {
        "public": "",
    }
    */
    let tid = dbFunctions.randomString(20)
    let moreInfo = {}
    let additionalInfo = {
        productID: req.body.productId,
        cartID: req.body.cartId,
        timeStamp: Date.now() / 1000 | 0,
        amount: 0,
        title:'',
        imageURL:'',
        type:'initiated',
        shoppingCart: [],
    } 

    moreInfo[tid] = additionalInfo

    let ob = {
        db:db,
        dbName:'users',
        type:'verifyTransaction',
        data: req.body,
        data2: moreInfo,
        tid:tid,
    }

    dbFunctions.dbOperations(ob).then((message) => {  
        if(message.error){
            return res.send({
                status:401,
                message: 'error',
                data: {
                    result: message,
                }
            }) 
        }else{
            return res.send({
                status:200,
                message: 'success',
                data: {
                    result: message,
                }
            }) 
        } 
    }).catch(err =>{
        console.log(err)
    })
    
})

app.post('/transactions/get', (req, res) => {
    
    let ob = {
        db:db,
        dbName:'users',
        type:'getTransactions',
        data: req.body,
    }

    dbFunctions.dbOperations(ob).then((message) => {  
        if(message.error){
            return res.send({
                status:401,
                message: 'error',
                data: {
                    result: message,
                }
            }) 
        }else{
            return res.send({
                status:200,
                message: 'success',
                data: {
                    result: message,
                }
            }) 
        } 
    }).catch(err =>{
        console.log(err)
    })
    
})

app.post('/product/add', (req, res) => {
    
    let pid = 'pid_'+dbFunctions.randomString(16)
    let moreInfo = {}
    let additionalInfo = {
        productID: req.body.productId,
        timeStamp: Date.now() / 1000 | 0,
        amount: req.body.amount,
    } 

    if(!req.body.products[req.body.products.length - 1].productId){
        req.body.products[req.body.products.length - 1].productId = pid
    }
    if(req.body.products.length === 1){
        moreInfo[req.body.products[req.body.products.length - 1].productId] = req.body.products[req.body.products.length - 1]
    }else if(req.body.products.length > 1){
        for(let i = 0; i < req.body.products.length; i++){
            moreInfo[req.body.products[i].productId] = req.body.products[i]
        }
    }
    

    let ob = {
        db:db,
        dbName:'products',
        type:'addProduct',
        data: req.body,
        data2: moreInfo,
    }

    dbFunctions.dbOperations(ob).then((message) => {  
        if(message.error){
            return res.send({
                status:401,
                message: 'error',
                data: {
                    result: message,
                }
            }) 
        }else{
            return res.send({
                status:200,
                message: 'success',
                data: {
                    result: message,
                }
            }) 
        } 
    }).catch(err =>{
        console.log(err)
    })
    
})

exports.api = functions.https.onRequest(app);

//firebase serve --only functions,hosting
