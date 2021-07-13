export default /* GraphQL */ `
    type CarAdmin {
        id: ID!
        title: String!
        description: String
        createdOn: DateTime!
        savedOn: DateTime!
        createdBy: CarAdminCreatedBy
    }

    type CarAdminCreatedBy {
        id: String!
        type: String!
        displayName: String!
    }

    input CarAdminCreateInput {
        title: String!
        description: String
    }

    input CarAdminUpdateInput {
        title: String
        description: String
    }

    type CarAdminsListMeta {
        limit: Number
        before: String
        after: String
    }

    enum CarAdminsListSort {
        createdOn_ASC
        createdOn_DESC
    }

    type CarAdminsList {
        data: [CarAdmin]
        meta: CarAdminsListMeta
    }

    type CarAdminQuery {
        getCarAdmin(id: ID!): CarAdmin
        listCarAdmins(
            limit: Int
            before: String
            after: String
            sort: CarAdminsListSort
        ): CarAdminsList!
    }

    type CarAdminMutation {
        # Creates and returns a new CarAdmin entry.
        createCarAdmin(data: CarAdminCreateInput!): CarAdmin!

        # Updates and returns an existing CarAdmin entry.
        updateCarAdmin(id: ID!, data: CarAdminUpdateInput!): CarAdmin!

        # Deletes and returns an existing CarAdmin entry.
        deleteCarAdmin(id: ID!): CarAdmin!
    }

    extend type Query {
        carAdmins: CarAdminQuery
    }

    extend type Mutation {
        carAdmins: CarAdminMutation
    }
`;
