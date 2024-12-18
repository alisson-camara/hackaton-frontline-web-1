const express = require('express')
const path = require('path')
const rooms = require('./mocks/rooms.json')

const port = process.env.PORT || 5005

const app = express()

// app.use(express.static(path.join(__dirname, 'public')))
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send(rooms)
})

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})

curl -X POST http://localhost:3000/create-room \
     -H "Content-Type: application/json" \
    -d '{}'


// process.on('SIGTERM', async () => {
//   console.log('SIGTERM signal received: gracefully shutting down')
//   if (server) {
//     server.close(() => {
//       console.log('HTTP server closed')
//     })
//   }
// })

// const { Client } = require('pg');

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// client.connect();

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });
