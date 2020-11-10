import React from "react";
import { View, Text, Button } from "react-native";
import Amplify, { Auth } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react-native";
import { DataStore } from "@aws-amplify/datastore";
import Channels from "./src/channels";
import ChannelMessages from "./src/channelMessages";
import LoadAuth from "./src/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import awsconfig from "./src/aws-exports"; // if you are using Amplify CLI

//Amplify.configure(awsconfig);
Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true
  }
});

const Stack = createStackNavigator();

function LogoutScreen() {
  const resetDS = async () => {
    await DataStore.clear();
    Auth.signOut();
  };

  resetDS();

  return (
    <View>
      <Text>You are logged out</Text>
    </View>
  );
}

async function logout() {
  await DataStore.clear();
  Auth.signOut();
}

function Appstart() {
  return (
    <View
      style={{
        marginTop: 40,

        display: "flex",
        flex: 1
      }}
    >
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Auth" component={LoadAuth} />
          <Stack.Screen
            name="Channel"
            component={Channels}
            options={{
              headerLeft: null,
              headerTitle: "Channels",
              headerRight: () => (
                <Button onPress={() => logout()} title="Logout" color="#000" />
              )
            }}
          />
          <Stack.Screen name="Messages" component={ChannelMessages} />
          <Stack.Screen name="Logout" component={LogoutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default withAuthenticator(Appstart);
