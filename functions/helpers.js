const Request = require("request");
const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');
const REQUEST_URL = 'https://discoin.com/tests/api/v1';

exports.dbOperations = (obj) => {
    let db = obj.db
    let request = obj.request
    let dbName = obj.dbName
    let type = obj.type
    let data = obj.data
    let data2 = obj.data2
    let keys = {
        url:'',
        secret:'',
        discoinBusinessId:''
    }
    let hashedPassword
    

    let verify = {
        password: '',
        id:'',
    }
    return new Promise((resolve, reject) => {
        if(typeof dbName === 'object') {
            if(type === 'addUserKeys') {
                if(!data.businessAccount.accountNumber){
                    resolve({error:'Missing YAPSI Business Account Number'}) 
                }
                db.collection(dbName[0]).doc(data.dcId).update(data)
                .then(doc => {
                    let result = []
                    db.collection('users').doc(data.dcId).get()
                    .then(doc2 => {
                        let keys_length = data.keys.length
                        if(keys_length > 0){
                            keys_length = keys_length - 1
                        }
                        keys.url = doc2.data().keys[keys_length].url
                        keys.secret = doc2.data().keys[keys_length].secret
                        keys.discoinBusinessId = data.businessAccount.accountNumber
                        
                        if(keys.url !== "" && keys.url !== " "){
                            db.collection('keys').doc(doc2.data().keys[keys_length].public)
                            .set(keys)
                            .then((userResult) => {
                                resolve(doc2.data())
                            }).catch(err =>{
                                reject({error:err})
                            })
                        }else{
                            resolve({error:'Missing Secret Key URL'})
                        }
                    }).catch(err => {
                        reject(err)
                    });
                }).catch(err => {
                    reject(err)
                });
            }
            if(type === 'updatePassword') {
                db.collection('verify').doc(data.email).get()
                .then(doc0 => {
                    db.collection('users').doc(doc0.data().id).get()
                    .then(doc1 => {
                        bcrypt.hash(data.password, 10, (err, hash) => {
                            if(err){
                                resolve({error:"password"})
                            }else{
                                let user = {
                                    "password": hash,
                                    "first_last_name": doc1.data().first_last_name,
                                    "first_name": doc1.data().first_name,
                                    "keys": doc1.data().keys,
                                    "businessAccount": doc1.data().businessAccount,
                                    "dcId": doc1.data().dcId,
                                    "transactions": doc1.data().transactions,
                                    "email": doc1.data().email,
                                    "domains": doc1.data().domains,
                                    "second_last_name": doc1.data().second_last_name
                                }

                                let verify = {
                                    "id": doc1.data().dcId,
                                    "password":hash
                                }
                                
                                db.collection('users').doc(doc0.data().id).update(user)
                                .then(doc => {
                                    db.collection('verify').doc(data.email).update(verify)
                                    .then((userResult) => {
                                        resolve(user)
                                    }).catch(err1 =>{
                                        reject(err1)
                                    })
                                }).catch(err2 => {
                                    reject(err2)
                                })
                            }
                        })
                    })
                }).catch(err => {
                    reject(err)
                });
            }
            if(type === 'updateUser') {
                db.collection(dbName[0]).doc(data.dcId).update(data)
                .then(doc => {
                    db.collection('users').doc(data.dcId).get()
                    .then(doc2 => {
                        verify.id = doc2.data().id
                        if(doc2.data().password !== data.password){
                            db.collection('verify').doc(data.email)
                            .update(verify)
                            .then((userResult) => {
                                resolve(doc2.data())
                            }).catch(err =>{
                                reject(err)
                            })
                        }else
                        if(doc2.data().email !== data.email){
                            db.collection('verify').doc(data.email)
                            .set(verify)
                            .then((userResult) => {
                                resolve(doc2.data())
                            }).catch(err =>{
                                reject(err)
                            })
                        }else{
                            resolve(doc2.data())
                        }
                        
                    }).catch(err => {
                        reject(err)
                    });
                }).catch(err => {
                    reject(err)
                });
            }
        }else
        if(typeof dbName === 'string' && type === 'verifyUser') {
            db.collection('verify').doc(data.email).get()
            .then(doc => {
                let result = []
                if (!doc.exists) {
                    resolve({error:"Incorrect login. Check your email or password 1"})
                } else {
                    bcrypt.compare(data.password, doc.data().password, (err, result) => {
                        if(err){
                            resolve({error:"Incorrect login. Check your email or password 2 "+err})
                        }else
                        if(result){
                            db.collection('users').doc(doc.data().id).get()
                            .then(doc2 => {
                                resolve(doc2.data())
                            }).catch(err => {
                                reject(err)
                            });
                        }else{
                            resolve({error:"Incorrect login. Check your email or password 3 "+result})
                        }
                    })                
                }
            }).catch(err => {
                reject(err)
            });
        }else
        if(typeof dbName === 'string' && type === 'link') {
            let newData = {
                password: data.businessAccount.password,
                email: data.businessAccount.email,
                platform_id: 3,
                language_id: 1
            }
            
            Request.post({
                "headers": { 
                    "content-type": "application/x-www-form-urlencoded",
                    'Access-Control-Allow-Origin': '*',
                    'Accept': 'application/json'
                },
                "url": REQUEST_URL+obj.url,
                form: newData
            }, (error, response, body) => {
                if(error) {
                    resolve({error:error})
                }
                let rep = JSON.parse(body)

                if(rep.error) {
                    resolve(rep)
                }else{
                    data.businessAccount.id = rep.user.id
                    data.businessAccount.picture = rep.user.picture
                    data.businessAccount.accountNumber = rep.user.account_number
                    db.collection('users').doc(data.dcId).update(data)
                    .then(doc => {
                        db.collection('users').doc(data.dcId).get()
                        .then(doc2 => {
                            resolve(doc2.data())
                        }).catch(err => {
                            resolve({error:err})
                        });
                    }).catch(err => {
                        resolve({error:err})
                    });
                }
                
            });
        }else
        if(typeof dbName === 'string' && type === 'verifyTransaction') {
            db.collection('keys').doc(data.publicKey).get()
                .then(doc0 => {
                    if(!doc0.data().url){
                        resolve(
                            {
                                valid:false,
                                message:"Missing URL"
                            }
                        )
                    }
                    Request.post({
                        "headers": { 
                            "content-type": "application/x-www-form-urlencoded",
                            'Access-Control-Allow-Origin': '*',
                            'Accept': 'application/json',
                            'publicKey': data.publicKey,
                            'cartId': data.cartId,
                        },
                        "url": doc0.data().url,
                        form: data
                    }, (error, response, body) => {
                        
                        if(error) {
                            let er = JSON.parse(error)
                            if(er.code === "ECONNREFUSED"){
                                resolve({
                                    error:{
                                        message: "Incorrect URL",
                                        url: er.address,
                                    }
                                })
                            }else{
                                resolve({error:error})
                            }
                        }
                        const secret = JSON.parse(body)
                        
                        if(secret.result === 0){
                            resolve(
                                {
                                    valid:false,
                                    message:"The Cart Id is not correct: "+data.cartId,
                                }
                            )  
                        }
                        if(secret.result === 1){
                            resolve(
                                {
                                    valid:false,
                                    message:"Secret Key error. Check secret key file",
                                    url:doc0.data().url,
                                }
                            )  
                        }
                        let result = []
                        if (!doc0.exists) {
                            resolve({valid:false})
                        } else {
                            if(doc0.data().secret === secret.result){
                                db.collection('transactions').doc(doc0.data().discoinBusinessId)
                                .get()
                                .then((transactionResult) => {
                                    db.collection('products').doc(doc0.data().discoinBusinessId).get()
                                    .then(products => {
                                        data2[obj.tid].amount = products.data()[data.productId].amount
                                        data2[obj.tid].title = products.data()[data.productId].title
                                        data2[obj.tid].imageURL = products.data()[data.productId].imageURL
                                        if (!transactionResult || !transactionResult.exists) {
                                            db.collection('transactions').doc(doc0.data().discoinBusinessId)
                                            .set(data2)
                                            .then((userResult) => {
                                                resolve({
                                                    valid:true,
                                                    bussinessId:doc0.data().discoinBusinessId,
                                                    product:products.data()[data.productId]
                                                })
                                            }).catch(err =>{
                                                resolve({error:err+"0"})
                                            })
                                        }else{
                                            let transData = transactionResult.data()
                                            data2 = Object.assign(data2, transData)
                                            db.collection('transactions').doc(doc0.data().discoinBusinessId)
                                            .update(data2)
                                            .then((userResult) => {
                                                db.collection('products').doc(doc0.data().discoinBusinessId).get()
                                                .then(products => {
                                                    resolve({
                                                        valid:true,
                                                        bussinessId:doc0.data().discoinBusinessId,
                                                        product:products.data()[data.productId]
                                                    })
                                                })
                                            }).catch(err =>{
                                                resolve({error:err+"00"})
                                            })
                                        }
                                    })
                                }).catch(err =>{    
                                    resolve({error:err+"0000"})
                                })
                            }else if(secret.result[data.cartId]){
                                db.collection('transactions').doc(doc0.data().discoinBusinessId)
                                .get()
                                .then((transactionResult) => {
                                    
                                        data2[obj.tid].amount = secret.result[data.cartId].total
                                        data2[obj.tid].title = "Discoin Cart"
                                        data2[obj.tid].imageURL = ""
                                        data2[obj.tid].shoppingCart = secret.result[data.cartId]
                                        
                                        if (!transactionResult || !transactionResult.exists) {
                                            db.collection('transactions').doc(doc0.data().discoinBusinessId)
                                            .set(data2)
                                            .then((userResult) => {
                                                resolve({
                                                    valid:true,
                                                    bussinessId:doc0.data().discoinBusinessId,
                                                    product:data2
                                                })
                                            }).catch(err =>{
                                                resolve({error:err+"0"})
                                            })
                                        }else{
                                        
                                            let transData = transactionResult.data()
                                            data2 = Object.assign(data2, transData)

                                            resolve({
                                                valid:true,
                                                bussinessId:doc0.data().discoinBusinessId,
                                                product:data2
                                            })
                                            
                                            db.collection('transactions').doc(doc0.data().discoinBusinessId)
                                            .update(data2)
                                            .then((userResult) => {
                                               
                                                    resolve({
                                                        valid:true,
                                                        bussinessId:doc0.data().discoinBusinessId,
                                                        product:data2
                                                    })
                                            
                                            }).catch(err =>{
                                                resolve({error:err+"00"})
                                            })
                                        }
                                }).catch(err =>{    
                                    resolve({error:err+" 0000"})
                                })  
                            }
                        }                    
                    });
            }).catch(err => {
                reject(err)
            });
        }else
        if(typeof dbName === 'string' && type === 'getTransactions') {
            db.collection('transactions').doc(data.businessAccount.accountNumber)
            .get()
            .then((transactionResult) => {
                if (!transactionResult || !transactionResult.exists) {
                    resolve({error:"No Transactions Found"})
                }else{
                    resolve(transactionResult.data())
                }
            }).catch(err =>{    
                resolve({error:err+"0000"})
            })
        }else
        if(typeof dbName === 'string' && type === 'addProduct') {
            db.collection('users').doc(data.dcId).update(data)
            .then(doc => {
                if(data.products.length === 1){
                    db.collection('products').doc(data.businessAccount.accountNumber)
                    .set(data2)
                    .then((prods) => {
                        db.collection('users').doc(data.dcId).get()
                        .then(doc2 => {
                            resolve(doc2.data())
                        }).catch(err => {
                            resolve({error:err})
                        });
                    }).catch(err =>{
                        resolve({error:err+"0"})
                    })
                }else if(data.products.length > 1){
                    db.collection('products').doc(data.businessAccount.accountNumber).update(data2)
                    .then(prods => {
                        db.collection('users').doc(data.dcId).get()
                        .then(doc2 => {
                            resolve(doc2.data())
                        }).catch(err => {
                            resolve({error:err+"i"})
                        });
                    })
                }
                
            }).catch(err => {
                resolve({error:err+"k"})
            });
            
        }else
        if(typeof dbName === 'string' && type === 'addUser') {
            db.collection(dbName).get().then(snapshot => {
                let result = []
                snapshot.forEach(doc => {
                    result.push(doc.id)
                });
                data.dcId = 'dcId_'+result.length
                verify.id = data.dcId
                
                if(snapshot){
                    if(type === 'addUser'){
                        db.collection('verify').doc(data.email)
                        .get()
                        .then((verifyResult) => {
                            if (!verifyResult || !verifyResult.exists) {
                                bcrypt.hash(data.password, 10, (err, hash) => {
                                    if(err) {
                                        resolve({error:"Password error"})
                                    }else{
                                        data.password = hash
                                        verify.password = hash
                                        db.collection(dbName).doc('dcId_'+result.length)
                                        .set(data)
                                        .then((userResult) => {
                                            db.collection('verify').doc(data.email)
                                            .set(verify)
                                            .then((userResult) => {
                                                resolve(data)
                                            }).catch(err =>{
                                                console.log(err)
                                            })
                                        }).catch(err =>{
                                            console.log(err)
                                        })
                                    }
                                })
                                
                            }else{
                                resolve({error:'User already exists'})
                            }
                        }).catch(err =>{
                            console.log(err)
                        })
                    }else
                    if(type === 'count'){
                        resolve(result.length)
                    }else{
                        resolve(result)
                    }
                    
                }else{
                    reject(result)
                }
            }).catch(err =>{
                if(type === 'addUser'){
                    db.collection('verify').doc(data.email)
                    .get()
                    .then((verifyResult) => {
                        if (!verifyResult || !verifyResult.exists) {
                            bcrypt.hash(data.password, 10, (err, hash) => {
                                if(err) {
                                    resolve({error:"Password error"})
                                }else{
                                    data.password = hash
                                    verify.password = hash
                                    db.collection(dbName).doc('dcId_'+result.length)
                                    .set(data)
                                    .then((userResult) => {
                                        db.collection('verify').doc(data.email)
                                        .set(verify)
                                        .then((userResult) => {
                                            resolve(data)
                                        }).catch(err =>{
                                            console.log(err)
                                        })
                                    }).catch(err =>{
                                        console.log(err)
                                    })
                                }
                            })
                            
                        }else{
                            resolve({error:'User already exists'})
                        }
                    }).catch(err =>{
                        console.log(err)
                    })
                }else
                if(type === 'count'){
                    resolve(result.length)
                }else{
                    resolve(result)
                }
                reject(err)
            })
        }
    }).catch((message) => {
        console.log(message)
    })
}

