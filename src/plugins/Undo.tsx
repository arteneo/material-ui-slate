import React from "react";
import { useSlate } from "slate-react";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { Undo } from "@material-ui/icons";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";

const UndoButton = ({ ...iconButtonProps }: IconButtonProps) => {
    const editor = useSlate();

    const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        editor.undo();
    };

    return (
        <IconButton
            {...{
                onMouseDown,
                children: <Undo />,
                ...iconButtonProps,
            }}
        />
    );
};

const plugin: SlatePluginInterface = {
    toolbarComponent: <UndoButton />,
};

export default plugin;
export { UndoButton, IconButtonProps as UndoButtonProps };
