export default `
    schema {
        query: Query
    }

    type Query {
        recommendations: [Ad]
    }

    type Profile {
        id: ID!
        userId: ID!
        firstName: String!
        lastName: String!
        description: String!
        imageId: String
        language: String
    }

    type Ad {
        id: ID!
        userId: ID!
        title: String!
        description: String!
        address: String!
        hours: String!
        imageId: String
        profile: Profile!
    }
`
