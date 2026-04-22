const { save, fetch } = require('../../db/db.js')
const  jwt   = require('jsonwebtoken')
const bcrypt  = require('bcrypt')
const { handleError }  = require("../../utils/error.js");
const crypto  = require('crypto')
const { sendEmail }  = require('../../utils/sendEmail.js');
const { default: axios } = require('axios');

const getUserState = async (userId) => {
   const bio = await fetch('SELECT userid, status FROM "userbio" WHERE "userid" = $1',[userId])
   const bank = await fetch('SELECT userid FROM "bankdetails" WHERE "userid" = $1',[userId])

   let step = 0
   if(bank?.length == 0) step = 3
   if(bio?.length == 0) step = 2

   let kyc = false
   if(bio?.length > 0 && bio[0].status === 1) {
      kyc = true
   }

   return { step, kyc }
}

module.exports.createAdminUser = async (req, res) => {
   try {
        const salt = bcrypt.genSaltSync(10)
        const password = bcrypt.hashSync(req.body.password,salt)
        await save(
          'INSERT INTO "admins" ("username", "password") VALUES ($1, $2) RETURNING id',
          [req.body.username, password]
        )
        res.send({success:true})    
   } catch (error) {
      handleError(error, res)
   }
}

module.exports.createUser = async (req, res) => {
   try {
        const salt = bcrypt.genSaltSync(10)
        const password = bcrypt.hashSync(req.body.password,salt)
        const userdata = await save(
          'INSERT INTO "users" ("firstName", "lastName", "phone", "email", "password") VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [req.body.firstName, req.body.lastName, req.body.phone, req.body.email, password]
        )
        let user = {...req.body}
        delete user.password
        let token = jwt.sign({...user,id:userdata.insertId,status:0},"key12wert",{
         expiresIn:'24h'
        })
        res.send({user,token})    
   } catch (error) {
      handleError(error, res)
   }
}
module.exports.createUserBio = async (req, res) => {
   console.log(req.user)
   try {
        const data = await save(
          'INSERT INTO "userbio" ("userid", "address", "occupation", "nextofkin", "k_phone", "k_relationship", "k_address", "kra_pin", "identification_card") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
          [
            req.user.id,
            req.body.address,
            req.body.occupation,
            req.body.nextofkin,
            req.body.k_phone,
            req.body.k_relationship,
            req.body.k_address,
            req.body.kra_pin,
            req.body.identification_card
          ]
        )
        res.send(data)     
   } catch (error) {
      handleError(error, res)
   }
}
module.exports.createBankdetails = async (req, res) => {
   try {
        const data = await save(
          'INSERT INTO "bankdetails" ("userid", "bank", "account_number", "account_name") VALUES ($1, $2, $3, $4) RETURNING id',
          [req.user.id, req.body.bank, req.body.account_number, req.body.account_name]
        )
        res.send(data)     
   } catch (error) {
      handleError(error, res)
   }
}

module.exports.login = async (req, res) => {
  try {
     const users = await fetch('SELECT * FROM "users" WHERE "email" = $1',[req.body.email])
     if(users.length!=1) return res.status(401).send({error:"Email or Password is wrong"})
     if(!bcrypt.compareSync(req.body.password,users[0].password)) return res.status(401).send({error:"Email or password is wrong"})
     let user = users[0]
     delete user.password
     let token = jwt.sign({...user},"key12wert",{
      expiresIn:'24h'
     })
      const { step, kyc } = await getUserState(user.id)
      res.send({user:{...user,step,kyc},token})
  } catch (error) {
     handleError(error, res)
  }
}

