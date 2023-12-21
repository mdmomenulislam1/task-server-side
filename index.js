const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const port = process.env.PORT || 5000;

app.use(cors({
    origin: [
        'http://localhost:5173',

    ],
    credentials: true
}));
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nafbti5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
       



        const toDoCollection = client.db("toDos").collection("toDo");

        app.post("/toDo", async (req, res) => {
            const task = req.body;
            const result = await toDoCollection.insertOne(task);
            res.send(result);
        });

        app.patch('/toDo/:id', async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedFields = {
                $set: {
                name: data.name,
                taskHolderName: data.taskHolderName,
                taskHolderEmail: data.taskHolderEmail,
                deadline: data.deadline,
                status: data.status,
                description: data.description
            }
        };
    
            const result = await toDoCollection.updateOne(filter, updatedFields);
            res.send(result);
    });

        app.get("/toDo", async (req, res) => {
            const result = await toDoCollection.find().toArray();
            res.send(result);
        });


        app.delete('/toDo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toDoCollection.deleteOne(query);
            res.send(result);
        })



        const BeneficiaryCollection = client.db("benefisharyDB").collection("benefit");
        app.get("/benefit", async (req, res) => {
            const result = await BeneficiaryCollection.find().toArray();
            res.send(result);
        });










        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Food is coming')
})

app.listen(port, () => {
    console.log(`Food is running on port ${port}`);
})