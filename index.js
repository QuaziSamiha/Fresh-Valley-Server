const ObjectID = require('mongodb').ObjectID
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
    res.send('Hello Fresh Valley!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jezdg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // console.log('connection error: ', err);
    const foodCollection = client.db("freshValleyFood").collection("foods");
    const usersCollection = client.db("freshValleyFood").collection("users");
    // console.log('database connected successfully!!');

    // for adding a single product from admin page
    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        // console.log('adding new product: ', newProduct);
        foodCollection.insertOne(newProduct)
            .then(result => {
                console.log('inserted count: ', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    // for loading all products in home page
    app.get('/products', (req, res) => {
        foodCollection.find()
            .toArray((err, products) => {
                // console.log('from database ', products);
                res.send(products)
            })
    })

    // for display ordered product in order page
    app.get('/orderedProduct/:productId', (req, res) => {
        // console.log(req.params);
        foodCollection.find({ _id: ObjectID(req.params.productId) })
            .toArray((err, documents) => {
                // console.log(documents);
                res.send(documents[0]);
            })
    })

    // for check out page product and user detail will be stored in database
    app.post('/addOrder', (req, res) => {
        const newOrderDetail = req.body;
        console.log(newOrderDetail);
        usersCollection.insertOne(newOrderDetail)
            .then(result => {
                console.log('inserted count: ', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    // loading product and user detail from database to display on check out page for specific user
    app.get('/orderedProduct', (req, res) => {
        // console.log(req.query.email);
        usersCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    // client.close();
});


app.listen(port)