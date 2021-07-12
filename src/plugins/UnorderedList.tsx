import React from "react";
import { FormatListBulleted } from "@material-ui/icons";
import { RenderElementProps } from "slate-react";
import { jsx } from "slate-hyperscript";
import ElementButton, { ElementButtonProps } from "@arteneo/material-ui-slate/components/ElementButton";
import { Optional } from "@arteneo/material-ui-slate/utils/TypescriptOperators";
import TextType from "@arteneo/material-ui-slate/definitions/TextType";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";
import DeserializeElementType from "@arteneo/material-ui-slate/definitions/DeserializeElementType";
import DeserializeType from "@arteneo/material-ui-slate/definitions/DeserializeType";
import ElementType from "@arteneo/material-ui-slate/definitions/ElementType";

type UnorderedListElementType = "unordered-list" | "unordered-list-item";

interface UnorderedListElementInterface {
    type: UnorderedListElementType;
    children: TextType[];
}

const serializeElement = (node: ElementType, children: string): undefined | string => {
    switch (node.type) {
        case "unordered-list":
            return "<ul>" + children + "</ul>";
        case "unordered-list-item":
            return "<li>" + children + "</li>";
    }
};

const deserializeElement = (element: Node, children: DeserializeType[]): DeserializeElementType => {
    if (element.nodeName === "UL") {
        return jsx("element", { type: "unordered-list" }, children);
    }

    if (element.nodeName === "LI" && element.parentElement?.nodeName === "UL") {
        return jsx("element", { type: "unordered-list-item" }, children);
    }
};

const renderElement = ({ attributes, children, element }: RenderElementProps): undefined | JSX.Element => {
    switch (element.type) {
        case "unordered-list":
            return <ul {...attributes}>{children}</ul>;
        case "unordered-list-item":
            return <li {...attributes}>{children}</li>;
    }
};

type UnorderedListButtonProps = Optional<ElementButtonProps, "format">;

const UnorderedListButton = ({ ...elementButtonProps }: UnorderedListButtonProps) => {
    return (
        <ElementButton
            {...{
                format: "unordered-list",
                formatListItem: "unordered-list-item",
                children: <FormatListBulleted />,
                ...elementButtonProps,
            }}
        />
    );
};

const plugin: SlatePluginInterface = {
    toolbarComponent: <UnorderedListButton />,
    renderElement,
    serializeElement,
    deserializeElement,
};

export default plugin;
export {
    UnorderedListElementType,
    UnorderedListElementInterface,
    renderElement,
    serializeElement,
    deserializeElement,
    UnorderedListButton,
    UnorderedListButtonProps,
};
