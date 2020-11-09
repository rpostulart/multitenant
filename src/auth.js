import React, { useState } from "react";
import { View } from "react-native";
import Amplify, { Auth } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react-native";
import { DataStore, syncExpression } from "@aws-amplify/datastore";
import { Channel, Message } from "./models";
import Channels from "./channels";
import { useNavigation } from "@react-navigation/native";

// use for development purposes, to reset the datastore during each app start
DataStore.clear();

function Ds() {
  const navigation = useNavigation();
  const initDS = async () => {
    await Auth.currentAuthenticatedUser()
      .then(async result => {
        if (result !== "not authenticated") {
          const tenantid = result.attributes["custom:tenantid"];
          console.log(tenantid);
          await DataStore.configure({
            // prettier-ignore
            syncExpressions: [
            syncExpression(Channel, () => {
              return (c) =>
                c.tenant("eq",tenantid);
            }),
            syncExpression(Message, () => {
              return (c) =>
                c.tenant("eq", tenantid);
            })
          ]
          });
          await DataStore.start();
          navigation.navigate("Channel");
        }
      })

      .catch(err => {
        console.log(err);
      });
  };

  initDS();

  return null;
}

export default Ds;