module.exports.adminlogin = async (req, res) => {
  try {
     const users = await fetch('SELECT * FROM "admins" WHERE "username" = $1',[req.body.username])
     if(users.length!=1) return res.status(401).send({error:"username or Password is wrong"})
     if(!bcrypt.compareSync(req.body.password,users[0].password)) return res.status(401).send({error:"username or password is wrong"})
     let user = users[0]
     delete user.password
     let token = jwt.sign({...user},"key12wert2456789ijhgfdsdfghjujhgfdfghjhgfnbgvfhgf",{
      expiresIn:'24h'
     })

     res.send({...user,token})
  } catch (error) {
     handleError(error, res)
  }
}
// `email`, `code`, `hash`, `datetime`
module.exports.resetPassword = async (req, res) => {
   if(!req.body?.email) return handleError(new Error('Email is required'), res)
   try {
        await fetch('DELETE FROM "otp" WHERE "email" = $1',[req.body.email])
        const users = await fetch('SELECT id FROM "users" WHERE "email" = $1', [req.body.email])
        if(users.length==0) return handleError(new Error('Account not found'), res)
        if(users.length==1){

          let digits = '0123456789';
          let OTP = '';
          for (let i = 0; i < 6; i++ ) {
              OTP += digits[Math.floor(Math.random() * 10)];
          }
          await save('INSERT INTO "otp" ("email", "code") VALUES ($1, $2) RETURNING id', [req.body.email, OTP])
         //  send email notification
          sendEmail(OTP, req.body.email)

          return res.send({msg:'Message sent, check your email'})
        }else{
         return handleError(new Error('Account not found'), res)
        }    
   } catch (error) {
      handleError(error, res)
   }
}

module.exports.verifyotp = async (req, res)=>{
    try {
      const otp = await fetch('SELECT code FROM "otp" WHERE "hash" = $1', [req.body?.hash])
      if(otp.length==1){
         res.send({success:true})
      }else{
         handleError(new Error('Invalid otp'), res) 
      }
    } catch (error) {
      handleError(error, res)
    }
}

module.exports.savehash = async (req, res)=>{
    try {
      if(!req.body.email || !req.body.code) return handleError(new Error('Email and otp required'), res)
      const otp = await fetch('SELECT hash FROM "otp" WHERE "email" = $1 AND "code" = $2',[req.body.email, req.body.code])
      if(otp.length==1){
       let hash = crypto.randomBytes(16).toString('hex')
       await save('UPDATE "otp" SET "hash" = $1 WHERE "email" = $2 AND "code" = $3',[hash,req.body.email, req.body.code])
       res.send({hash})
      }else{
        return handleError(new Error('Invalid otp'), res)  
      }
    } catch (error) {
      handleError(error, res)
    }
}

module.exports.savepassword = async (req, res)=>{
    try {
      if(!req.body.password || !req.body.hash) return handleError(new Error('Invalid request'), res)
      const otp = await fetch('SELECT email FROM "otp" WHERE "hash" = $1',[req.body.hash])
      if(otp.length==1){
       const salt = bcrypt.genSaltSync(10)
       const pass = bcrypt.hashSync(req.body.password, salt)
       await save('UPDATE "users" SET "password" = $1 WHERE "email" = $2',[pass,otp[0].email])
       await fetch('DELETE FROM "otp" WHERE "email" = $1',[otp[0].email])
       res.send({success:true})
      }else{
        return handleError(new Error('OTP did not match'), res)  
      }
    } catch (error) {
      handleError(error, res)
    }
}

