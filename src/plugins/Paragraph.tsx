import React from "react";
import { RenderElementProps } from "slate-react";
import { jsx } from "slate-hyperscript";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";
import TextType from "@arteneo/material-ui-slate/definitions/TextType";
import DeserializeType from "@arteneo/material-ui-slate/definitions/DeserializeType";
import DeserializeElementType from "@arteneo/material-ui-slate/definitions/DeserializeElementType";
import ElementType from "@arteneo/material-ui-slate/definitions/ElementType";
import { getTextAlignStyle, TextAlignElementType } from "@arteneo/material-ui-slate/plugins/TextAlign";
import { getStyleAttr } from "@arteneo/material-ui-slate/utils/slate";

type ParagraphElementType = "paragraph";

interface ParagraphElementInterface {
    type: ParagraphElementType;
    textAlign?: TextAlignElementType;
    children: TextType[];
}

const serializeElement = (node: ElementType, children: string): undefined | string => {
    if (node.type !== "paragraph") {
        return;
    }

    const style = getTextAlignStyle(node);
    return "<p" + getStyleAttr(style) + ">" + children + "</p>";
};

const deserializeElement = (element: Node, children: DeserializeType[]): DeserializeElementType => {
    if (element.nodeName !== "P") {
        return;
    }

    const attributes: Omit<ParagraphElementInterface, "children"> = {
        type: "paragraph",
    };

    const pElement = element as HTMLParagraphElement;
    const style = pElement.style;

    switch (style.textAlign) {
        case "left":
            attributes["textAlign"] = "text-align-left";
            break;
        case "center":
            attributes["textAlign"] = "text-align-center";
            break;
        case "right":
            attributes["textAlign"] = "text-align-right";
            break;
        case "justify":
            attributes["textAlign"] = "text-align-justify";
            break;
    }

    return jsx("element", attributes, children);
};

const renderElement = ({ attributes, children, element }: RenderElementProps): undefined | JSX.Element => {
    switch (element.type) {
        case "paragraph":
            return (
                <p {...attributes} style={getTextAlignStyle(element)}>
                    {children}
                </p>
            );
    }
};

const plugin: SlatePluginInterface = {
    renderElement,
    serializeElement,
    deserializeElement,
};

export default plugin;
export { ParagraphElementType, ParagraphElementInterface, renderElement, serializeElement, deserializeElement };
