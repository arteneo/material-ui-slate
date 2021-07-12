import React from "react";
import { useSlate } from "slate-react";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { SpaceBar } from "@material-ui/icons";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";

const NbspButton = ({ ...iconButtonProps }: IconButtonProps) => {
    const editor = useSlate();

    const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        editor.insertText("\u00A0");
    };

    return (
        <IconButton
            {...{
                onMouseDown,
                children: <SpaceBar />,
                ...iconButtonProps,
            }}
        />
    );
};

const plugin: SlatePluginInterface = {
    toolbarComponent: <NbspButton />,
};

export default plugin;
export { NbspButton, IconButtonProps as NbspButtonProps };
