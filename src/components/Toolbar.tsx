import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";
import SlatePluginsType from "@arteneo/material-ui-slate/definitions/SlatePluginsType";

interface ToolbarProps {
    plugins: SlatePluginsType;
    disabled?: boolean;
}

const useStyles = makeStyles((theme) => ({
    toolbar: {
        width: "100%",
        display: "flex",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.palette.grey[300],
    },
    toolbarDisabled: {
        opacity: 0.5,
        pointerEvents: "none",
        cursor: "not-allowed",
    },
}));

const Toolbar = ({ plugins, disabled }: ToolbarProps) => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.toolbar, disabled && classes.toolbarDisabled)}>
            <>
                {plugins.map((plugin, key) => {
                    if (typeof plugin.toolbarComponent !== "undefined") {
                        return <React.Fragment key={key}>{plugin.toolbarComponent}</React.Fragment>;
                    }

                    return null;
                })}
            </>
        </div>
    );
};

export default Toolbar;
export { ToolbarProps };
