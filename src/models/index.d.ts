import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Channel {
  readonly id: string;
  readonly name: string;
  readonly messages?: (Message | null)[];
  readonly tenant: string;
  readonly owner: string;
  constructor(init: ModelInit<Channel>);
  static copyOf(source: Channel, mutator: (draft: MutableModel<Channel>) => MutableModel<Channel> | void): Channel;
}

export declare class Message {
  readonly id: string;
  readonly channel: string;
  readonly user: string;
  readonly username: string;
  readonly message: string;
  readonly tenant: string;
  readonly owner: string;
  constructor(init: ModelInit<Message>);
  static copyOf(source: Message, mutator: (draft: MutableModel<Message>) => MutableModel<Message> | void): Message;
}