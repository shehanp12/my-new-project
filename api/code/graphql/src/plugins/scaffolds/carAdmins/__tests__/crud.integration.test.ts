import { handler } from "~/index";
import {
    GET_CAR_ADMIN,
    CREATE_CAR_ADMIN,
    DELETE_CAR_ADMIN,
    LIST_CAR_ADMINS,
    UPDATE_CAR_ADMIN
} from "./graphql/carAdmins";

/**
 * An example of an integration test. You can use these to test your GraphQL resolvers, for example,
 * ensure they are correctly interacting with the database and other cloud infrastructure resources
 * and services. These tests provide a good level of confidence that our application is working, and
 * can be reasonably fast to complete.
 * https://www.webiny.com/docs/how-to-guides/webiny-cli/scaffolding/extend-graphql-api#crudintegrationtestts
 */

const query = ({ query = "", variables = {} } = {}) => {
    return handler({
        httpMethod: "POST",
        headers: {},
        body: JSON.stringify({
            query,
            variables
        })
    }).then(response => JSON.parse(response.body));
};

let testCarAdmins = [];

describe("CarAdmins CRUD tests (integration)", () => {
    beforeEach(async () => {
        for (let i = 0; i < 3; i++) {
            testCarAdmins.push(
                await query({
                    query: CREATE_CAR_ADMIN,
                    variables: {
                        data: {
                            title: `CarAdmin ${i}`,
                            description: `CarAdmin ${i}'s description.`
                        }
                    }
                }).then(response => response.data.carAdmins.createCarAdmin)
            );
        }
    });

    afterEach(async () => {
        for (let i = 0; i < 3; i++) {
            await query({
                query: DELETE_CAR_ADMIN,
                variables: {
                    id: testCarAdmins[i].id
                }
            });
        }
        testCarAdmins = [];
    });

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Now that we have carAdmins created, let's see if they come up in a basic listCarAdmins query.
        const [carAdmin0, carAdmin1, carAdmin2] = testCarAdmins;

        await query({ query: LIST_CAR_ADMINS }).then(response =>
            expect(response.data.carAdmins.listCarAdmins).toEqual({
                data: [carAdmin2, carAdmin1, carAdmin0],
                meta: {
                    after: null,
                    before: null,
                    limit: 10
                }
            })
        );

        // 2. Delete carAdmin 1.
        await query({
            query: DELETE_CAR_ADMIN,
            variables: {
                id: carAdmin1.id
            }
        });

        await query({
            query: LIST_CAR_ADMINS
        }).then(response =>
            expect(response.data.carAdmins.listCarAdmins).toEqual({
                data: [carAdmin2, carAdmin0],
                meta: {
                    after: null,
                    before: null,
                    limit: 10
                }
            })
        );

        // 3. Update carAdmin 0.
        await query({
            query: UPDATE_CAR_ADMIN,
            variables: {
                id: carAdmin0.id,
                data: {
                    title: "CarAdmin 0 - UPDATED",
                    description: `CarAdmin 0's description - UPDATED.`
                }
            }
        }).then(response =>
            expect(response.data.carAdmins.updateCarAdmin).toEqual({
                id: carAdmin0.id,
                title: "CarAdmin 0 - UPDATED",
                description: `CarAdmin 0's description - UPDATED.`
            })
        );

        // 5. Get carAdmin 0 after the update.
        await query({
            query: GET_CAR_ADMIN,
            variables: { id: carAdmin0.id }
        }).then(response =>
            expect(response.data.carAdmins.getCarAdmin).toEqual({
                id: carAdmin0.id,
                title: "CarAdmin 0 - UPDATED",
                description: `CarAdmin 0's description - UPDATED.`
            })
        );
    });

    test("should be able to use cursor-based pagination (desc)", async () => {
        const [carAdmin0, carAdmin1, carAdmin2] = testCarAdmins;

        await query({
            query: LIST_CAR_ADMINS,
            variables: {
                limit: 2
            }
        }).then(response =>
            expect(response.data.carAdmins.listCarAdmins).toEqual({
                data: [carAdmin2, carAdmin1],
                meta: {
                    after: carAdmin1.id,
                    before: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_CAR_ADMINS,
            variables: {
                limit: 2,
                after: carAdmin1.id
            }
        }).then(response =>
            expect(response.data.carAdmins.listCarAdmins).toEqual({
                data: [carAdmin0],
                meta: {
                    before: carAdmin0.id,
                    after: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_CAR_ADMINS,
            variables: {
                limit: 2,
                before: carAdmin0.id
            }
        }).then(response =>
            expect(response.data.carAdmins.listCarAdmins).toEqual({
                data: [carAdmin2, carAdmin1],
                meta: {
                    after: carAdmin1.id,
                    before: null,
                    limit: 2
                }
            })
        );
    });

    test("should be able to use cursor-based pagination (ascending)", async () => {
        const [carAdmin0, carAdmin1, carAdmin2] = testCarAdmins;

        await query({
            query: LIST_CAR_ADMINS,
            variables: {
                limit: 2,
                sort: "createdOn_ASC"
            }
        }).then(response =>
            expect(response.data.carAdmins.listCarAdmins).toEqual({
                data: [carAdmin0, carAdmin1],
                meta: {
                    after: carAdmin1.id,
                    before: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_CAR_ADMINS,
            variables: {
                limit: 2,
                sort: "createdOn_ASC",
                after: carAdmin1.id
            }
        }).then(response =>
            expect(response.data.carAdmins.listCarAdmins).toEqual({
                data: [carAdmin2],
                meta: {
                    before: carAdmin2.id,
                    after: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_CAR_ADMINS,
            variables: {
                limit: 2,
                sort: "createdOn_ASC",
                before: carAdmin2.id
            }
        }).then(response =>
            expect(response.data.carAdmins.listCarAdmins).toEqual({
                data: [carAdmin0, carAdmin1],
                meta: {
                    after: carAdmin1.id,
                    before: null,
                    limit: 2
                }
            })
        );
    });
});
