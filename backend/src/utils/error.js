module.exports.handleError = (error,res)=>{
  return res.status(500).send({error: error.message})
}