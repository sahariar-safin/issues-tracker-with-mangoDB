const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
const password = 'pUXrNEmbS1bGggkm';

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://shafinthedeveloper:pUXrNEmbS1bGggkm@cluster0.h6gyy.mongodb.net/to-do?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

client.connect(err => {
    const collection = client.db("to-do").collection("list");

    app.post("/addToDo", (req, res) => {
        const todo = req.body;
        const issuesStatus = 'Open';
        const issuesID = (Math.random() * 1000000).toFixed(0);
        collection.insertOne({ issuesID, issuesStatus, ...todo });
        res.redirect('/')
    })

    app.get('/getToDo', (req, res) => {
        collection.find({})
            .toArray((err, collection) => {
                res.send(collection);
            })
    })

    app.patch('/close/:id', (req, res) => {
        collection.updateOne(
            { issuesID: req.params.id },
            { $set: { issuesStatus: 'Closed' } }
        )
            .then(res => {

            })
        res.redirect('/')
    })

    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({
            issuesID: req.params.id
        })
            .then(res => {

            })
        res.redirect('/')
    })


});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${ port }`)
})