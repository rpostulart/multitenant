import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Amplify, { Auth } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react-native";
import { DataStore, syncExpression } from "@aws-amplify/datastore";
import { Channel, Message } from "./src/models/";

// Get the aws resources configuration parameters
import awsconfig from "./src/aws-exports"; // if you are using Amplify CLI

//Amplify.configure(awsconfig);
Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true
  }
});

//DataStore.stop();
DataStore.observe();
//DataStore.clear();

// DataStore.configure({
//   // prettier-ignore
//   syncExpressions: [
//     syncExpression(Channel, () => {
//       return (c) =>
//         c.tenant("eq", "0cc05b9c-9edf-4be8-87b6-25d7c4e750b6");
//     }),

//     syncExpression(Message, () => {
//       return (c) =>
//         c.tenant("eq", "0cc05b9c-9edf-4be8-87b6-25d7c4e750b6");
//     })
//   ]
// });
console.log("joe slappy");
//DataStore.start();

async function sync() {
  // console.log("komt hier");
  // try {
  //   const channel = await DataStore.query(channel);
  //   const posts = await DataStore.query(message);
  //   console.log(
  //     "Posts retrieved successfully!",
  //     JSON.stringify(posts, null, 2)
  //   );
  //   console.log(
  //     "Posts retrieved successfully!",
  //     JSON.stringify(channel, null, 2)
  //   );
  // } catch (error) {
  //   console.log("Error retrieving posts", error);
  // }
}

function App() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const test = async () => {
      Auth.currentAuthenticatedUser()
        .then(async result => {
          console.log("user");
          //console.log(result);
          const tenantid = result.attributes["custom:tenantid"];
          console.log(result.attributes["custom:tenantid"]);

          DataStore.configure({
            // prettier-ignore
            syncExpressions: [
              syncExpression(Channel, () => {
                return (c) =>
                  c.tenant("eq", "0cc05b9c-9edf-4be8-87b6-25d7c4e750b61");
              }),
  
              syncExpression(Message, () => {
                return (c) =>
                  c.tenant("eq", "0cc05b9c-9edf-4be8-87b6-25d7c4e750b61");
              })
            ]
          });
          console.log("joe slappy");
          DataStore.start();
        })
        .catch(err => {
          console.log(err);
        });
    };

    const create = async () => {
      const channel1 = await DataStore.save(
        new Channel({
          name: "First Post",
          owner: "51e9c3bb-8862-4f55-8823-e5a052a2c7c5",
          tenant: "0cc05b9c-9edf-4be8-87b6-25d7c4e750b6"
        })
      );

      console.log(channel1);
    };

    test();
    //create();
  });

  useEffect(() => {
    // try {
    //   DataStore.configure({
    //     syncExpressions: [
    //       syncExpression(channel, () => {
    //         return c => c.tenant("eq", tenantid);
    //       }),
    //       syncExpression(message, () => {
    //         return c => c.tenant("eq", tenantid);
    //       })
    //     ]
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    let message = "";
    let channel = "";

    const loadData = async () => {
      // try {
      //   DataStore.configure({
      //     // prettier-ignore
      //     syncExpressions: [
      //       syncExpression(Channel, () => {
      //         return (c) =>
      //           c.tenant("eq", "0cc05b9c-9edf-4be8-87b6-25d7c4e750b61");
      //       }),

      //       syncExpression(Message, () => {
      //         return (c) =>
      //           c.tenant("eq", "0cc05b9c-9edf-4be8-87b6-25d7c4e750b61");
      //       })
      //     ]
      //   });
      //   console.log("joe slappy");
      //   DataStore.start();
      // } catch (error) {
      //   console.log(error);
      // }

      message = await DataStore.query(Message);
      channel = await DataStore.query(Channel);

      console.log("a", message);
      console.log("b", channel);
    };

    loadData();

    console.log("asdad");
  });

  return (
    <StatusBar>
      <View>
        <Text>dfsf</Text>
      </View>
    </StatusBar>
  );
}

function Appstart() {
  // const message = DataStore.query(Message).then(user => {
  //   console.log("message", user);
  // });
  // const channel = DataStore.query(Channel).then(user => {
  //   console.log("channel", user);
  // });

  const channel = async () => {
    const result = await DataStore.query(Channel);
    console.log("b", result);
  };

  channel();

  //console.log("a", message);

  return (
    <View>
      <View>
        <Text>dfsf</Text>
      </View>
      <View>
        <Text>dfsf</Text>
      </View>
      <View>
        <Text>dfsf</Text>
      </View>
      <View>
        <Text>dfsf</Text>
      </View>

      <View>
        <Text>dfsf</Text>
      </View>
      <View>
        <Text>dfsf</Text>
      </View>
    </View>
  );
}

export default withAuthenticator(Appstart);
