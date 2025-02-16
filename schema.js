const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Employee {
        _id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String!
        created_at: String!
        updated_at: String!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        created_at: String!
        updated_at: String!
    }

    type AuthPayload {
        user: User
        token: String
    }

    type Query {
        loginUser(email: String!, password: String!): AuthPayload
        getAllEmployees: [Employee]
        getEmployeeById(id: ID!): Employee
        getEmployeesByDesignationOrDepartment(designation: String, department: String): [Employee]
    }

    type Mutation {
        signupUser(username: String!, email: String!, password: String!): AuthPayload
        addEmployee(first_name: String!, last_name: String!, email: String!, gender: String!, designation: String!, salary: Float!, date_of_joining: String!, department: String!, employee_photo: String!): Employee
        updateEmployee(id: ID!, first_name: String, last_name: String, email: String, gender: String, designation: String, salary: Float, date_of_joining: String, department: String, employee_photo: String): Employee
        deleteEmployee(id: ID!): String
    }
`;

module.exports = { typeDefs };
