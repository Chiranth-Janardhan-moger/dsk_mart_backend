import gql from "graphql-tag";

export const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    name: String!
    email: String
    phone: String
    role: String!
  }

  type Order {
    id: ID!
    orderNumber: String!
    customer: User!
    deliveryBoy: User
    items: [OrderItem!]!
    totalAmount: Float!
    status: String!
    paymentMethod: String
    paymentStatus: String!
    createdAt: Date!
  }

  type OrderItem {
    productId: ID!
    name: String!
    quantity: Int!
    price: Float!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    orders: [Order!]!
    order(id: ID!): Order
  }

  type Mutation {
    login(emailOrPhone: String!, password: String!): AuthPayload!
    register(name: String!, email: String, phone: String, password: String!, role: String): AuthPayload!
  }
`;
