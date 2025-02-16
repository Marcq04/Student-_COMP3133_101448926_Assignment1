const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB Atlas Connection
const mongodb_atlas_url = process.env.MONGODB_URL;

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(mongodb_atlas_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error(`❌ MongoDB Connection Failed: ${error.message}`);
        process.exit(1);
    }
};

// Import GraphQL Schema & Resolvers
const { typeDefs } = require('./schema');
const resolvers = require('./resolvers');

const startServer = async () => {
    const app = express();
    app.use(express.json());
    app.use(cors());

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start(); // Required before applyMiddleware()

    server.applyMiddleware({ app, cors: false });

    // Connect to MongoDB first, then start the server
    await connectDB();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
};

// Start the server
startServer();
