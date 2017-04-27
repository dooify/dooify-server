export default `
    scalar Date

    schema {
        query: Query
    }

    type Query {
        recommendations: [Recommendation]
        ad(id: ID): Ad!
        profile(userId: ID): Profile!

    }

    type Recommendation {
        id: ID!
        createdAt: Date!
        adId: ID!
        ad: Ad!
    }

    type Ad {
        id: ID!
        createdAt: Date!
        userId: ID!
        name: String!
        description: String!
        address: String!
        hours: String
        imageId: String
        userId: String!
        user: User!
    }

    type Balance {
        id: ID!
        createdAt: Date!
        userId: ID!
        hours: String!
    }

    type Bonus {
        id: ID!
        createdAt: Date!
        userId: ID!
        hours: String!
    }

    type Booking {
        id: ID!
        createdAt: Date!
        adId: ID!
        buyerUserId: ID!
        sellerUserId: ID!
    }

    type BookingDeal {
        id: ID!
        createdAt: Date!
        bookingId: ID!
        hours: String!
        time: String!
    }

    type BookingMessage {
        id: ID!
        createdAt: Date!
        bookingId: ID!
        userId: ID!
        message: String!
    }

    type BookingProposal {
        id: ID!
        createdAt: Date!
        bookingId: ID!
        hours: String!
        time: String!
    }

    type BookingRefusal {
        id: ID!
        createdAt: Date!
        bookingId: ID!
        userId: ID!
    }

    type BookingRequest {
        id: ID!
        createdAt: Date!
        bookingId: ID!
        message: String!
    }

    type BookingReviewDooify {
        id: ID!
        createdAt: Date!
        bookingId: ID!
        message: String!
    }

    type BookingReviewPrivate {
        id: ID!
        createdAt: Date!
        bookingId: ID!
        message: String!
    }

    type BookingReviewPublic {
        id: ID!
        createdAt: Date!
        bookingId: ID!
        rating: String!
        message: String!
    }

    type Contact {
        id: ID!
        createdAt: Date!
        userId: ID!
        mail: String!
    }

    type FacebookLogin {
        id: ID!
        createdAt: Date!
        userId: ID!
        fbUserId: ID!
    }

    type Heartbeat {
        id: ID!
        createdAt: Date!
        identifier: ID!
        userId: ID!
        isLoggedIn: Boolean!
        page: String!
        resource: String!
    }

    type Image {
        id: ID!
        createdAt: Date!
        userId: ID!
        image: String!
    }

    type Image_100 {
        id: ID!
        createdAt: Date!
        imageId: ID!
        image: String!
    }

    type Image_240 {
        id: ID!
        createdAt: Date!
        imageId: ID!
        image: String!
    }

    type Image_360 {
        id: ID!
        createdAt: Date!
        imageId: ID!
        image: String!
    }

    type Image_750 {
        id: ID!
        createdAt: Date!
        imageId: ID!
        image: String!
    }

    type Login {
        id: ID!
        createdAt: Date!
        userId: ID!
        name: String!
        password: String!
    }

    type MailValidation {
        id: ID!
        createdAt: Date!
        userId: ID!
        activationCode: String!
        isValidated: Boolean!
    }

    type Profile {
        id: ID!
        createdAt: Date!
        userId: ID!
        firstName: String!
        lastName: String!
        description: String
        imageId: ID
        language: String
    }

    type Referral {
        id: ID!
        createdAt: Date!
        vitoUserId: ID!
        lucaUserId: ID!
        isActivated: String!
        hours: String!
    }

    type Session {
        id: ID!
        createdAt: Date!
        userId: ID!
    }

    type Subscription {
        id: ID!
        createdAt: Date!
        userId: ID!
    }

    type User {
        id: ID!
        createdAt: Date!
        profile: Profile!
    }
`
