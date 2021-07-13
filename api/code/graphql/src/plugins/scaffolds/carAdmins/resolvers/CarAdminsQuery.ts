import { CarAdminEntity } from "../types";
import { CarAdmin } from "../entities";
import CarAdminsResolver from "./CarAdminsResolver";

/**
 * Contains base `getCarAdmin` and `listCarAdmins` GraphQL resolver functions.
 * Feel free to adjust the code to your needs. Also, note that at some point in time, you will
 * most probably want to implement security-related checks.
 * https://www.webiny.com/docs/how-to-guides/webiny-cli/scaffolding/extend-graphql-api#essential-files
 */

interface GetCarAdminParams {
    id: string;
}

interface ListCarAdminsParams {
    sort?: "createdOn_ASC" | "createdOn_DESC";
    limit?: number;
    after?: string;
    before?: string;
}

interface ListCarAdminsResponse {
    data: CarAdminEntity[];
    meta: { limit: number; after: string; before: string };
}

interface CarAdminsQuery {
    getCarAdmin(params: GetCarAdminParams): Promise<CarAdminEntity>;
    listCarAdmins(params: ListCarAdminsParams): Promise<ListCarAdminsResponse>;
}

/**
 * To define our GraphQL resolvers, we are using the "class method resolvers" approach.
 * https://www.graphql-tools.com/docs/resolvers#class-method-resolvers
 */
export default class CarAdminsQueryResolver extends CarAdminsResolver implements CarAdminsQuery {
    /**
     * Returns a single CarAdmin entry from the database.
     * @param id
     */
    async getCarAdmin({ id }: GetCarAdminParams) {
        // Query the database and return the entry. If entry was not found, an error is thrown.
        const { Item: carAdmin } = await CarAdmin.get({ PK: this.getPK(), SK: id });
        if (!carAdmin) {
            throw new Error(`CarAdmin "${id}" not found.`);
        }

        return carAdmin;
    }

    /**
     * List multiple CarAdmin entries from the database.
     * Supports basic sorting and cursor-based pagination.
     * @param limit
     * @param sort
     * @param after
     * @param before
     */
    async listCarAdmins({ limit = 10, sort, after, before }: ListCarAdminsParams) {
        const PK = this.getPK();
        const query = { limit, reverse: sort !== "createdOn_ASC", gt: undefined, lt: undefined };
        const meta = { limit, after: null, before: null };

        // The query is constructed differently, depending on the "before" or "after" values.
        if (before) {
            query.reverse = !query.reverse;
            if (query.reverse) {
                query.lt = before;
            } else {
                query.gt = before;
            }

            const { Items } = await CarAdmin.query(PK, { ...query, limit: limit + 1 });

            const data = Items.slice(0, limit).reverse();

            const hasBefore = Items.length > limit;
            if (hasBefore) {
                meta.before = Items[Items.length - 1].id;
            }

            meta.after = Items[0].id;

            return { data, meta };
        }

        if (after) {
            if (query.reverse) {
                query.lt = after;
            } else {
                query.gt = after;
            }
        }

        const { Items } = await CarAdmin.query(PK, { ...query, limit: limit + 1 });

        const data = Items.slice(0, limit);

        const hasAfter = Items.length > limit;
        if (hasAfter) {
            meta.after = Items[limit - 1].id;
        }

        if (after) {
            meta.before = Items[0].id;
        }

        return { data, meta };
    }
}
