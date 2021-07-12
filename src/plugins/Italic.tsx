import React from "react";
import { FormatItalic } from "@material-ui/icons";
import MarkButton, { MarkButtonProps } from "@arteneo/material-ui-slate/components/MarkButton";
import SerializeInlineResultInteface from "@arteneo/material-ui-slate/definitions/SerializeInlineResultInteface";
import DeserializeElementPropsInterface from "@arteneo/material-ui-slate/definitions/DeserializeElementPropsInterface";
import { Optional } from "@arteneo/material-ui-slate/utils/TypescriptOperators";
import { RenderLeafProps } from "slate-react";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";
import FormattedTextInterface from "@arteneo/material-ui-slate/definitions/FormattedTextInterface";
import TextType from "@arteneo/material-ui-slate/definitions/TextType";

interface ItalicInterface extends FormattedTextInterface {
    italic?: boolean;
}

const serializeInline = (node: TextType, result: SerializeInlineResultInteface): SerializeInlineResultInteface => {
    const italicNode = node as ItalicInterface;

    if (italicNode.italic) {
        result.attributes["data-italic"] = true;
        result.text = "<em>" + result.text + "</em>";
    }

    return result;
};

const deserializeInline = (
    element: HTMLElement,
    elementProps: DeserializeElementPropsInterface
): DeserializeElementPropsInterface => {
    if (element.nodeName === "EM" || element.hasAttribute("data-italic")) {
        elementProps["italic"] = true;
    }

    return elementProps;
};

const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    const italicLeaf = leaf as ItalicInterface;

    if (italicLeaf.italic) {
        return <em {...attributes}>{children}</em>;
    }

    return children;
};

type ItalicButtonProps = Optional<MarkButtonProps, "format">;

const ItalicButton = ({ ...markButtonProps }: ItalicButtonProps) => {
    return (
        <MarkButton
            {...{
                format: "italic",
                children: <FormatItalic />,
                ...markButtonProps,
            }}
        />
    );
};

const plugin: SlatePluginInterface = {
    toolbarComponent: <ItalicButton />,
    renderLeaf,
    serializeInline,
    deserializeInline,
};

export default plugin;
export { ItalicInterface, renderLeaf, serializeInline, deserializeInline, ItalicButton, ItalicButtonProps };
