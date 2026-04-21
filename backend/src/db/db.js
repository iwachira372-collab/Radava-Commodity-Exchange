const mysql = require('mysql')

// module.exports.pool = mysql.createPool({
//   connectionLimit : 100,
//   host     : 'localhost',
//   user     : 'radavaco_api',
//   password : 'nEx]a$!FR#4p',
//   database : 'radavaco_api'
// })

// const pool = mysql.createPool({
//   connectionLimit : 100,
//   host     : 'localhost',
//   user     : 'radavaco_api',
//   password : 'nEx]a$!FR#4p',
//   database : 'radavaco_api'
// })
module.exports.pool = mysql.createPool({
   connectionLimit : 100,
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'radava'
 })
 const pool = mysql.createPool({
   connectionLimit : 100,
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'radava'
 })

module.exports.save = async (sql,data=[])=>{
    return await new Promise((resolve, reject)=>{
       pool.getConnection((err, connection)=>{
          if(err) return reject(new Error('Server is down'))
          connection.query(sql,[...data],(error,result)=>{
            connection.release()
            console.log(error)
            if(error) return reject(error)
            resolve(result)
          })
       })
    })
}
module.exports.update = async (sql,data=null,param = null)=>{
    return await new Promise((resolve, reject)=>{
       pool.getConnection((err, connection)=>{
          if(err) return reject(new Error('Server is down'))
          connection.query(sql,[data, param], (error,result)=>{
            connection.release()
            console.log(error)
            if(error) return reject(error)
            resolve(result)
          })
       })
    })
}

module.exports.fetch = async (sql,data=[])=>{
  return await new Promise((resolve, reject)=>{
    pool.getConnection((err, connection)=>{
       if(err) return reject(new Error('Server is down'))
       connection.query(sql,[...data],(error,result)=>{
         connection.release()
         if(error) return reject(error)
         resolve(result)
       })
    })
 })
}