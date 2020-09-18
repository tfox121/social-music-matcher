import { useState } from "react";

import Head from 'next/head'
import styles from '../styles/Home.module.css'
import LastfmInput from '../components/LastfmInput'
import { getMatching } from "../lib/lastfm";
import { Segment, Table, Grid, Dimmer, Loader, Header } from "semantic-ui-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [lastfmUser1, setLastfmUser1] = useState("foxtrapper121");
  const [lastfmUser2, setLastfmUser2] = useState("lumnotglum");
  const [userDataOne, setUserDataOne] = useState({})
  const [userDataTwo, setUserDataTwo] = useState({})
  const [errorMsgLFM, setErrorMsgLFM] = useState("");

  const submitSearch = async (e) => {
    console.time('Last.fm query')
    e.preventDefault();
    console.log("SUBMIT");
    setLoading(true)
    const userOneMatches = await getMatching(lastfmUser1, lastfmUser2, setErrorMsgLFM);
    setUserDataOne({ ...userDataOne, userOneMatches });
    const userTwoMatches = await getMatching(lastfmUser2, lastfmUser1, setErrorMsgLFM);
    setUserDataTwo({ ...userDataTwo, userTwoMatches });
    setLoading(false);
    console.timeEnd("Last.fm query");
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Last.fm Music Matcher!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Header as="h1">Share your music!</Header>
        <LastfmInput
          lastfmUser1={lastfmUser1}
          lastfmUser2={lastfmUser2}
          error={!errorMsgLFM === ""}
          setLastfmUser1={setLastfmUser1}
          setLastfmUser2={setLastfmUser2}
          submitUser={submitSearch}
        />
        {loading ? (
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        ) : (
          userDataTwo.userTwoMatches &&
          userDataOne.userOneMatches && (
            <Segment padded="very">
              <Grid columns={2} divided>
                <Grid.Row>
                  <Grid.Column>
                    <Table basic="very" textAlign="center" celled collapsing>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>
                            {lastfmUser1} share with {lastfmUser2}
                          </Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {userDataTwo.userTwoMatches &&
                          userDataTwo.userTwoMatches.map((artistObj) => {
                            return (
                              <Table.Row key={artistObj.name}>
                                <Table.Cell>{artistObj.name}</Table.Cell>
                              </Table.Row>
                            );
                          })}
                      </Table.Body>
                    </Table>
                  </Grid.Column>
                  <Grid.Column>
                    <Table basic="very" textAlign="center" celled collapsing>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>
                            {lastfmUser2} share with {lastfmUser1}
                          </Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {userDataOne.userOneMatches &&
                          userDataOne.userOneMatches.map((artistObj) => {
                            return (
                              <Table.Row key={artistObj.name}>
                                <Table.Cell>{artistObj.name}</Table.Cell>
                              </Table.Row>
                            );
                          })}
                      </Table.Body>
                    </Table>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          )
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/tfox121"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by Tom Fox
        </a>
      </footer>
    </div>
  );
}
