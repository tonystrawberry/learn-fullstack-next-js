import NewMeetupForm from "@/components/meetups/NewMeetupForm";
import Head from "next/head";

function NewMeetupPage() {
  async function addMeetupHandler(meetupData) {
    const response = await fetch("/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(meetupData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log("Meetup created 💪");
  }
  return (
    <>
      <Head>
        <title>Add a New Meetup</title>
        <meta name="description" content="Add your own meetups!" />
      </Head>

      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </>
  );
}

export default NewMeetupPage;
