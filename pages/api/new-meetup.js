import {MongoClient} from "mongodb";

const DB_URL = "mongodb+srv://hongmin:vmk4nD4kyYFF2h2@cluster0.cwifn.mongodb.net/meetups?retryWrites=true&w=majority"
const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const data = req.body

      const client = await MongoClient.connect(DB_URL)
      const db = client.db()

      const meetupsCollection = db.collection('meetups')
      const result = await meetupsCollection.insertOne(data)
      console.log(result)
      res.status(201).json({
        message: 'Meetup inserted!'
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export default handler