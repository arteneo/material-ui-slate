import React from "react";
import { FormatListNumbered } from "@material-ui/icons";
import { RenderElementProps } from "slate-react";
import { jsx } from "slate-hyperscript";
import ElementButton, { ElementButtonProps } from "@arteneo/material-ui-slate/components/ElementButton";
import { Optional } from "@arteneo/material-ui-slate/utils/TypescriptOperators";
import TextType from "@arteneo/material-ui-slate/definitions/TextType";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";
import ElementType from "@arteneo/material-ui-slate/definitions/ElementType";
import DeserializeElementType from "@arteneo/material-ui-slate/definitions/DeserializeElementType";
import DeserializeType from "@arteneo/material-ui-slate/definitions/DeserializeType";

type OrderedListElementType = "ordered-list" | "ordered-list-item";

interface OrderedListElementInterface {
    type: OrderedListElementType;
    children: TextType[];
}

const serializeElement = (node: ElementType, children: string): undefined | string => {
    switch (node.type) {
        case "ordered-list":
            return "<ol>" + children + "</ol>";
        case "ordered-list-item":
            return "<li>" + children + "</li>";
    }
};

const deserializeElement = (element: Node, children: DeserializeType[]): DeserializeElementType => {
    if (element.nodeName === "OL") {
        return jsx("element", { type: "ordered-list" }, children);
    }

    if (element.nodeName === "LI" && element.parentElement?.nodeName === "OL") {
        return jsx("element", { type: "ordered-list-item" }, children);
    }
};

const renderElement = ({ attributes, children, element }: RenderElementProps): undefined | JSX.Element => {
    switch (element.type) {
        case "ordered-list":
            return <ol {...attributes}>{children}</ol>;
        case "ordered-list-item":
            return <li {...attributes}>{children}</li>;
    }
};

type OrderedListButtonProps = Optional<ElementButtonProps, "format">;

const OrderedListButton = ({ ...elementButtonProps }: OrderedListButtonProps) => {
    return (
        <ElementButton
            {...{
                format: "ordered-list",
                formatListItem: "ordered-list-item",
                children: <FormatListNumbered />,
                ...elementButtonProps,
            }}
        />
    );
};

const plugin: SlatePluginInterface = {
    toolbarComponent: <OrderedListButton />,
    renderElement,
    serializeElement,
    deserializeElement,
};

export default plugin;
export {
    OrderedListElementType,
    OrderedListElementInterface,
    renderElement,
    serializeElement,
    deserializeElement,
    OrderedListButton,
    OrderedListButtonProps,
};
