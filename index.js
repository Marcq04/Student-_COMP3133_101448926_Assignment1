const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

// Store sensitive information to env variables
const dotnev = require('dotenv');
dotnev.config();

// mongoDB Atlas Connection String
const mongodb_atlas_url = process.env.MONGODB_URL;

const connectDB = async() => {
    try {
      mongoose.connect(mongodb_atlas_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }).then(success => {
        console.log('Success Mongodb connection')
      }).catch(err => {
        console.log('Error Mongodb connection')
      });
    } 
    catch(error) {
        console.log(`Unable to connect to DB : ${error.message}`);
    }
}

// Define Apollo Server
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const server = new ApolloServer({ typeDefs, resolvers });

// Define Express Server
const app = express();
app.use(express.json());
app.use('*', cors());

// Add Express app as middleware to Apollo Server
server.applyMiddleware({ app, cors: false });

// Start listen 
app.listen({ port: process.env.PORT }, () => {  
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
  connectDB()
});