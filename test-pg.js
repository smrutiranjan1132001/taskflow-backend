const { Client } = require('pg')

const client = new Client({
  connectionString: 'postgresql://taskflow:taskflow@localhost:5435/taskflow'
})

async function test() {
  try {
    await client.connect()
    console.log('✅ Connected!')
    const res = await client.query('SELECT current_user, version()')
    console.log('User:', res.rows[0].current_user)
    console.log('Version:', res.rows[0].version)
    await client.end()
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

test()