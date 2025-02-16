const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Employee {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String!
    }

    type Query {
        getAllEmployees: [Employee]
        getEmployeeById(id: ID!): Employee
    }

    type Mutation {
        addEmployee(first_name: String!, last_name: String!, email: String!, gender: String!, designation: String!, salary: Float!, date_of_joining: String!, department: String!, employee_photo: String!): Employee
        addEmployeesBulk(employees: [EmployeeInput]!): [Employee]
        updateEmployee(id: ID!, first_name: String, last_name: String, email: String, gender: String, designation: String, salary: Float, date_of_joining: String, department: String, employee_photo: String): Employee
        deleteEmployee(id: ID!): String
    }

    input EmployeeInput {
        first_name: String!
        last_name: String!
        email: String!
        gender: String! 
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String!
    }
`;

module.exports = { typeDefs }