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
import { useNavigation } from "@react-navigation/native";

const Item = ({ id, name, navigateToMessage }) => (
  <TouchableOpacity onPress={() => navigateToMessage(id, name)}>
    <View style={styles.item}>
      <Text style={styles.title}>{name}</Text>
    </View>
  </TouchableOpacity>
);

export default function Channels() {
  let subscription;
  const [channels, setChannels] = useState([]);
  const navigation = useNavigation();

  const navigateToMessage = (id, name) => {
    navigation.navigate("Messages", { id, name });
  };

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
    <Item
      name={item.name}
      id={item.id}
      navigateToMessage={() => navigateToMessage(item.id, item.name)}
    />
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
