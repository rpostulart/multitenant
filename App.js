import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Amplify, { Auth } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react-native";
import { DataStore, syncExpression } from "@aws-amplify/datastore";
import { Channel, Message } from "./src/models/";
import Channels from "./src/channels";
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
    await DataStore.configure({
      // prettier-ignore
      syncExpressions: [
    syncExpression(Channel, () => {
      return (c) =>
        c.tenant("eq",null);
    }),
    syncExpression(Message, () => {
      return (c) =>
        c.tenant("eq", null);
    })
  ]
    });

    Auth.signOut();
  };

  resetDS();

  return (
    <View>
      <Text>You are logged out</Text>
    </View>
  );
}

function Appstart() {
  return (
    <View
      style={{
        marginTop: 40,
        padding: 10,
        display: "flex",
        flex: 1
      }}
    >
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Auth" component={LoadAuth} />
          <Stack.Screen name="Channel" component={Channels} />
          <Stack.Screen name="Logout" component={LogoutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default withAuthenticator(Appstart);
