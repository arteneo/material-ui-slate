import { Editor, Transforms, Element as SlateElement, Text, Descendant } from "slate";
import escapeHtml from "escape-html";
import DeserializeElementPropsInterface from "@arteneo/material-ui-slate/definitions/DeserializeElementPropsInterface";
import SerializeInlineResultInteface from "@arteneo/material-ui-slate/definitions/SerializeInlineResultInteface";
import SlatePluginsType from "@arteneo/material-ui-slate/definitions/SlatePluginsType";
import ElementTypeType from "@arteneo/material-ui-slate/definitions/ElementTypeType";
import ElementType from "@arteneo/material-ui-slate/definitions/ElementType";
import DeserializeElementType from "@arteneo/material-ui-slate/definitions/DeserializeElementType";
import DeserializeType from "@arteneo/material-ui-slate/definitions/DeserializeType";
import TextType from "@arteneo/material-ui-slate/definitions/TextType";

export const isElementActive = (editor: Editor, format: ElementTypeType) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });

    return !!match;
};

export const isMarkActive = (editor: Editor, format: string) => {
    const marks: null | Record<string, boolean | string> = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

export const toggleMark = (editor: Editor, format: string, value: boolean | string = true) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, value);
    }
};

// Hard coded - Need idea how to make it flexible
export const isList = (format: ElementTypeType): boolean => {
    if (format === "ordered-list") {
        return true;
    }

    if (format === "unordered-list") {
        return true;
    }

    return false;
};

export const toggleElement = (editor: Editor, format: ElementTypeType, formatListItem?: ElementTypeType) => {
    const isActive = isElementActive(editor, format);

    Transforms.unwrapNodes(editor, {
        match: (n) => {
            if (Editor.isEditor(n)) {
                return false;
            }

            if (!SlateElement.isElement(n)) {
                return false;
            }

            return isList(n.type);
        },
        split: true,
    });

    const newProperties: Partial<SlateElement> = {
        type: isActive ? "paragraph" : isList(format) ? formatListItem : format,
    };
    Transforms.setNodes(editor, newProperties);

    // Hard coded - Need idea how to make it flexible
    // This has to be checked in a way Typescript will be sure that those are lists
    if (!isActive && (format === "ordered-list" || format === "unordered-list")) {
        const element = { type: format, children: [] };
        Transforms.wrapNodes(editor, element);
    }
};

export const deserialize = (element: HTMLElement, plugins: SlatePluginsType): DeserializeType => {
    if (element.nodeType === 3) {
        return { text: element.textContent ?? "" };
    }

    if (element.nodeType !== 1) {
        // Brutal - need smarter solution here
        return undefined as unknown as DeserializeType;
    }

    let children = Array.from(element.childNodes).map((childElement) =>
        deserialize(childElement as HTMLElement, plugins)
    );

    if (children.length === 0) {
        children = [{ text: "" }];
    }

    const result = deserializeElements(element, children, plugins);
    if (typeof result !== "undefined") {
        return result;
    }

    const elementProps = deserializeInlines(element, {}, plugins);
    return { text: element.textContent ?? "", ...elementProps };
};

export const deserializeElements = (
    element: Node,
    children: DeserializeType[],
    plugins: SlatePluginsType
): DeserializeElementType => {
    return plugins.reduce((result: DeserializeElementType, plugin) => {
        if (typeof result === "undefined" && typeof plugin.deserializeElement !== "undefined") {
            return plugin.deserializeElement(element, children);
        }

        return result;
    }, undefined);
};

export const deserializeInlines = (
    element: HTMLElement,
    elementProps: DeserializeElementPropsInterface,
    plugins: SlatePluginsType
): DeserializeElementPropsInterface => {
    return plugins.reduce((elementProps, plugin) => {
        if (typeof plugin.deserializeInline !== "undefined") {
            return plugin.deserializeInline(element, elementProps);
        }

        return elementProps;
    }, elementProps);
};

export const serialize = (nodes: Descendant[], plugins: SlatePluginsType): undefined | string => {
    return nodes.map((node) => serializeNode(node, plugins)).join("");
};

export const serializeNode = (node: Descendant, plugins: SlatePluginsType): undefined | string => {
    if (Text.isText(node)) {
        let result: SerializeInlineResultInteface = {
            text: escapeHtml(node.text),
            attributes: {},
            styles: {},
        };

        result = serializeInlines(node, result, plugins);

        let style = "";
        const hasStyles = Object.keys(result.styles).length > 0;
        if (hasStyles) {
            const styleList = Object.entries(result.styles).map(([style, value]) => {
                return style + ": " + value + ";";
            });
            style = " style='" + styleList.join(" ") + "'";
        }

        let attribute = "";
        const hasAttributes = Object.keys(result.attributes).length > 0;
        if (hasAttributes) {
            const attributeList = Object.entries(result.attributes).map(([attribute, value]) => {
                if (value === false) {
                    return "";
                }

                if (value === true) {
                    return attribute;
                }

                return attribute + "=" + value;
            });
            attribute = " " + attributeList.join(" ");
        }

        let component = undefined;

        if ((hasStyles || hasAttributes) && typeof component === "undefined") {
            component = "span";
        }

        if (component) {
            return "<" + component + style + attribute + ">" + result.text + "</" + component + ">";
        }

        return result.text;
    }

    const children = node.children.map((nodeChild) => serializeNode(nodeChild, plugins)).join("");
    return serializeElements(node, children, plugins);
};

export const serializeInlines = (
    element: TextType,
    result: SerializeInlineResultInteface,
    plugins: SlatePluginsType
): SerializeInlineResultInteface => {
    return plugins.reduce((result, plugin) => {
        if (typeof plugin.serializeInline !== "undefined") {
            return plugin.serializeInline(element, result);
        }

        return result;
    }, result);
};

export const serializeElements = (node: ElementType, children: string, plugins: SlatePluginsType): string => {
    const result = plugins.reduce((result: undefined | string, plugin) => {
        if (typeof result === "undefined" && typeof plugin.serializeElement !== "undefined") {
            return plugin.serializeElement(node, children);
        }

        return result;
    }, undefined);

    if (typeof result === "undefined") {
        return children;
    }

    return result;
};
