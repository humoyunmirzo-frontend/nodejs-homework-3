const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes/books')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
const PORT = process.env.PORT || 3000
app.use(bodyParser.json());
app.use('/api', router)
app.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`)
})