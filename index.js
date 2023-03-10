const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5bfvhe8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}


async function run() {
    try {
        const socialMediaCollection = client.db('socialMediaTask').collection('addpost');
        const commentsCollection = client.db('socialMediaTask').collection('comments');
        const userCollection = client.db('socialMediaTask').collection('users');

        app.post('/jwt', (req, res) => {
            const user = req.body;

            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' })
            console.log(token);
            res.send({ token })
        })

        // app.get('/show', async (req, res) => {
        //     const query = {}
        //     const cursor = commentsCollection.find(query).sort({ _id: -1 });
        //     const result = await cursor.limit(1).toArray()
        //     res.send(result)
        // })

        app.get('/addpost', async (req, res) => {
            const query = {}
            const cursor = socialMediaCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/media/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await socialMediaCollection.findOne(query);
            res.send(result);
        });
        app.get('/allcomments', async (req, res) => {
            const query = {}
            const cursor = commentsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.post('/addpost', async (req, res) => {
            const addPost = req.body;
            const result = await socialMediaCollection.insertOne(addPost);
            res.send(result);
        });
        app.post('/comment', async (req, res) => {
            const addcomment = req.body;
            const result = await commentsCollection.insertOne(addcomment);
            res.send(result);
        });

        // about
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await userCollection.insertOne(user);
            res.send(result);
        });
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        })



    }
    finally {

    }
}
run().catch(err => console.error(err));




app.get('/', (req, res) => {
    res.send('Social Media Task server is running')
})

app.listen(port, () => {
    console.log(`Social Media Task server running on ${port}`);
})