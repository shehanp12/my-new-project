import React from "react";
import { ReactComponent as Icon } from "./assets/round-ballot-24px.svg";
import { MenuPlugin } from "@webiny/app-admin/plugins/MenuPlugin";

/**
 * Registers "Car Admins" main menu item.
 */
export default new MenuPlugin({
    render({ Menu, Item }) {
        return (
            <Menu name="menu-car-admins" label={"Car Admins"} icon={<Icon />}>
                <Item label={"Car Admins"} path={"/car-admins"} />
            </Menu>
        );
    }
});
