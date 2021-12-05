// vendors
import {ApolloServer} from 'apollo-server-express';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';

// middlewares
import ValidateAccess from './middlewares/access.middlewares.js';

// utilities
import connect from './database';

// typeDefs
import userSchema from './users/schema/index.js';
import projectSchema from './projects/schema/index.js';

// resolvers
import { allUsers } from './users/resolvers/index.js';
import { isHostComponent } from '@mui/base';

const typeDefs = {
    ...userSchema,
    projectSchema
};

const resolvers = {
    Query: {
        allUsers,
    }
}

// initialization
dotenv.config();
connect();

const startApolloServer = async (typeDefs, resolvers) => {
    const PORT = process.env.PORT;
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer})],
        // context: async ({ req } => await validateAuthentication(req)),
        introspection: true,
    });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise(resolve => httpServer.listen({ port: PORT }), resolve);
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
};

startApolloServer(typeDefs, resolvers);