import React from "react";
import { Editor } from "slate";
import { useSlate } from "slate-react";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { FormatClear } from "@material-ui/icons";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";

const ClearButton = ({ ...iconButtonProps }: IconButtonProps) => {
    const editor = useSlate();

    const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        const marks = Editor.marks(editor);
        if (marks === null) {
            return;
        }

        Object.keys(marks).forEach((mark: string) => {
            Editor.removeMark(editor, mark);
        });
    };

    return (
        <IconButton
            {...{
                onMouseDown,
                children: <FormatClear />,
                ...iconButtonProps,
            }}
        />
    );
};

const plugin: SlatePluginInterface = {
    toolbarComponent: <ClearButton />,
};

export default plugin;
export { ClearButton, IconButtonProps as ClearButtonProps };
