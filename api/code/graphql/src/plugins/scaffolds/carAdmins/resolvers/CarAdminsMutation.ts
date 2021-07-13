import { CarAdminEntity } from "../types";
import mdbid from "mdbid";
import { CarAdmin } from "../entities";
import CarAdminsResolver from "./CarAdminsResolver";

/**
 * Contains base `createCarAdmin`, `updateCarAdmin`, and `deleteCarAdmin` GraphQL resolver functions.
 * Feel free to adjust the code to your needs. Also, note that at some point in time, you will
 * most probably want to implement custom data validation and security-related checks.
 * https://www.webiny.com/docs/how-to-guides/webiny-cli/scaffolding/extend-graphql-api#essential-files
 */

interface CreateCarAdminParams {
    data: {
        title: string;
        description?: string;
    };
}

interface UpdateCarAdminParams {
    id: string;
    data: {
        title: string;
        description?: string;
    };
}

interface DeleteCarAdminParams {
    id: string;
}

interface CarAdminsMutation {
    createCarAdmin(params: CreateCarAdminParams): Promise<CarAdminEntity>;
    updateCarAdmin(params: UpdateCarAdminParams): Promise<CarAdminEntity>;
    deleteCarAdmin(params: DeleteCarAdminParams): Promise<CarAdminEntity>;
}

/**
 * To define our GraphQL resolvers, we are using the "class method resolvers" approach.
 * https://www.graphql-tools.com/docs/resolvers#class-method-resolvers
 */
export default class CarAdminsMutationResolver extends CarAdminsResolver
    implements CarAdminsMutation {
    /**
     * Creates and returns a new CarAdmin entry.
     * @param data
     */
    async createCarAdmin({ data }: CreateCarAdminParams) {
        const { security } = this.context;

        // We use `mdbid` (https://www.npmjs.com/package/mdbid) library to generate
        // a random, unique, and sequential (sortable) ID for our new entry.
        const id = mdbid();

        const identity = await security.getIdentity();
        const carAdmin = {
            ...data,
            PK: this.getPK(),
            SK: id,
            id,
            createdOn: new Date().toISOString(),
            savedOn: new Date().toISOString(),
            createdBy: identity && {
                id: identity.id,
                type: identity.type,
                displayName: identity.displayName
            },
            webinyVersion: process.env.WEBINY_VERSION
        };

        // Will throw an error if something goes wrong.
        await CarAdmin.put(carAdmin);

        return carAdmin;
    }

    /**
     * Updates and returns an existing CarAdmin entry.
     * @param id
     * @param data
     */
    async updateCarAdmin({ id, data }: UpdateCarAdminParams) {
        // If entry is not found, we throw an error.
        const { Item: carAdmin } = await CarAdmin.get({ PK: this.getPK(), SK: id });
        if (!carAdmin) {
            throw new Error(`CarAdmin "${id}" not found.`);
        }

        const updatedCarAdmin = { ...carAdmin, ...data };

        // Will throw an error if something goes wrong.
        await CarAdmin.update(updatedCarAdmin);

        return updatedCarAdmin;
    }

    /**
     * Deletes and returns an existing CarAdmin entry.
     * @param id
     */
    async deleteCarAdmin({ id }: DeleteCarAdminParams) {
        // If entry is not found, we throw an error.
        const { Item: carAdmin } = await CarAdmin.get({ PK: this.getPK(), SK: id });
        if (!carAdmin) {
            throw new Error(`CarAdmin "${id}" not found.`);
        }

        // Will throw an error if something goes wrong.
        await CarAdmin.delete(carAdmin);

        return carAdmin;
    }
}
