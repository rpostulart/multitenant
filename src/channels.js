import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import { DataStore } from "@aws-amplify/datastore";
import { Auth } from "aws-amplify";
import { Channel } from "./models/";
import ChannelMessage from "./channelMessages";
import { useNavigation } from "@react-navigation/native";

const Item = ({ name, id, setscreen }) => (
  <TouchableOpacity onPress={() => setscreen({ id, name })}>
    <View style={styles.item}>
      <Text style={styles.title}>{name}</Text>
    </View>
  </TouchableOpacity>
);

export default function Channels(props) {
  let subscription;
  const [channels, setChannels] = useState([]);
  const [screen, setScreen] = useState("channel");
  const navigation = useNavigation();

  const loadChannelArray = async () => {
    const result = await DataStore.query(Channel);

    setChannels(result);
  };

  useEffect(() => {
    loadChannelArray();
    subscription = DataStore.observe(Channel).subscribe(() => {
      loadChannelArray();
    });
    return function cleanup() {
      setChannels([]);
      subscription.unsubscribe();
    };
  }, []);

  const renderItem = ({ item }) => (
    <Item name={item.name} id={item.id} setscreen={text => setScreen(text)} />
  );

  const onSubmit = async () => {
    const auth = await Auth.currentAuthenticatedUser();

    const identifier = new Date();

    await DataStore.save(
      new Channel({
        name: "New channel " + identifier.getSeconds(),
        owner: auth.signInUserSession.accessToken.payload.sub,
        tenant: auth.attributes["custom:tenantid"]
      })
    );

    loadChannelArray();
  };

  let content;

  if (screen === "channel") {
    content = (
      <SafeAreaView style={styles.container}>
        <TouchableHighlight
          onPress={async () => {
            setChannels([]);

            navigation.navigate("Logout");
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#b89106",
              marginBottom: 20,
              alignSelf: "flex-end"
            }}
          >
            Logout
          </Text>
        </TouchableHighlight>
        <Text style={{ fontSize: 26, marginBottom: 10 }}>Channels</Text>
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
              Add new channel
            </Text>
          </TouchableHighlight>
        </View>
        <FlatList
          data={channels}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    );
  } else {
    content = (
      <ChannelMessage
        name={screen.name}
        id={screen.id}
        setscreen={text => setScreen(text)}
      />
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  },
  item: {
    backgroundColor: "#dead31",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 32
  }
});
