/**
 * Contains all of the GraphQL queries and mutations that we might need while writing our tests.
 * If needed, feel free to add more.
 */

export const GET_CAR_ADMIN = /* GraphQL */ `
    query GetCarAdmin($id: ID!) {
        carAdmins {
            getCarAdmin(id: $id) {
                id
                title
                description
            }
        }
    }
`;

export const CREATE_CAR_ADMIN = /* GraphQL */ `
    mutation CreateCarAdmin($data: CarAdminCreateInput!) {
        carAdmins {
            createCarAdmin(data: $data) {
                id
                title
                description
            }
        }
    }
`;

export const UPDATE_CAR_ADMIN = /* GraphQL*/ `
    mutation UpdateCarAdmin($id: ID!, $data: CarAdminUpdateInput!) {
        carAdmins {
            updateCarAdmin(id: $id, data: $data) {
                id
                title
                description
            }
        }
    }
`;

export const DELETE_CAR_ADMIN = /* GraphQL */ `
    mutation DeleteCarAdmin($id: ID!) {
        carAdmins {
            deleteCarAdmin(id: $id) {
                id
                title
                description
            }
        }
    }
`;

export const LIST_CAR_ADMINS = /* GraphQL */ `
    query ListCarAdmins($sort: CarAdminsListSort, $limit: Int, $after: String) {
        carAdmins {
            listCarAdmins(sort: $sort, limit: $limit, after: $after) {
                data {
                    id
                    title
                    description
                }
                meta {
                    limit
                    after
                    before
                }
            }
        }
    }
`;