exports.getAll = (db,dbName) => {
    return new Promise((resolve, reject) => {
        db.collection(dbName).get().then(snapshot => {
            //console.log(doc)
            let result = []
            snapshot.forEach(doc => {
                result.push(doc.data())
            });
            if (!doc || !doc.exists) {
                throw new Error("Profile doesn't exist")
            }
            return result
        }).catch(err =>{
            console.log(err)
        })
    }).catch((message) => {
        console.log(message)
    })
}

exports.randomString = (comp) => {
        function doIt(){
           var s= '';
           if(typeof comp === "string"){
               L = comp.length;
           }else{
               L = comp;
           }
           function char(){
               if(comp !== s){
                   var n = Math.floor(Math.random()*62);
                   if(s.length > 1){
                        if(n < 10) return n; //1-10
                        if(n < 36) return String.fromCharCode(n + 55); //A-Z
                        if(n < 62) return String.fromCharCode(n + 61); //a-z
                   }else{
                       if(n < 26) return String.fromCharCode(n + 65); //A-Z
                           if(n < 32) return String.fromCharCode(n + 59); //a-z
                       if(n < 58) return String.fromCharCode(n + 65); //a-z
                   }
               }else{
                   s = "";
                   char()
               }
           }
           while(s.length < L && s !== undefined){
               s += char();
           }
           if(s.search("undefined") < 0 && s !== undefined){
               return s;
           }else{
               return false;
           }
        }
        var s = doIt()
        while(s === false){
           s = doIt()
        }
        //alert(s)
        return s;
}