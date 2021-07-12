import React from "react";
import { useSlate } from "slate-react";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { Redo } from "@material-ui/icons";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";

const RedoButton = ({ ...iconButtonProps }: IconButtonProps) => {
    const editor = useSlate();

    const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        editor.redo();
    };

    return (
        <IconButton
            {...{
                onMouseDown,
                children: <Redo />,
                ...iconButtonProps,
            }}
        />
    );
};

const plugin: SlatePluginInterface = {
    toolbarComponent: <RedoButton />,
};

export default plugin;
export { RedoButton, IconButtonProps as RedoButtonProps };
