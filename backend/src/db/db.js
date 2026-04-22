const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: process.env.PGSSL === 'false' ? false : { rejectUnauthorized: false }
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'radava',
        max: Number(process.env.DB_CONNECTION_LIMIT || 100),
        ssl: process.env.PGSSL === 'false' ? false : undefined
      }
)

const quoteSetAssignments = (data, startIndex = 1) => {
  const keys = Object.keys(data)
  const values = keys.map((key) => data[key])
  const assignments = keys.map((key, index) => `"${key}" = $${startIndex + index}`)
  return { assignments, values, nextIndex: startIndex + keys.length }
}

const translateSetQuery = (sql, params) => {
  const insertMatch = sql.match(/^INSERT INTO\s+`?([A-Za-z_][A-Za-z0-9_]*)`?\s+SET\s+\?$/i)
  if (insertMatch) {
    const data = params[0] || {}
    const keys = Object.keys(data)
    const columns = keys.map((key) => `"${key}"`).join(', ')
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ')
    return {
      text: `INSERT INTO "${insertMatch[1]}" (${columns}) VALUES (${placeholders}) RETURNING id`,
      values: keys.map((key) => data[key]),
      isInsert: true
    }
  }

  const updateMatch = sql.match(/^UPDATE\s+`?([A-Za-z_][A-Za-z0-9_]*)`?\s+SET\s+\?\s+WHERE\s+(.+)$/i)
  if (updateMatch) {
    const data = params[0] || {}
    const remainder = updateMatch[2]
    const { assignments, values } = quoteSetAssignments(data, 1)
    const whereParams = params.slice(1)
    let offset = values.length
    const translatedWhere = remainder.replace(/\?/g, () => {
      offset += 1
      return `$${offset}`
    })
    return {
      text: `UPDATE "${updateMatch[1]}" SET ${assignments.join(', ')} WHERE ${translatedWhere.replace(/`/g, '"')}`,
      values: [...values, ...whereParams],
      isInsert: false
    }
  }

  return null
}

const translateQuery = (sql, params = []) => {
  const translatedSetQuery = translateSetQuery(sql.trim(), params)
  if (translatedSetQuery) return translatedSetQuery

  let index = 0
  const text = sql.replace(/`/g, '"').replace(/\?/g, () => {
    index += 1
    return `$${index}`
  })

  const isInsert = /^\s*INSERT\s+/i.test(sql) && !/\bRETURNING\b/i.test(sql)
  return {
    text: isInsert ? `${text} RETURNING id` : text,
    values: params,
    isInsert
  }
}

const execute = async (sql, params = []) => {
  const { text, values, isInsert } = translateQuery(sql, params)
  const result = await pool.query(text, values)
  if (/^\s*SELECT/i.test(sql) || /^\s*DELETE/i.test(sql) === false && /^\s*INSERT/i.test(sql) === false && /^\s*UPDATE/i.test(sql) === false) {
    return result.rows
  }
  if (isInsert) {
    return { insertId: result.rows[0]?.id, rows: result.rows, rowCount: result.rowCount }
  }
  return { rows: result.rows, rowCount: result.rowCount }
}

module.exports.pool = pool
module.exports.save = async (sql, data = []) => {
  try {
    return await execute(sql, data)
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === '28P01' || error.code === '3D000') {
      throw new Error('Server is down')
    }
    throw error
  }
}

module.exports.update = async (sql, data = []) => {
  return module.exports.save(sql, data)
}

module.exports.fetch = async (sql, data = []) => {
  try {
    return await execute(sql, data)
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === '28P01' || error.code === '3D000') {
      throw new Error('Server is down')
    }
    throw error
  }
}
