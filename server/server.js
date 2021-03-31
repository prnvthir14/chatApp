const { GraphQLServer, PubSub } = require("graphql-yoga");

const messages = [];

//define schema here (type = messages)
//define Query here (type = Query) - how we fetch data from GraphQL server
//define Mutation here (type = Mutation) - how we add data to GraphQL server
const typeDefs = `

  type Message {
    id:ID!
    user:String!
    content:String!
  }

  type Query {
    messages:[Message!]

  }

  type Mutation {
  postMessage(user: String!, content: String!): ID!
  }

  type Subscription {
    messages:[Message!]
    }



`;

const sunscribers = [];
const onMessagesUpdate = (fn) => sunscribers.push(fn);

const pubsub = new PubSub();

//typeDefs defines schema, resolvers are how we actually get the data back
//resolvers match the keys that are in the typeDegs
const resolvers = {
  Query: {
    messages: () => messages,
  },

  Mutation: {
    postMessage: (parent, { user, content }) => {
      const id = messages.length;
      messages.push({
        id,
        user,
        content,
      });
      //alert system if there are new messages out there
      sunscribers.forEach((fn) => fn());
      return id;
    },
  },

  Subscription: {
    messages: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).slice(2, 15);
        onMessagesUpdate(() => pubsub.publish(channel, { messages }));
        setTimeout(() => pubsub.publish(channel, { messages }), 0);
        return pubsub.asyncIterator(channel);
      },
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

server.start(({ port }) => {
  console.log(`server started on port: ${port}`);
});
