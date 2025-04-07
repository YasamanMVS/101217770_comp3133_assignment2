const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
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
    login(email: String!, password: String!): AuthPayload!
    createEmployee(
      firstName: String!
      lastName: String!
      email: String!
      department: String!
      position: String!
      profilePic: String
    ): Employee!
    updateEmployee(
      id: ID!
      firstName: String!
      lastName: String!
      email: String!
      department: String!
      position: String!
      profilePic: String
    ): Employee!
    deleteEmployee(id: ID!): Boolean!
  }
`;

module.exports = typeDefs; 