import React from "react";
import { SplitView, LeftPanel, RightPanel } from "@webiny/app-admin/components/SplitView";
import CarAdminsDataList from "./CarAdminsDataList";
import CarAdminsForm from "./CarAdminsForm";

/**
 * Main view component - renders data list and form.
 */

const CarAdminsView = () => {
    return (
        <SplitView>
            <LeftPanel>
                <CarAdminsDataList />
            </LeftPanel>
            <RightPanel>
                <CarAdminsForm />
            </RightPanel>
        </SplitView>
    );
};

export default CarAdminsView;
