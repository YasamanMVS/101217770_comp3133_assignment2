const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    role: String!
  }

  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    department: String!
    position: String!
    profilePic: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    employees: [Employee!]!
    employee(id: ID!): Employee
    searchEmployees(department: String, position: String): [Employee!]!
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
    createEmployee(
      firstName: String!
      lastName: String!
      email: String!
      department: String!
      position: String!
      profilePic: Upload
    ): Employee!
    updateEmployee(
      id: ID!
      firstName: String
      lastName: String
      email: String
      department: String
      position: String
      profilePic: Upload
    ): Employee!
    deleteEmployee(id: ID!): Boolean!
  }
`;

module.exports = typeDefs; 