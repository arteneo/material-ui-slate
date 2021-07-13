import React from "react";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { FormatAlignCenter, FormatAlignJustify, FormatAlignLeft, FormatAlignRight } from "@material-ui/icons";
import { useSlate } from "slate-react";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";
import { Editor, Transforms, Element as SlateElement } from "slate";

type TextAlignElementType = "text-align-left" | "text-align-center" | "text-align-right" | "text-align-justify";

// eslint-disable-next-line
const getTextAlignStyle = (element: any): React.CSSProperties => {
    const style: React.CSSProperties = {};

    switch (element?.textAlign) {
        case "text-align-left":
            style["textAlign"] = "left";
            break;
        case "text-align-center":
            style["textAlign"] = "center";
            break;
        case "text-align-right":
            style["textAlign"] = "right";
            break;
        case "text-align-justify":
            style["textAlign"] = "justify";
            break;
    }

    return style;
};

interface TextAlignButtonProps extends IconButtonProps {
    supportedTypes?: string[];
}

const TextAlignButton = ({
    supportedTypes = [
        "paragraph",
        "heading-one",
        "heading-two",
        "heading-three",
        "heading-four",
        "heading-five",
        "heading-six",
    ],
    ...iconButtonProps
}: TextAlignButtonProps) => {
    const editor = useSlate();

    const onClick = (type: TextAlignElementType) => {
        const [match] = Editor.nodes(editor, {
            match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && supportedTypes.includes(n.type),
        });

        // This is a valid double negation. Probably Editor.nodes is using invalid typings
        // eslint-disable-next-line
        if (!!match) {
            const newProperties: Partial<SlateElement> = {
                textAlign: type,
            };
            Transforms.setNodes(editor, newProperties);
        }
    };

    return (
        <>
            <IconButton
                {...{
                    onClick: () => onClick("text-align-left"),
                    children: <FormatAlignLeft />,
                    ...iconButtonProps,
                }}
            />
            <IconButton
                {...{
                    onClick: () => onClick("text-align-center"),
                    children: <FormatAlignCenter />,
                    ...iconButtonProps,
                }}
            />
            <IconButton
                {...{
                    onClick: () => onClick("text-align-right"),
                    children: <FormatAlignRight />,
                    ...iconButtonProps,
                }}
            />
            <IconButton
                {...{
                    onClick: () => onClick("text-align-justify"),
                    children: <FormatAlignJustify />,
                    ...iconButtonProps,
                }}
            />
        </>
    );
};

const plugin: SlatePluginInterface = {
    toolbarComponent: <TextAlignButton />,
};

export default plugin;
export { TextAlignElementType, TextAlignButton, TextAlignButtonProps, getTextAlignStyle };
