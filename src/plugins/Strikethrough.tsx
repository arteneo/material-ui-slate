import React from "react";
import { FormatStrikethrough } from "@material-ui/icons";
import MarkButton, { MarkButtonProps } from "@arteneo/material-ui-slate/components/MarkButton";
import SerializeInlineResultInteface from "@arteneo/material-ui-slate/definitions/SerializeInlineResultInteface";
import DeserializeElementPropsInterface from "@arteneo/material-ui-slate/definitions/DeserializeElementPropsInterface";
import { Optional } from "@arteneo/material-ui-slate/utils/TypescriptOperators";
import { RenderLeafProps } from "slate-react";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";
import FormattedTextInterface from "@arteneo/material-ui-slate/definitions/FormattedTextInterface";
import TextType from "@arteneo/material-ui-slate/definitions/TextType";

interface StrikethroughInterface extends FormattedTextInterface {
    strikethrough?: boolean;
}

const serializeInline = (node: TextType, result: SerializeInlineResultInteface): SerializeInlineResultInteface => {
    const strikethroughNode = node as StrikethroughInterface;

    if (strikethroughNode.strikethrough) {
        result.attributes["data-strikethrough"] = true;
        result.text = "<s>" + result.text + "</s>";
    }

    return result;
};

const deserializeInline = (
    element: HTMLElement,
    elementProps: DeserializeElementPropsInterface
): DeserializeElementPropsInterface => {
    if (element.nodeName === "S" || element.hasAttribute("data-strikethrough")) {
        elementProps["strikethrough"] = true;
    }

    return elementProps;
};

const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    const strikethroughLeaf = leaf as StrikethroughInterface;

    if (strikethroughLeaf.strikethrough) {
        return <s {...attributes}>{children}</s>;
    }

    return children;
};

type StrikethroughButtonProps = Optional<MarkButtonProps, "format">;

const StrikethroughButton = ({ ...markButtonProps }: StrikethroughButtonProps) => {
    return (
        <MarkButton
            {...{
                format: "strikethrough",
                children: <FormatStrikethrough />,
                ...markButtonProps,
            }}
        />
    );
};

const plugin: SlatePluginInterface = {
    toolbarComponent: <StrikethroughButton />,
    renderLeaf,
    serializeInline,
    deserializeInline,
};

export default plugin;
export {
    StrikethroughInterface,
    renderLeaf,
    serializeInline,
    deserializeInline,
    StrikethroughButton,
    StrikethroughButtonProps,
};
