import React, { useState } from "react";
import { Form, Input, Modal, Header, Button, Icon } from "semantic-ui-react";
import styles from "../styles/Home.module.css";

const LastfmInput = (props) => {
  const {
    lastfmUser1,
    lastfmUser2,
    setLastfmUser1,
    setLastfmUser2,
    submitUser,
    token,
  } = props;
  const [modalDisplayed, setModalDisplayed] = useState(false);

  const action = {
    color: "red",
    labelPosition: "right",
    icon: "lastfm",
    content: "Search",
  };

  return (
    <Form action="submit" onSubmit={submitUser} className={styles.searchForm}>
      <Form.Field>
        <Input
          placeholder="Last.fm Username..."
          value={lastfmUser1}
          onChange={(e) => setLastfmUser1(e.target.value)}
          label="Person 1"
        />
        <Input
          placeholder="Last.fm Username..."
          value={lastfmUser2}
          onChange={(e) => setLastfmUser2(e.target.value)}
          label="Person 2"
        />
      </Form.Field>
      <Button
        type="submit"
        icon
        color="red"
        labelPosition="right"
        className={styles.searchButton}
      >
        Search
        <Icon name="lastfm" />
      </Button>
    </Form>
  );
};

export default LastfmInput;
