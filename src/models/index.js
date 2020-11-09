// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Channel, Message } = initSchema(schema);

export {
  Channel,
  Message
};