module.exports.getAccount = async (req,res)=>{
  try {
   let account = await fetch('SELECT * FROM "accounts" WHERE "userid" = $1',[req.user.id])
   if(account.length>0){
      const user = account[0]
      return res.send({balance:user.balance})
   }else{
      return res.send({balance:0})
   }
  } catch (error) {
   handleError(error, res)
  }
}
// admin
// get users
module.exports.getUsers = async (req,res) =>{
   try {
      let users = await fetch('SELECT users.id, users.firstName, users.lastName, users.phone, users.email, userbio.address, userbio.occupation, userbio.nextofkin, userbio.k_phone, userbio.k_relationship, userbio.k_address, userbio.kra_pin, userbio.identification_card, userbio.status AS kyc_status, bankdetails.bank, bankdetails.account_number, bankdetails.account_name FROM users LEFT JOIN userbio ON users.id = userbio.userid LEFT JOIN bankdetails ON users.id = bankdetails.userid;') 
      res.send(users)
   } catch (error) {
      handleError(error, res)
   }
}
// get users
module.exports.getOneUsers = async (req,res) =>{
   try {
      let users = await fetch('SELECT users.id, users.firstName, users.lastName, users.phone, users.email, users.status, userbio.address, userbio.occupation, userbio.nextofkin, userbio.k_phone, userbio.k_relationship, userbio.k_address, userbio.kra_pin, userbio.identification_card, userbio.status AS kyc_status, bankdetails.bank, bankdetails.account_number, bankdetails.account_name FROM users LEFT JOIN userbio ON users.id = userbio.userid LEFT JOIN bankdetails ON users.id = bankdetails.userid WHERE users.id = ?',[req.params.id]) 
      res.send(users)
   } catch (error) {
      handleError(error, res)
   }
}
// get users
module.exports.getFaggedUsers = async (req,res) =>{
   try {
      let users = await fetch('SELECT users.id, users.firstName, users.lastName, users.phone, users.email, users.status, userbio.address, userbio.occupation, userbio.nextofkin, userbio.k_phone, userbio.k_relationship, userbio.k_address, userbio.kra_pin, userbio.identification_card, userbio.status AS kyc_status, bankdetails.bank, bankdetails.account_number, bankdetails.account_name FROM users LEFT JOIN userbio ON users.id = userbio.userid LEFT JOIN bankdetails ON users.id = bankdetails.userid WHERE users.status = ?',[req.params.id]) 
      res.send(users)
   } catch (error) {
      handleError(error, res)
   }
}
// update kyc
module.exports.updateKyc = async (req,res) =>{
   try {
      const kyc = await save('UPDATE userbio SET ? WHERE userid = ?', [req.body, req.params.id])
      res.send({success:'Kyc details updated'})
   } catch (error) {
      handleError(error, res)
   }
}
// update user
module.exports.updateUsers = async (req,res) =>{
   try {
      const kyc = await save('UPDATE users SET ? WHERE id = ?', [req.body, req.params.id])
      res.send({success:'User details updated'})
   } catch (error) {
      handleError(error, res)
   }
}
// update user
module.exports.createDemoAccount = async (req,res) =>{
   try {
      const user = await fetch('SELECT * FROM "users" WHERE "id" = $1', [req.user.id])
      // const userbio = await fetch('SELECT * FROM `userbio` WHERE `userid` = ?', [req.user.id])
      // const bank = await fetch('SELECT * FROM `bankdetails` WHERE `userid` = ?', [req.user.id])
      axios.post('https://demoapi.radava.co/api/user/demo',{user:user[0]})
      .then(resp=>{
        return res.send({status:'success'})
      })
      .catch(err=>{
        return handleError(err, res)
      })
      handleError(new Error('Unknown server error'), res)
   } catch (error) {
      handleError(error, res)
   }
}
module.exports.fundDemoAccount = async (req,res) =>{
   try {
      const users = await fetch('SELECT * FROM "users" WHERE "id" = $1', [req.user.id])
      if(users.length > 0) res.send({status:'success'})
      await save(
        'INSERT INTO "users" ("id", "firstName", "lastName", "phone", "email", "password", "status") VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT ("id") DO NOTHING RETURNING id',
        [req.user.id, req.user.firstName, req.user.lastName, req.user.phone, req.user.email, req.user.password, req.user.status]
      )
      await save('INSERT INTO "accounts" ("userid", "balance") VALUES ($1, $2) ON CONFLICT ("userid") DO NOTHING RETURNING id', [req.user.id, 1000000])
      
   } catch (error) {
      handleError(error, res)
   }
}
// update user
