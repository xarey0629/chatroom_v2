// import { GraphQLServer, PubSub } from 'graphql-yoga';
import { createPubSub, createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import * as fs from 'fs';
import { ChatBoxModel } from './models/chatbox'
import Query from './resolvers/Query';
import ChatBox from './resolvers/ChatBox';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';

import mongo from './mongo';

// import User from './resolvers/User';
// import Post from './resolvers/Post';
// import Comment from './resolvers/Comment';


const pubsub = createPubSub();
const yoga = createYoga({
  schema: createSchema({
    typeDefs: fs.readFileSync(
      './src/schema.graphql',
      'utf-8' 
    ),
    resolvers: {
      Query,
      ChatBox,
      Mutation,
      Subscription,
    },
  }),
  context: {
    ChatBoxModel,
    pubsub, 
  },
  // graphqlEndpoint: '/',
  graphiql: {
    subscriptionsProtocol: 'WS',
  }
});

const httpServer = createServer(yoga);
// Web
const wsServer = new WebSocketServer({
  server: httpServer,
  path: yoga.graphqlEndpoint,
});

useServer(
  {
    execute: (args) => args.rootValue.execute(args),
    subscribe: (args) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yoga.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload
        })
      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe
        }
      }
      const errors = validate(args.schema, args.document)
      if (errors.length) return errors
      return args
    }, 
  },
  wsServer,
)

mongo.connect();
const port = process.env.PORT || 4000;
httpServer.listen( {port}, () => {
  console.log(`Listening on http://localhost:${port}`);
});

export default httpServer;

// server.listen({ port: process.env.PORT | 5000 }, () => {
//   console.log(`The server is up on port ${process.env.PORT | 5000}!`);
// });




// const pubsub = new PubSub();

// const server = new GraphQLServer({
//   typeDefs: './src/schema.graphql',
//   resolvers: {
//     Query,
//     Mutation,
//     Subscription,
//     User,
//     Post,
//     Comment,
//   },
//   context: {
//     db,
//     pubsub,
//   },
// });

// server.start({ port: process.env.PORT | 5000 }, () => {
//   console.log(`The server is up on port ${process.env.PORT | 5000}!`);
// });
