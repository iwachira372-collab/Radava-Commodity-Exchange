
const { save, fetch } = require('../../db/db.js')
const { handleError }  = require("../../utils/error.js");


// `product`, `qty`, `cost`, `sellingprice`

module.exports.createPortfolio = async (req,res) =>{
    try {
       await save('INSERT INTO `portfolio` SET ?', [req.body])
       res.send({success: true})
    } catch (error) {
       handleError(error, res)
    }
 }
module.exports.editPortfolio = async (req,res) =>{
    try {
       await save('UPDATE portfolio SET ? WHERE id = ?', [req.body, req.params.id])
       res.send({success: true})
    } catch (error) {
       handleError(error, res)
    }
 }
module.exports.deletePortfolio = async (req,res) =>{
    try {
       await save('DELETE FROM `portfolio` WHERE id = ?', [req.params.id])
       res.send({success: true})
    } catch (error) {
       handleError(error, res)
    }
 }
module.exports.getPortfolio = async (req,res) =>{
    try {
      // `id`, `product`, `qty`, `cost`, `sellingprice`
      
      const orders = await fetch('SELECT p.id, p.product, p.cost, p.sellingprice, COALESCE(SUM(IFNULL(r.qty, 0)), 0) as qty, o.userid FROM `portfolio` p LEFT JOIN `order` o ON p.id = o.productid AND o.userid = ? LEFT JOIN `receipts` r ON o.id = r.orderid AND r.status = 1 GROUP BY p.id', [req.user.id, 1])

   
      
      res.send(orders)
    } catch (error) {
       handleError(error, res)
    }
 }

module.exports.getProduct = async (req,res) =>{
    try {
       const prt = await fetch('SELECT * FROM `portfolio` WHERE `product` = ?', [req.params.product])
       if(prt.length == 0) return res.send({})
       res.send(prt[0])
    } catch (error) {
       handleError(error, res)
    }
 }