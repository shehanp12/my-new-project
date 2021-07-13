import React, { Suspense, lazy } from "react";
import Helmet from "react-helmet";
import { Route } from "@webiny/react-router";
import { CircularProgress } from "@webiny/ui/Progress";
import { AdminLayout } from "@webiny/app-admin/components/AdminLayout";
import { RoutePlugin } from "@webiny/app/plugins/RoutePlugin";

/**
 * Registers new "/car-admins" route.
 */

const Loader = ({ children, ...props }) => (
    <Suspense fallback={<CircularProgress />}>{React.cloneElement(children, props)}</Suspense>
);

const CarAdmins = lazy(() => import("./views"));

export default new RoutePlugin({
    route: (
        <Route
            path={"/car-admins"}
            exact
            render={() => (
                <AdminLayout>
                    <Helmet>
                        <title>Car Admins</title>
                    </Helmet>
                    <Loader>
                        <CarAdmins />
                    </Loader>
                </AdminLayout>
            )}
        />
    )
});
