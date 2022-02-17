import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { getSession } from "next-auth/react";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Head>
        <title>Hipcamp Strava - Error</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mt-5 pb-5 justify-content-center d-flex vertical-center">
        <main className="">
          <h1 className={styles.title}>Oh no.</h1>

          <p className={styles.description}>
            There was an error trying to login. Please make sure you are using
            your hipcamp Google account, as this feature is for only the amazing
            members of the Hipcamp team.
          </p>
          <div className="justify-content-center d-flex">
            <Button
              className="strava-color d-flex align-items-center"
              size="lg"
              onClick={() => {
                router.push("/api/strava");
              }}
            >
              <div className="mr-5">
                <FontAwesomeIcon icon={faGoogle} size={"lg"} className="mr-3" />
              </div>
              <div style={{ marginLeft: 10 }}>Login with Google</div>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/strava",
      },
    };
  } else {
    return {};
  }
}