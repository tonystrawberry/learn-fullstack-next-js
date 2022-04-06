import { MongoClient } from "mongodb";
import Head from "next/head";

import MeetupList from "@/components/meetups/MeetupList";

const DUMMY_MEETUPS = [
  {
    id: "m1",
    title: "First Meetup",
    image:
      "https://assets.vogue.com/photos/5891ed92186d7c1b6493bc18/master/w_2560%2Cc_limit/00-holding-munich-travel-guide.jpg",
    address: "Munich, DE",
    description: "Nice to meet you all.",
  },
];

function HomePage(props) {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

// export async function getServerSideProps(context) {
//   // code executed for every incoming request after deployment on the server
//   // for example, authentication code that should not be shown to the users on the frontend

//   const req = context.req;
//   const res = context.res;

//   console.log("getServerSideProps");

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export async function getStaticProps() {
  // code executed during build process

  const client = await MongoClient.connect(
    `mongodb://${process.env.NEXT_PUBLIC_MONGO_USER}:${process.env.NEXT_PUBLIC_MONGO_PASSWORD}@cluster0-shard-00-00.ckglm.mongodb.net:27017,cluster0-shard-00-01.ckglm.mongodb.net:27017,cluster0-shard-00-02.ckglm.mongodb.net:27017/meetups?ssl=true&replicaSet=atlas-xqkhbr-shard-0&authSource=admin&retryWrites=true&w=majority`
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

export default HomePage;
