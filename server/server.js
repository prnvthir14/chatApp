const { GraphQLServer } = require("graphql-yoga");

const messages =[];

//define schema here
const typeDefs = `

  type Message {
    id:ID!
    user:String!
    content:String!
  }

  type Query {
    messages:[Message!]

  }
`;

//typeDefs defines schema, resolvers are how we actually get the data back
//resolvers match the keys that are in the typeDegs
const resolvers = {

  Query: {
    messages:()=>messages,
  }



}



const server = new GraphQLServer({ typeDefs, resolvers });

server.start(({port})=>{

  console.log(`server started on port: ${port}`)


})
