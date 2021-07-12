import { Descendant } from "slate";
import Slate, { SlateProps } from "@arteneo/material-ui-slate/components/Slate";
import ElementButton, { ElementButtonProps } from "@arteneo/material-ui-slate/components/ElementButton";
import MarkButton, { MarkButtonProps } from "@arteneo/material-ui-slate/components/MarkButton";
import RenderElement, { RenderElementProps } from "@arteneo/material-ui-slate/components/RenderElement";
import RenderLeaf, { RenderLeafProps } from "@arteneo/material-ui-slate/components/RenderLeaf";
import Toolbar, { ToolbarProps } from "@arteneo/material-ui-slate/components/Toolbar";
import DeserializeElementPropsInterface from "@arteneo/material-ui-slate/definitions/DeserializeElementPropsInterface";
import DeserializeElementType from "@arteneo/material-ui-slate/definitions/DeserializeElementType";
import DeserializeType from "@arteneo/material-ui-slate/definitions/DeserializeType";
import EditorType from "@arteneo/material-ui-slate/definitions/EditorType";
import ElementType from "@arteneo/material-ui-slate/definitions/ElementType";
import ElementTypeType from "@arteneo/material-ui-slate/definitions/ElementTypeType";
import FormattedTextInterface from "@arteneo/material-ui-slate/definitions/FormattedTextInterface";
import SerializeInlineResultAttributesInterface from "@arteneo/material-ui-slate/definitions/SerializeInlineResultAttributesInterface";
import SerializeInlineResultInteface from "@arteneo/material-ui-slate/definitions/SerializeInlineResultInteface";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";
import SlatePluginsType from "@arteneo/material-ui-slate/definitions/SlatePluginsType";
import TextType from "@arteneo/material-ui-slate/definitions/TextType";
import {
    isElementActive,
    isMarkActive,
    toggleMark,
    isList,
    toggleElement,
    deserialize,
    deserializeElements,
    deserializeInlines,
    serialize,
    serializeNode,
    serializeInlines,
    serializeElements,
} from "@arteneo/material-ui-slate/utils/slate";
import Body from "@arteneo/material-ui-slate/plugins/Body";
import Br from "@arteneo/material-ui-slate/plugins/Br";
import Bold from "@arteneo/material-ui-slate/plugins/Bold";
import Italic from "@arteneo/material-ui-slate/plugins/Italic";
import Strikethrough from "@arteneo/material-ui-slate/plugins/Strikethrough";
import Underline from "@arteneo/material-ui-slate/plugins/Underline";
import Color from "@arteneo/material-ui-slate/plugins/Color";
import Link from "@arteneo/material-ui-slate/plugins/Link";
import Nbsp from "@arteneo/material-ui-slate/plugins/Nbsp";
import Heading from "@arteneo/material-ui-slate/plugins/Heading";
import Paragraph from "@arteneo/material-ui-slate/plugins/Paragraph";
import OrderedList from "@arteneo/material-ui-slate/plugins/OrderedList";
import UnorderedList from "@arteneo/material-ui-slate/plugins/UnorderedList";
import Clear from "@arteneo/material-ui-slate/plugins/Clear";
import Undo from "@arteneo/material-ui-slate/plugins/Undo";
import Redo from "@arteneo/material-ui-slate/plugins/Redo";

export {
    Descendant,
    Slate,
    SlateProps,
    ElementButton,
    ElementButtonProps,
    MarkButton,
    MarkButtonProps,
    RenderElement,
    RenderElementProps,
    RenderLeaf,
    RenderLeafProps,
    Toolbar,
    ToolbarProps,
    DeserializeElementPropsInterface,
    DeserializeElementType,
    DeserializeType,
    EditorType,
    ElementType,
    ElementTypeType,
    FormattedTextInterface,
    SerializeInlineResultAttributesInterface,
    SerializeInlineResultInteface,
    SlatePluginInterface,
    SlatePluginsType,
    TextType,
    isElementActive,
    isMarkActive,
    toggleMark,
    isList,
    toggleElement,
    deserialize,
    deserializeElements,
    deserializeInlines,
    serialize,
    serializeNode,
    serializeInlines,
    serializeElements,
    Body,
    Br,
    Bold,
    Italic,
    Strikethrough,
    Underline,
    Color,
    Link,
    Nbsp,
    Heading,
    Paragraph,
    OrderedList,
    UnorderedList,
    Clear,
    Undo,
    Redo,
};
