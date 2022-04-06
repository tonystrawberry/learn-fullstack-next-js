import MeetupDetail from "@/components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

function MeetupDetailsPage(props) {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    `mongodb://${process.env.NEXT_PUBLIC_MONGO_USER}:${process.env.NEXT_PUBLIC_MONGO_PASSWORD}@cluster0-shard-00-00.ckglm.mongodb.net:27017,cluster0-shard-00-01.ckglm.mongodb.net:27017,cluster0-shard-00-02.ckglm.mongodb.net:27017/meetups?ssl=true&replicaSet=atlas-xqkhbr-shard-0&authSource=admin&retryWrites=true&w=majority`
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: true, // if false then that means we have provided all the possible paths in 'paths' and that any other provided path will result in a 404 error page
    // if true, then the server will try to generate dynamically for the provided meetupId of the incoming request
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    `mongodb://${process.env.NEXT_PUBLIC_MONGO_USER}:${process.env.NEXT_PUBLIC_MONGO_PASSWORD}@cluster0-shard-00-00.ckglm.mongodb.net:27017,cluster0-shard-00-01.ckglm.mongodb.net:27017,cluster0-shard-00-02.ckglm.mongodb.net:27017/meetups?ssl=true&replicaSet=atlas-xqkhbr-shard-0&authSource=admin&retryWrites=true&w=majority`
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        image: selectedMeetup.image,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetailsPage;
