import React from "react";
import { Form } from "@webiny/form";
import { Grid, Cell } from "@webiny/ui/Grid";
import { Input } from "@webiny/ui/Input";
import { ButtonDefault, ButtonIcon, ButtonPrimary } from "@webiny/ui/Button";
import { CircularProgress } from "@webiny/ui/Progress";
import EmptyView from "@webiny/app-admin/components/EmptyView";
import { validation } from "@webiny/validation";
import { ReactComponent as AddIcon } from "@webiny/app-admin/assets/icons/add-18px.svg";
import {
    SimpleForm,
    SimpleFormFooter,
    SimpleFormContent,
    SimpleFormHeader
} from "@webiny/app-admin/components/SimpleForm";
import { useCarAdminsForm } from "./hooks/useCarAdminsForm";

/**
 * Renders a form which enables creating new or editing existing Car Admin entries.
 * Includes two basic fields - title (required) and description.
 * The form submission-related functionality is located in the `useCarAdminsForm` React hook.
 */
const CarAdminsForm = () => {
    const {
        loading,
        emptyViewIsShown,
        currentCarAdmin,
        cancelEditing,
        carAdmin,
        onSubmit
    } = useCarAdminsForm();

    // Render "No content" selected view.
    if (emptyViewIsShown) {
        return (
            <EmptyView
                title={"Click on the left side list to display Car Admins details or create a..."}
                action={
                    <ButtonDefault onClick={currentCarAdmin}>
                        <ButtonIcon icon={<AddIcon />} /> {"New Car Admin"}
                    </ButtonDefault>
                }
            />
        );
    }

    return (
        <Form data={carAdmin} onSubmit={onSubmit}>
            {({ data, form, Bind }) => (
                <SimpleForm>
                    {loading && <CircularProgress />}
                    <SimpleFormHeader title={data.title || "New Car Admin"} />
                    <SimpleFormContent>
                        <Grid>
                            <Cell span={12}>
                                <Bind name="title" validators={validation.create("required")}>
                                    <Input label={"Title"} />
                                </Bind>
                            </Cell>
                            <Cell span={12}>
                                <Bind
                                    name="description"
                                    validators={validation.create("maxLength:500")}
                                >
                                    <Input
                                        label={"Description"}
                                        description={"Provide a short description here."}
                                        rows={4}
                                    />
                                </Bind>
                            </Cell>
                        </Grid>
                    </SimpleFormContent>
                    <SimpleFormFooter>
                        <ButtonDefault onClick={cancelEditing}>Cancel</ButtonDefault>
                        <ButtonPrimary onClick={form.submit}>Save Car Admin</ButtonPrimary>
                    </SimpleFormFooter>
                </SimpleForm>
            )}
        </Form>
    );
};

export default CarAdminsForm;
