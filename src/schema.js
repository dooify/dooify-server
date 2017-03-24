const schema = `
  schema {
    query: Query
  }
`

const Query = `
  type Query {
    helloWorld: String!
  }
`

export default [
  schema,
  Query
]
