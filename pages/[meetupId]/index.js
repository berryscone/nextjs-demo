import MeetupDetail from "../../components/meetups/MeetupDetail";
import {MongoClient, ObjectId} from "mongodb";
import Head from "next/head";

const MeetupDetails = props => {
  const {meetupData} = props

  return (
    <>
      <Head>
        <title>{meetupData.title}</title>
        <meta
          name='description'
          content={meetupData.description}
        />
      </Head>
      <MeetupDetail {...meetupData}/>
    </>
  )
}

const DB_URL = "mongodb+srv://hongmin:vmk4nD4kyYFF2h2@cluster0.cwifn.mongodb.net/meetups?retryWrites=true&w=majority"
export const getStaticPaths = async () => {
  const client = await MongoClient.connect(DB_URL)
  const db = client.db()
  const meetupsCollection = db.collection('meetups')
  const meetups = await meetupsCollection.find().project({_id: 1}).toArray()
  client.close()

  return {
    paths: meetups.map(meetup => ({
      params: {
        meetupId: meetup._id.toString()
      }
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps = async context => {
  const meetupId = context.params.meetupId
  const client = await MongoClient.connect(DB_URL)
  const db = client.db()
  const meetupsCollection = db.collection('meetups')
  const meetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId)
  })
  client.close()

  return {
    props: {
      meetupData: {
        id: meetupId,
        image: meetup.image,
        title: meetup.title,
        address: meetup.address,
        description: meetup.description
      }
    }
  }
}

export default MeetupDetails