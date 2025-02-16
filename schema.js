const { gql } = require('apollo-server-express');

const typeDefs = gql`
    scalar Date

    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
    }

    type Employee {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        designation: String!
        department: String!
        salary: Float!
        created_at: Date
        updated_at: Date
    }

    type AuthPayload {
        user: User!
        token: String!
    }

    type Query {
        loginUser(email: String!, password: String!): AuthPayload!
        getAllEmployees: [Employee!]!
        getEmployeeById(id: ID!): Employee
        getEmployeesByDesignationOrDepartment(designation: String, department: String): [Employee!]!
        getAllUsers: [User!]!
    }

    type Mutation {
        signupUser(username: String!, email: String!, password: String!): AuthPayload!
        addEmployee(first_name: String!, last_name: String!, email: String!, designation: String!, department: String!, salary: Float!): Employee!
        updateEmployee(id: ID!, first_name: String, last_name: String, email: String, designation: String, department: String, salary: Float!): Employee!
        deleteEmployee(id: ID!): String!
    }
`;

module.exports = { typeDefs };
