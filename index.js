const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');


require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zowrr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json()) 
app.use(cors())

const port = 7000

app.get('/', (req, res) => {
    res.send("Helllo from db why it's not working hosse na")
})

console.log(process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME)



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
  const productCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
//   console.log("Database Connected")

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        // console.log(product);
        // productCollection.insertMany(products)//insertMany karon products er vitore onek gulo object celo
        productCollection.insertOne(products)
        .then(result => {
            // console.log(result);
            console.log(result.insertedCount)
            res.send(result.insertedCount)

        })
    })



    //ei khane all product get kortece
    app.get('/products', (req, res) => {
        productCollection.find({}).limit(20)
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    //ei khane je product er id pasce seita get kortece
    app.get('/product/:key', (req, res) => {
        productCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    })

    //ekadik Id  khujtece mongo database thake
    app.post('/productsByKeys', (req, res) => {
        const productsKeys = req.body;
        productCollection.find({key: {$in: productsKeys}})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        // console.log(product);
        // productCollection.insertMany(products)//insertMany karon products er vitore onek gulo object celo
        ordersCollection.insertOne(order)
        .then(result => {
            // console.log(result);
            // console.log(result.insertedCount)
            res.send(result.insertedCount > 0)

        })
    })


    

});





app.listen(process.env.PORT || port) //process.env.PORT || eita heroKu er jonno (amra je port e project ta rum kortece onno kew tar pc te onno port e run korbe sei jonno)