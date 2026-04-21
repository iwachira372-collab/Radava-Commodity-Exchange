const { save, fetch } = require('../../db/db.js')
const  jwt   = require('jsonwebtoken')
const bcrypt  = require('bcrypt')
const { handleError }  = require("../../utils/error.js");
const crypto  = require('crypto')
const { sendEmail }  = require('../../utils/sendEmail.js');
const { default: axios } = require('axios');

module.exports.createAdminUser = async (req, res) => {
   try {
        let sql = 'INSERT INTO admins SET ?'
        const salt = bcrypt.genSaltSync(10)
        req.body.password = bcrypt.hashSync(req.body.password,salt)
        let userdata = await save(sql, [req.body])
        res.send({success:true})    
   } catch (error) {
      handleError(error, res)
   }
}

module.exports.createUser = async (req, res) => {
   let sql = 'INSERT INTO users SET ?'
   try {
        const salt = bcrypt.genSaltSync(10)
        req.body.password = bcrypt.hashSync(req.body.password,salt)
        let userdata = await save(sql, [req.body])
        let user = req.body
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
   let sql = 'INSERT INTO userbio SET ?'
   console.log(req.user)
   try {
        const data = await save(sql, [{...req.body,userid:req.user.id}])
        res.send(data)     
   } catch (error) {
      handleError(error, res)
   }
}
module.exports.createBankdetails = async (req, res) => {
   let sql = 'INSERT INTO bankdetails SET ?'
   try {
        const data = await save(sql, [{...req.body,userid:req.user.id}])
        res.send(data)     
   } catch (error) {
      handleError(error, res)
   }
}

module.exports.login = async (req, res) => {
  try {
     const users = await fetch("SELECT * FROM `users` WHERE `email`=?",[req.body.email])
     if(users.length!=1) return res.status(401).send({error:"Email or Password is wrong"})
     if(!bcrypt.compareSync(req.body.password,users[0].password)) return res.status(401).send({error:"Email or password is wrong"})
     let user = users[0]
     delete user.password
     let token = jwt.sign({...user},"key12wert",{
      expiresIn:'24h'
     })
          const bio = await fetch('SELECT userid, status FROM `userbio` WHERE `userid` = ?',[user.id])
          const bank = await fetch('SELECT userid FROM `bankdetails` WHERE `userid` = ?',[user.id])
          let step = 0
          if(bank?.length == 0) step = 3
          if(bio?.length == 0) step = 2
          let kyc = false
          if(bio?.length > 0){
            if(bio[0].status==1) kyc = true
          }

          res.send({user:{...user,step,kyc},token})
  } catch (error) {
     handleError(error, res)
  }
}

module.exports.adminlogin = async (req, res) => {
  try {
     const users = await fetch("SELECT * FROM `admins` WHERE `username`= ?",[req.body.username])
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
   let sql = 'SELECT id FROM users WHERE email = ?'
   try {
        await fetch('DELETE FROM otp WHERE email = ?',[req.body.email])
        const users = await fetch(sql, [req.body.email])
        if(users.length==0) return handleError(new Error('Account not found'), res)
        if(users.length==1){

          let digits = '0123456789';
          let OTP = '';
          for (let i = 0; i < 6; i++ ) {
              OTP += digits[Math.floor(Math.random() * 10)];
          }
          await save('INSERT INTO otp SET ?', [{email:req.body.email,code:OTP}])
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
      const otp = await fetch('SELECT code FROM otp WHERE hash = ?', [req.body?.hash])
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
      const otp = await fetch('SELECT hash FROM otp WHERE email = ? AND code = ?',[req.body.email, req.body.code])
      if(otp.length==1){
       let hash = crypto.randomBytes(16).toString('hex')
       await save('UPDATE otp SET hash = ? WHERE email = ? AND code = ?',[hash,req.body.email, req.body.code])
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
      const otp = await fetch('SELECT email FROM otp WHERE hash = ?',[req.body.hash])
      if(otp.length==1){
       const salt = bcrypt.genSaltSync(10)
       const pass = bcrypt.hashSync(req.body.password, salt)
       await save('UPDATE users SET password = ? WHERE email = ?',[pass,otp[0].email])
       fetch('DELETE FROM otp WHERE email = ?',[otp[0].email])
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
   let account = await fetch('SELECT * FROM `accounts` WHERE userid = ?',[req.user.id])
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
      const user = await fetch('SELECT * FROM `users` WHERE `id` = ?', [req.user.id])
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
      const users = await fetch('SELECT * FROM `users` WHERE `id` = ?', [req.user.id])
      if(users.length > 0) res.send({status:'success'})
      const user = await save('INSERT INTO users SET ?', [{...req.user}])
      const acc = await save('INSERT INTO accounts SET ?', [{userid:req.user.id,balance:1000000}])
      
   } catch (error) {
      handleError(error, res)
   }
}
// update user
