import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableHighlight
} from "react-native";
import { DataStore } from "@aws-amplify/datastore";
import { Auth } from "aws-amplify";
import { Message } from "./models/";

const Item = ({ username, message }) => (
  <View style={styles.item}>
    <Text style={styles.title}>Name {username}</Text>
    <Text style={styles.title}>{message}</Text>
  </View>
);

export default function Messages(props) {
  const id = props.route.params.id;

  const [messages, setMessages] = useState([]);

  async function loadMessagesArray() {
    const result = await DataStore.query(Message, c => c.channel("eq", id));
    setMessages(result);
  }

  useEffect(() => {
    const loadMessages = async () => {
      loadMessagesArray();
    };

    loadMessages();
  }, []);

  const renderItem = ({ item }) => (
    <Item username={item.username} message={item.message} />
  );

  const onSubmit = async () => {
    const auth = await Auth.currentAuthenticatedUser();

    const identifier = new Date();

    await DataStore.save(
      new Message({
        channel: id,
        user: auth.signInUserSession.accessToken.payload.sub,
        username: auth.attributes.name,
        message: "This is a new message " + identifier.getSeconds(),
        owner: auth.signInUserSession.accessToken.payload.sub,
        tenant: auth.attributes["custom:tenantid"]
      })
    );

    loadMessagesArray();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          alignItems: "flex-end"
        }}
      >
        <TouchableHighlight onPress={() => onSubmit()}>
          <Text
            style={{
              fontSize: 16,
              alignItems: "flex-end"
            }}
          >
            Add new message
          </Text>
        </TouchableHighlight>
      </View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  },
  item: {
    backgroundColor: "#5d90e3",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 18
  }
});
