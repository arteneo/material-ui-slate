import React from "react";
import { makeStyles, Paper } from "@material-ui/core";
import SlatePluginsType from "@arteneo/material-ui-slate/definitions/SlatePluginsType";

interface ToolbarProps {
    plugins: SlatePluginsType;
}

const useStyles = makeStyles(() => ({
    toolbar: {
        width: "100%",
        display: "flex",
    },
}));

const Toolbar = ({ plugins }: ToolbarProps) => {
    const classes = useStyles();

    return (
        <Paper className={classes.toolbar}>
            <>
                {plugins.map((plugin, key) => {
                    if (typeof plugin.toolbarComponent !== "undefined") {
                        return <React.Fragment key={key}>{plugin.toolbarComponent}</React.Fragment>;
                    }

                    return null;
                })}
            </>
        </Paper>
    );
};

export default Toolbar;
export { ToolbarProps };
