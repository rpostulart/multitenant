import { Auth } from "aws-amplify";
import { DataStore, syncExpression } from "@aws-amplify/datastore";
import { Channel, Message } from "./models";
import { useNavigation } from "@react-navigation/native";

let tenantid = "";

// use for development purposes, to reset the datastore during each app start
DataStore.clear();
DataStore.configure({
  syncExpressions: [
    syncExpression(Channel, () => {
      return c => c.tenant("eq", tenantid);
    }),
    syncExpression(Message, () => {
      return c => c.tenant("eq", tenantid);
    })
  ]
});

function Datastore() {
  const navigation = useNavigation();
  const initDS = async () => {
    await Auth.currentAuthenticatedUser()
      .then(async result => {
        if (result !== "not authenticated") {
          tenantid = result.attributes["custom:tenantid"];
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

export default Datastore;
