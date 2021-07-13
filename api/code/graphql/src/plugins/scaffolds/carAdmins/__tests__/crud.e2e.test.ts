import {
    GET_CAR_ADMIN,
    CREATE_CAR_ADMIN,
    DELETE_CAR_ADMIN,
    LIST_CAR_ADMINS,
    UPDATE_CAR_ADMIN
} from "./graphql/carAdmins";
import { request } from "graphql-request";

/**
 * An example of an end-to-end (E2E) test. You can use these to test if the overall cloud infrastructure
 * setup is working. That's why, here we're not executing the handler code directly, but issuing real
 * HTTP requests over to the deployed Amazon Cloudfront distribution. These tests provide the highest
 * level of confidence that our application is working, but they take more time in order to complete.
 * https://www.webiny.com/docs/how-to-guides/webiny-cli/scaffolding/extend-graphql-api#crude2etestts
 */

const query = async ({ query = "", variables = {} } = {}) => {
    return request(process.env.API_URL + "/graphql", query, variables);
};

let testCarAdmins = [];

describe("CarAdmins CRUD tests (end-to-end)", () => {
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
                }).then(response => response.carAdmins.createCarAdmin)
            );
        }
    });

    afterEach(async () => {
        for (let i = 0; i < 3; i++) {
            try {
                await query({
                    query: DELETE_CAR_ADMIN,
                    variables: {
                        id: testCarAdmins[i].id
                    }
                });
            } catch {
                // Some of the entries might've been deleted during runtime.
                // We can ignore thrown errors.
            }
        }
        testCarAdmins = [];
    });

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Now that we have carAdmins created, let's see if they come up in a basic listCarAdmins query.
        const [carAdmin0, carAdmin1, carAdmin2] = testCarAdmins;

        await query({
            query: LIST_CAR_ADMINS,
            variables: { limit: 3 }
        }).then(response =>
            expect(response.carAdmins.listCarAdmins).toMatchObject({
                data: [carAdmin2, carAdmin1, carAdmin0],
                meta: {
                    limit: 3
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
            query: LIST_CAR_ADMINS,
            variables: {
                limit: 2
            }
        }).then(response =>
            expect(response.carAdmins.listCarAdmins).toMatchObject({
                data: [carAdmin2, carAdmin0],
                meta: {
                    limit: 2
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
            expect(response.carAdmins.updateCarAdmin).toEqual({
                id: carAdmin0.id,
                title: "CarAdmin 0 - UPDATED",
                description: `CarAdmin 0's description - UPDATED.`
            })
        );

        // 4. Get carAdmin 0 after the update.
        await query({
            query: GET_CAR_ADMIN,
            variables: {
                id: carAdmin0.id
            }
        }).then(response =>
            expect(response.carAdmins.getCarAdmin).toEqual({
                id: carAdmin0.id,
                title: "CarAdmin 0 - UPDATED",
                description: `CarAdmin 0's description - UPDATED.`
            })
        );
    });
});
