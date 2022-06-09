import MeetupList from "../components/meetups/MeetupList";
import {MongoClient} from "mongodb";
import Head from "next/head";

const HomePage = props => {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name='description'
          content='Browse a huge list of highly active React meetups!'
        />
      </Head>
      <MeetupList meetups={props.meetups}/>
    </>
  )
}

// export const getServerSideProps = async context => {
//   const req = context.req
//   const res = context.res
//
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     },
//   }
// }

export const getStaticProps = async context => {
  const DB_URL = "mongodb+srv://hongmin:vmk4nD4kyYFF2h2@cluster0.cwifn.mongodb.net/meetups?retryWrites=true&w=majority"
  const client = await MongoClient.connect(DB_URL)
  const db = client.db()
  const meetupsCollection = db.collection('meetups')
  const meetups = []
  const cursor = meetupsCollection.find()
  await cursor.forEach(meetup => {
    meetups.push(
      {
        id: meetup._id.toString(),
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        description: meetup.description
      }
    )
  })
  await client.close()

  return {
    props: {
      meetups: meetups
    },
    revalidate: 10,
  }
}

export default HomePage