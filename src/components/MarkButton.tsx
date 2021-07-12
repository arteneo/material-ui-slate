import React from "react";
import { useSlate } from "slate-react";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { toggleMark } from "@arteneo/material-ui-slate/utils/slate";

interface MarkButtonProps extends IconButtonProps {
    format: string;
}

const MarkButton = ({ format, ...iconButtonProps }: MarkButtonProps) => {
    const editor = useSlate();

    const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        toggleMark(editor, format);
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

export default MarkButton;
export { MarkButtonProps };
