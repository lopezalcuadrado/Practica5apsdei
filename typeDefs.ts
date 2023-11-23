import { gql } from 'https://deno.land/x/graphql_tag@0.1.2/mod.ts'

export const typeDefs = gql `

type Mutation {
  # Usuarios
  createUser(name: String!, mail: String!): User!
  updateUser(id: ID!, name: String, mail: String): User!
  deleteUser(id: ID!): User!

  # Cómics
  createComic(title: String!, description: String!, formato: String!): Comic!
  updateComic(id: ID!, title: String, description: String, formato: String): Comic!
  deleteComic(id: ID!): Comic!

  # Colecciones de Cómics
  createComicCollection(name: String!): ComicCollection!
  updateComicCollection(id: ID!, name: String): ComicCollection!
  deleteComicCollection(id: ID!): ComicCollection!
  addComicToCollection(collectionId: ID!, comicId: ID!): ComicCollection!
  removeComicFromCollection(collectionId: ID!, comicId: ID!): ComicCollection!
}

  type User {
    id: ID!
    name: String!
    mail: String!
    collection: ComicCollection
  }
  type Query {
  users: [User!]!
  user(id: ID!): User
  comics: [Comic!]!
  comic(id: ID!): Comic
  colecciones: [ComicCollection!]!
  coleccion(id: ID!): ComicCollection
  userWithCollection(id: ID!): User

}
  type Comic {
    id: ID!
    Title: String!
    Description: String
    formato: String!

  }
  type ComicCollection {
    id: ID!
    Name: String!
    Comics: [Comic!]!
  }

  `