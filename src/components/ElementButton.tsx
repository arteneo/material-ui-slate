import React from "react";
import { useSlate } from "slate-react";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { toggleElement } from "@arteneo/material-ui-slate/utils/slate";
import ElementTypeType from "@arteneo/material-ui-slate/definitions/ElementTypeType";

interface ElementButtonProps extends IconButtonProps {
    format: ElementTypeType;
    formatListItem?: ElementTypeType;
}

const ElementButton = ({ format, formatListItem, ...iconButtonProps }: ElementButtonProps) => {
    const editor = useSlate();

    const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        toggleElement(editor, format, formatListItem);
    };

    return (
        <IconButton
            {...{
                onMouseDown,
                ...iconButtonProps,
            }}
        />
    );
};

export default ElementButton;
export { ElementButtonProps };
