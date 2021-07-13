import gql from "graphql-tag";

// The same set of fields is being used on all query and mutation operations below.
export const CAR_ADMIN_FIELDS_FRAGMENT = /* GraphQL */ `
    fragment CarAdminFields on CarAdmin {
        id
        title
        description
        createdOn
        savedOn
        createdBy {
            id
            displayName
            type
        }
    }
`;

export const LIST_CAR_ADMINS = gql`
    ${CAR_ADMIN_FIELDS_FRAGMENT}
    query ListCarAdmins($sort: CarAdminsListSort, $limit: Int, $after: String, $before: String) {
        carAdmins {
            listCarAdmins(sort: $sort, limit: $limit, after: $after, before: $before) {
                data {
                    ...CarAdminFields
                }
                meta {
                    before
                    after
                    limit
                }
            }
        }
    }
`;

export const CREATE_CAR_ADMIN = gql`
    ${CAR_ADMIN_FIELDS_FRAGMENT}
    mutation CreateCarAdmin($data: CarAdminCreateInput!) {
        carAdmins {
            createCarAdmin(data: $data) {
                ...CarAdminFields
            }
        }
    }
`;

export const GET_CAR_ADMIN = gql`
    ${CAR_ADMIN_FIELDS_FRAGMENT}
    query GetCarAdmin($id: ID!) {
        carAdmins {
            getCarAdmin(id: $id) {
                ...CarAdminFields
            }
        }
    }
`;

export const DELETE_CAR_ADMIN = gql`
    ${CAR_ADMIN_FIELDS_FRAGMENT}
    mutation DeleteCarAdmin($id: ID!) {
        carAdmins {
            deleteCarAdmin(id: $id) {
                ...CarAdminFields
            }
        }
    }
`;

export const UPDATE_CAR_ADMIN = gql`
    ${CAR_ADMIN_FIELDS_FRAGMENT}
    mutation UpdateCarAdmin($id: ID!, $data: CarAdminUpdateInput!) {
        carAdmins {
            updateCarAdmin(id: $id, data: $data) {
                ...CarAdminFields
            }
        }
    }
`;
