import { useCallback, useReducer } from "react";
import { useRouter } from "@webiny/react-router";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { useConfirmationDialog } from "@webiny/app-admin/hooks/useConfirmationDialog";
import { PaginationProp } from "@webiny/ui/List/DataList/types";
import { LIST_CAR_ADMINS, DELETE_CAR_ADMIN } from "./graphql";

/**
 * Contains essential data listing functionality - data querying and UI control.
 */

interface useCarAdminsDataListHook {
    (): {
        carAdmins: Array<{
            id: string;
            title: string;
            description: string;
            createdOn: string;
            [key: string]: any;
        }>;
        loading: boolean;
        pagination: PaginationProp;
        refresh: () => void;
        setSort: (sort: string) => void;
        newCarAdmin: () => void;
        editCarAdmin: (id: string) => void;
        deleteCarAdmin: (id: string) => void;
        currentCarAdminId: string;
    };
}

const reducer = (prev, next) => ({ ...prev, ...next });

export const useCarAdminsDataList: useCarAdminsDataListHook = () => {
    // Base state and UI React hooks.
    const { history } = useRouter();
    const { showSnackbar } = useSnackbar();
    const { showConfirmation } = useConfirmationDialog();
    const [variables, setVariables] = useReducer(reducer, {
        limit: undefined,
        after: undefined,
        before: undefined,
        sort: undefined
    });

    const searchParams = new URLSearchParams(location.search);
    const currentCarAdminId = searchParams.get("id");

    // Queries and mutations.
    const listQuery = useQuery(LIST_CAR_ADMINS, {
        variables,
        onError: e => showSnackbar(e.message)
    });

    const [deleteIt, deleteMutation] = useMutation(DELETE_CAR_ADMIN, {
        refetchQueries: [{ query: LIST_CAR_ADMINS }]
    });

    const { data: carAdmins = [], meta = {} } = listQuery.loading
        ? {}
        : listQuery?.data?.carAdmins?.listCarAdmins || {};
    const loading = [listQuery, deleteMutation].some(item => item.loading);

    // Base CRUD actions - new, edit, and delete.
    const newCarAdmin = useCallback(() => history.push("/car-admins?new"), []);
    const editCarAdmin = useCallback(id => {
        history.push(`/car-admins?id=${id}`);
    }, []);

    const deleteCarAdmin = useCallback(
        item => {
            showConfirmation(async () => {
                try {
                    await deleteIt({
                        variables: item
                    });

                    showSnackbar(`Car Admin "${item.title}" deleted.`);
                    if (currentCarAdminId === item.id) {
                        history.push(`/car-admins`);
                    }
                } catch (e) {
                    showSnackbar(e.message);
                }
            });
        },
        [currentCarAdminId]
    );

    // Sorting.
    const setSort = useCallback(
        value => setVariables({ after: undefined, before: undefined, sort: value }),
        []
    );

    // Pagination metadata and controls.
    const setPreviousPage = useCallback(
        () => setVariables({ after: undefined, before: meta.before }),
        undefined
    );
    const setNextPage = useCallback(
        () => setVariables({ after: meta.after, before: undefined }),
        undefined
    );
    const setLimit = useCallback(
        value => setVariables({ after: undefined, before: undefined, limit: value }),
        []
    );

    const pagination: PaginationProp = {
        setPerPage: setLimit,
        perPageOptions: [10, 25, 50],
        setPreviousPage,
        setNextPage,
        hasPreviousPage: meta.before,
        hasNextPage: meta.after
    };

    return {
        carAdmins,
        loading,
        refresh: listQuery.refetch,
        pagination,
        setSort,
        newCarAdmin,
        editCarAdmin,
        deleteCarAdmin,
        currentCarAdminId
    };
};
