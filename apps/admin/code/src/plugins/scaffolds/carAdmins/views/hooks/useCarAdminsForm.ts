import { useCallback } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useRouter } from "@webiny/react-router";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { GET_CAR_ADMIN, CREATE_CAR_ADMIN, UPDATE_CAR_ADMIN, LIST_CAR_ADMINS } from "./graphql";

/**
 * Contains essential form functionality: data fetching, form submission, notifications, redirecting, and more.
 */

/**
 * Omits irrelevant values from the submitted form data (`id`, `createdOn`, `savedOn`, `createdBy`).
 * @param formData
 */
const getMutationData = formData => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdOn, savedOn, createdBy, ...data } = formData;
    return data;
};

export const useCarAdminsForm = () => {
    const { location, history } = useRouter();
    const { showSnackbar } = useSnackbar();
    const searchParams = new URLSearchParams(location.search);
    const currentCarAdminId = searchParams.get("id");

    const getQuery = useQuery(GET_CAR_ADMIN, {
        variables: { id: currentCarAdminId },
        skip: !currentCarAdminId,
        onError: error => {
            history.push("/car-admins");
            showSnackbar(error.message);
        }
    });

    const [create, createMutation] = useMutation(CREATE_CAR_ADMIN, {
        refetchQueries: [{ query: LIST_CAR_ADMINS }]
    });

    const [update, updateMutation] = useMutation(UPDATE_CAR_ADMIN);

    const loading = [getQuery, createMutation, updateMutation].some(item => item.loading);

    const onSubmit = useCallback(
        async formData => {
            const { id } = formData;
            const data = getMutationData(formData);
            const [operation, options] = id
                ? [update, { variables: { id, data } }]
                : [create, { variables: { data } }];

            try {
                const result = await operation(options);
                if (!id) {
                    const { id } = result.data.carAdmins.createCarAdmin;
                    history.push(`/car-admins?id=${id}`);
                }

                showSnackbar("Car Admin saved successfully.");
            } catch (e) {
                showSnackbar(e.message);
            }
        },
        [currentCarAdminId]
    );

    const carAdmin = getQuery?.data?.carAdmins?.getCarAdmin;
    const emptyViewIsShown = !searchParams.has("new") && !loading && !carAdmin;
    const currentCarAdmin = useCallback(() => history.push("/car-admins?new"), []);
    const cancelEditing = useCallback(() => history.push("/car-admins"), []);

    return {
        loading,
        emptyViewIsShown,
        currentCarAdmin,
        cancelEditing,
        carAdmin,
        onSubmit
    };
};
