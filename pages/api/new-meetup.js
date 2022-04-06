import { MongoClient } from "mongodb";

// api/new-meetup
// POST /api/new-meetup
async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const { title, image, address, description } = data;

    const client = await MongoClient.connect(
      `mongodb://${process.env.NEXT_PUBLIC_MONGO_USER}:${process.env.NEXT_PUBLIC_MONGO_PASSWORD}@cluster0-shard-00-00.ckglm.mongodb.net:27017,cluster0-shard-00-01.ckglm.mongodb.net:27017,cluster0-shard-00-02.ckglm.mongodb.net:27017/meetups?ssl=true&replicaSet=atlas-xqkhbr-shard-0&authSource=admin&retryWrites=true&w=majority`
    );

    const db = client.db();

    const meetupsCollection = db.collection("meetups");
    const result = await meetupsCollection.insertOne({
      title,
      image,
      address,
      description,
    });

    console.log("Meetup created 🎉", result);

    client.close();

    res.status(201).json({ message: "Meetup created 🎉" });
  }
}

export default handler;
