const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(cors())
app.use(express.json())




app.get('/', (req, res) => {
    res.send('Tech Hub server is running')
})

app.listen(port, () => {
    console.log(`TechHub server is running on port: ${port}`)
})