const express = require('express')
const cors = require('cors')
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 7000;
require('dotenv').config();


// midleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('craft server is runnig');
})

app.listen(port, () => {
    console.log(`Server is running on ${port} port`)
  })

const user = process.env.USER;
console.log(user);
//   mongobd
