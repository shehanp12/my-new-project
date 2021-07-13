import React from "react";
import { DeleteIcon } from "@webiny/ui/List/DataList/icons";
import { ButtonIcon, ButtonSecondary } from "@webiny/ui/Button";
import { ReactComponent as AddIcon } from "@webiny/app-admin/assets/icons/add-18px.svg";
import {
    DataList,
    ScrollList,
    ListItem,
    ListItemText,
    ListItemMeta,
    ListActions
} from "@webiny/ui/List";
import { useCarAdminsDataList } from "./hooks/useCarAdminsDataList";

/**
 * Renders a list of all CarAdmin entries. Includes basic deletion, pagination, and sorting capabilities.
 * The data querying functionality is located in the `useCarAdminsDataList` React hook.
 */

// By default, we are able to sort entries by time of creation (ascending and descending).
// More sorters can be added, but not that further adjustments will be needed on the GraphQL API side.
const sorters = [
    {
        label: "Newest to oldest",
        value: "createdOn_DESC"
    },
    {
        label: "Oldest to newest",
        value: "createdOn_ASC"
    }
];

const CarAdminsDataList = () => {
    const {
        carAdmins,
        loading,
        refresh,
        pagination,
        setSort,
        newCarAdmin,
        editCarAdmin,
        deleteCarAdmin,
        currentCarAdminId
    } = useCarAdminsDataList();

    return (
        <DataList
            title={"Car Admins"}
            data={carAdmins}
            loading={loading}
            refresh={refresh}
            pagination={pagination}
            sorters={sorters}
            setSorters={setSort}
            actions={
                <ButtonSecondary onClick={newCarAdmin}>
                    <ButtonIcon icon={<AddIcon />} />
                    New Car Admin
                </ButtonSecondary>
            }
        >
            {({ data }) => (
                <ScrollList>
                    {data.map(item => (
                        <ListItem key={item.id} selected={item.id === currentCarAdminId}>
                            <ListItemText onClick={() => editCarAdmin(item.id)}>
                                {item.title}
                            </ListItemText>

                            <ListItemMeta>
                                <ListActions>
                                    <DeleteIcon onClick={() => deleteCarAdmin(item)} />
                                </ListActions>
                            </ListItemMeta>
                        </ListItem>
                    ))}
                </ScrollList>
            )}
        </DataList>
    );
};

export default CarAdminsDataList;
