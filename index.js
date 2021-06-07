const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello biral sana!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jezdg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error: ', err);
    const foodsCollection = client.db("freshValleyFood").collection("foods");
    console.log('database connected successfully!!');
    // client.close();
});


app.listen(port)