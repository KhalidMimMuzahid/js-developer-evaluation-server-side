const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.port || 5000;
app.use(cors());
app.use(express.json());
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${user}:${password}@cluster0.ejj8xud.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// testing purpose
app.get("/", async (req, res) => {
  res.send({ message: "hello world" });
});

async function run() {
  try {
    const students = client
      .db("JSDeveloperEvaluationJobTask")
      .collection("students");
    app.post("/add-student", async (req, res) => {
      const studentInfo = req?.body;
      const result = await students.insertOne(studentInfo);
      res.send(result);
    });
    app.get("/all-students", async (req, res) => {
      const postCreatorEmail = req?.query?.postCreatorEmail;
      const query = {
        postCreatorEmail,
      };
      const options = {
        sort: { date: -1 },
      };
      const result = await students.find(query, options).toArray();
      res.send(result);
    });
    app.delete("/delete-student", async (req, res) => {
      const _id = req?.query?._id;
      //   const query = { _id: ObjectId(_id) };
      const result = await students.deleteOne({ _id: new ObjectId(_id) });
      res.send(result);
    });

    app.put("/update-student", async (req, res) => {
      const studentInfo = req?.body;
      const _id = req?.query?._id;
      const filter = { _id: new ObjectId(_id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: { ...studentInfo },
      };
      const result = await students.updateOne(filter, updateDoc, options);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.log());

app.listen(port, () => {
  console.log("listening on port", port);
});
