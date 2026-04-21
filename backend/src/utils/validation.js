const { order,userbio,users,bankdetails } = require("./schema.js");


module.exports.validateOrder = (req,res,next)=>{
    validate(req,res,next,order)
}
module.exports.validateuserbio = (req,res,next)=>{
    validate(req,res,next,userbio)
}
module.exports.validateusers = (req,res,next)=>{
    validate(req,res,next,users)
}
module.exports.validatebankdetails = (req,res,next)=>{
   validate(req,res,next,bankdetails)
}

const validate = (req,res,next,schemadata)=>{
    let errors = []
    let schema = Object.keys(schemadata)
    let data = req.body
    for (let x of schema) {
       if(!data[x] && schemadata[x]) errors.push(schemadata[x].msg) 
    }
    if(errors.length > 0) return res.send({error:errors})
    next()
}