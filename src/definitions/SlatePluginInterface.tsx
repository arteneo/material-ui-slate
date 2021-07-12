import { Editor } from "slate";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import SerializeInlineResultInteface from "@arteneo/material-ui-slate/definitions/SerializeInlineResultInteface";
import DeserializeElementPropsInterface from "@arteneo/material-ui-slate/definitions/DeserializeElementPropsInterface";
import DeserializeElementType from "@arteneo/material-ui-slate/definitions/DeserializeElementType";
import DeserializeType from "@arteneo/material-ui-slate/definitions/DeserializeType";
import ElementType from "@arteneo/material-ui-slate/definitions/ElementType";
import TextType from "@arteneo/material-ui-slate/definitions/TextType";

interface SlatePluginInterface {
    toolbarComponent?: React.ReactElement;
    renderLeaf?: (props: RenderLeafProps) => React.ReactNode;
    renderElement?: (props: RenderElementProps) => undefined | JSX.Element;
    serializeInline?: (node: TextType, result: SerializeInlineResultInteface) => SerializeInlineResultInteface;
    deserializeInline?: (
        element: HTMLElement,
        elementProps: DeserializeElementPropsInterface
    ) => DeserializeElementPropsInterface;
    serializeElement?: (node: ElementType, children: string) => undefined | string;
    deserializeElement?: (element: Node, children: DeserializeType[]) => DeserializeElementType;
    withEditor?: (editor: Editor) => Editor;
}

export default SlatePluginInterface;
