const { GraphQLServer } = require("graphql-yoga");

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

`;

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
      return id;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(({ port }) => {
  console.log(`server started on port: ${port}`);
});
