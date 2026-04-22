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
const dbConfig = {
   connectionLimit : Number(process.env.DB_CONNECTION_LIMIT || 100),
   host     : process.env.DB_HOST || 'localhost',
   user     : process.env.DB_USER || 'root',
   password : process.env.DB_PASSWORD || '',
   database : process.env.DB_NAME || 'radava',
   port     : Number(process.env.DB_PORT || 3306)
}

module.exports.pool = mysql.createPool(dbConfig)
const pool = mysql.createPool(dbConfig)

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
