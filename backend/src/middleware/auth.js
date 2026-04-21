// const { genSaltSync, hashSync,compareSync } = require("bcrypt")
const jwt  = require("jsonwebtoken")
module.exports.middleware = (req,res,next)=>{
    let token = req.get('authorization')
    if(!token){
        return res.status(401).send({error:"authorization error"})
    }else if(token){
        jwt.verify(token.slice(7),"key12wert", async (err,user)=>{
            if(user){
                if(user?.status !=0) return res.status(401).send({error:"Your account is restricted, contact support"})
                req.user = user
                next()
            }else{
                return res.status(401).send({error:"authorization error"})
              }
        })
     
    }

}
module.exports.adminmiddleware = (req,res,next)=>{
    let token = req.get('authorization')
    if(!token){
        return res.status(401).send({error:"authorization error"})
    }else if(token){
        jwt.verify(token.slice(7),"key12wert2456789ijhgfdsdfghjujhgfdfghjhgfnbgvfhgf", async (err,user)=>{
            if(user){
                req.user = user
                next()
            }else{
                return res.status(401).send({error:"authorization error"})
              }
        })
     
    }

}


