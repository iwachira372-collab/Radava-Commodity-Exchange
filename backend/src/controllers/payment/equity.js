// const sdk = require('api')('@jengaapi/v3#h47ynkl4sgiv44');

const { save, fetch } = require("../../db/db")
const { handleError } = require("../../utils/error")
const { sendCustomEmail } = require("../../utils/sendEmail")

// sdk.merchantPayment({
//   merchant: {till: '0766000000'},
//   payment: {ref: '123456789123', amount: '1000.00', currency: 'KES'},
//   partner: {id: '0011547896523', ref: '987654321'}
// })
//   .then(({ data }) => console.log(data))
//   .catch(err => console.error(err));


// `userid`, `amount`, `phone`, `bank`, `acountnumber`, `acountname`, `type`, `lastupdate`, `status` FROM `withdraw`
module.exports.withdraw = async (req,res)=>{
  try {
       const balance = await fetch('SELECT * FROM "accounts" WHERE "userid" = $1', [req.user.id])
       if(balance.length !=1) return handleError(new Error("You don't funds in your wallet"), res)

       const bal = balance[0].balance
       const amount = parseFloat(bal) - parseFloat(req.body.amount)
       

       if(isNaN(amount) ) return handleError(new Error("Mathematical syntax error, please try again"), res)

       if(amount < 0) return handleError(new Error("You don't have enough funds to withdraw KES "+req.body.amount), res)

       await save('UPDATE "accounts" SET "balance" = $1 WHERE "userid" = $2',[amount,req.user.id])
       await save('INSERT INTO "withdraw" SET ?',[{...req.body,userid:req.user.id}])
       sendCustomEmail('<p>Your request to withdraw KES '+req.body.amount+' has been received and will be processed shortly</p>',"WITHDRAW REQUST", req.user.email)
       res.send({success:true})
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.updatewithdrawal = async (req,res)=>{
  try {
    await save('UPDATE "withdraw" SET ? WHERE id = ?', [{...req.body}, req.params.id])
    res.send({success:true})
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.getwithdrawal = async (req,res)=>{
  try {
    const t = await fetch('SELECT "withdraw".id,"withdraw".amount,"withdraw".phone,"withdraw".bank,"withdraw".acountnumber,"withdraw".acountname,"withdraw".type,"withdraw".lastupdate,"withdraw".status, users."firstName",users."lastName" FROM "withdraw" LEFT JOIN users ON users.id = "withdraw".userid')
    res.send(t)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.getwithdrawalByStatus = async (req,res)=>{
  try {
    const t = await fetch('SELECT "withdraw".id, "withdraw".amount, "withdraw".phone,"withdraw".bank,"withdraw".acountnumber,"withdraw".acountname,"withdraw".type,"withdraw".lastupdate,"withdraw".status, users."firstName",users."lastName" FROM "withdraw" LEFT JOIN users ON users.id = "withdraw".userid WHERE "withdraw".status = $1',[req.params.id])
    res.send(t)
  } catch (error) {
    console.log(error)
    handleError(error, res)
  }
}

module.exports.getCounts = async (req, res)=>{
  try {
    const users = await fetch('SELECT COUNT(id) AS count FROM users')
    const orders = await fetch('SELECT COUNT(id) AS count FROM "order"')
    const portfolio = await fetch('SELECT COUNT(id) AS count FROM portfolio')
    const balance = await fetch('SELECT SUM(balance) AS count FROM accounts')

    res.send({
      users:users.length>0?users[0].count:0,
      orders:orders.length>0?orders[0].count:0,
      portfolio:portfolio.length>0?portfolio[0].count:0,
      balance:balance.length>0?balance[0].count:0,
    })
  } catch (error) {
    handleError(error, res)
  }
}
