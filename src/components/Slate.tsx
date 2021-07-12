import React from "react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Slate as SlateReact, Editable, withReact } from "slate-react";
import TextType from "@arteneo/material-ui-slate/definitions/TextType";
import EditorType from "@arteneo/material-ui-slate/definitions/EditorType";
import ElementType from "@arteneo/material-ui-slate/definitions/ElementType";
import Toolbar from "@arteneo/material-ui-slate/components/Toolbar";
import SlatePluginsType from "@arteneo/material-ui-slate/definitions/SlatePluginsType";
import { serialize, deserialize } from "@arteneo/material-ui-slate/utils/slate";
import RenderElement from "@arteneo/material-ui-slate/components/RenderElement";
import RenderLeaf from "@arteneo/material-ui-slate/components/RenderLeaf";
import { jsx } from "slate-hyperscript";

declare module "slate" {
    interface CustomTypes {
        Editor: EditorType;
        Element: ElementType;
        Text: TextType;
    }
}

// const Leaf = ({ attributes, children, leaf, text }: RenderLeafProps) => {
//     children = boldLeaf({ attributes, children, leaf, text });
//     children = italicLeaf({ attributes, children, leaf, text });
//     children = underlineLeaf({ attributes, children, leaf, text });
//     children = strikethroughLeaf({ attributes, children, leaf, text });
//     children = colorLeaf({ attributes, children, leaf, text });

//     return <span {...attributes}>{children}</span>;
// };

// const Element = ({ attributes, children, element }: RenderElementProps) => {
//     let result = headingElement({ attributes, children, element });
//     if (typeof result !== "undefined") {
//         return result;
//     }

//     result = unorderedListElement({ attributes, children, element });
//     if (typeof result !== "undefined") {
//         return result;
//     }

//     result = orderedListElement({ attributes, children, element });
//     if (typeof result !== "undefined") {
//         return result;
//     }

//     switch (element.type) {
//         case "block-quote":
//             return <blockquote {...attributes}>{children}</blockquote>;
//         case "list-item":
//             return <li {...attributes}>{children}</li>;
//         case "numbered-list":
//             return <ol {...attributes}>{children}</ol>;
//         default:
//             return <p {...attributes}>{children}</p>;
//     }
// };

// const serialize = (node: CustomElement): React.ReactNode => {
//     console.log("🚀 ~ file: Slate.tsx ~ line 110 ~ node", node);

//     if (Text.isText(node)) {
//         const serializeInlineResult: SerializeInlineResult = {
//             text: escapeHtml(node.text),
//             attributes: {},
//             styles: {},
//         };

//         boldSerializeInline(node, serializeInlineResult);
//         italicSerializeInline(node, serializeInlineResult);
//         underlineSerializeInline(node, serializeInlineResult);
//         strikethroughSerializeInline(node, serializeInlineResult);
//         colorSerializeInline(node, serializeInlineResult);

//         let style = "";
//         const hasStyles = Object.keys(serializeInlineResult.styles).length > 0;
//         if (hasStyles) {
//             const styleList = Object.entries(serializeInlineResult.styles).map(([style, value]) => {
//                 return style + ": " + value + ";";
//             });
//             style = " style='" + styleList.join(" ") + "'";
//         }

//         let attribute = "";
//         const hasAttributes = Object.keys(serializeInlineResult.attributes).length > 0;
//         if (hasAttributes) {
//             const attributeList = Object.entries(serializeInlineResult.attributes).map(([attribute, value]) => {
//                 if (value === false) {
//                     return "";
//                 }

//                 if (value === true) {
//                     return attribute;
//                 }

//                 return attribute + "=" + value;
//             });
//             attribute = " " + attributeList.join(" ");
//         }

//         let component = undefined;

//         if ((hasStyles || hasAttributes) && typeof component === "undefined") {
//             component = "span";
//         }

//         if (component) {
//             return "<" + component + style + attribute + ">" + serializeInlineResult.text + "</" + component + ">";
//         }

//         return serializeInlineResult.text;
//     }

//     const children = node.children.map((nodeChild) => serialize(nodeChild)).join("");

//     let result = headingSerializeElement(node, children);
//     if (typeof result !== "undefined") {
//         return result;
//     }

//     result = unorderedListSerializeElement(node, children);
//     if (typeof result !== "undefined") {
//         return result;
//     }

//     result = orderedListSerializeElement(node, children);
//     if (typeof result !== "undefined") {
//         return result;
//     }

//     switch (node.type) {
//         // case "quote":
//         //     return `<blockquote><p>${children}</p></blockquote>`;
//         case "paragraph":
//             return `<p>${children}</p>`;
//         case "list-item":
//             return `<li>${children}</li>`;
//         case "numbered-list":
//             return `<ol>${children}</ol>`;
//         // case "link":
//         //     return `<a href="${escapeHtml(node.url)}">${children}</a>`;
//     }

//     return children;
// };

// const deserialize = (element: HTMLElement) => {
//     if (element.nodeType === 3) {
//         return element.textContent;
//     }

//     if (element.nodeType !== 1) {
//         return null;
//     }

//     let children = Array.from(element.childNodes).map(deserialize);

//     if (children.length === 0) {
//         children = [{ text: "" }];
//     }

//     const nodeName = element.nodeName;
//     if (nodeName === "BODY") {
//         return jsx("fragment", {}, children);
//     }

//     if (nodeName === "BR") {
//         return "\n";
//     }

//     if (nodeName === "P") {
//         return jsx("element", { type: "paragraph" }, children);
//     }

//     let result = headingDeserializeElement(element, children);
//     if (typeof result !== "undefined") {
//         return result;
//     }

//     result = unorderedListDeserializeElement(element, children);
//     if (typeof result !== "undefined") {
//         return result;
//     }

//     result = orderedListDeserializeElement(element, children);
//     if (typeof result !== "undefined") {
//         return result;
//     }

//     if (nodeName === "LI") {
//         return jsx("element", { type: "list-item" }, children);
//     }

//     if (nodeName === "OL") {
//         return jsx("element", { type: "numbered-list" }, children);
//     }

//     const elementProps: DeserializeElementPropsInterface = {};
//     boldDeserializeInline(element, elementProps);
//     italicDeserializeInline(element, elementProps);
//     underlineDeserializeInline(element, elementProps);
//     strikethroughDeserializeInline(element, elementProps);
//     colorDeserializeInline(element, elementProps);

//     return { text: element.textContent, ...elementProps };
// };

interface SlateProps {
    initialHtml?: string;
    plugins: SlatePluginsType;
}

const Slate = ({ initialHtml, plugins }: SlateProps) => {
    const getInitialValue = (): Descendant[] => {
        if (typeof initialHtml !== "undefined") {
            const document = new DOMParser().parseFromString(initialHtml, "text/html");

            const deserializeValue = deserialize(document.body, plugins);
            if (typeof deserializeValue !== "undefined") {
                return deserializeValue as Descendant[];
            }
        }

        return [jsx("element", { type: "paragraph" }, [{ text: "" }])];
    };

    const editor = React.useMemo(() => {
        let editor = withHistory(withReact(createEditor()));

        plugins.forEach((plugin) => {
            if (typeof plugin.withEditor !== "undefined") {
                editor = plugin.withEditor(editor);
            }
        });

        return editor;
    }, []);

    const [value, setValue] = React.useState<Descendant[]>(getInitialValue());
    console.log("🚀 ~ file: Slate.tsx ~ line 231 ~ Slate ~ value", value);

    const renderElement = React.useCallback((props) => <RenderElement {...{ plugins, ...props }} />, []);
    const renderLeaf = React.useCallback((props) => <RenderLeaf {...{ plugins, ...props }} />, []);

    const onChange = (change: Descendant[]) => {
        setValue(change);
    };

    const serializedHtml = serialize(value, plugins);

    return (
        <>
            <h1>Test</h1>

            <SlateReact
                {...{
                    editor,
                    value,
                    onChange,
                }}
            >
                <Toolbar {...{ plugins }} />
                <Editable
                    {...{
                        renderElement,
                        renderLeaf,
                    }}
                />
            </SlateReact>

            {typeof initialHtml !== "undefined" && (
                <>
                    <br />
                    <br />
                    <h1>Initial HTML looks</h1>
                    <div dangerouslySetInnerHTML={{ __html: initialHtml }} />
                    <br />
                    <br />
                    <h1>Initial HTML code</h1>
                    <code>{initialHtml}</code>{" "}
                </>
            )}

            {typeof serializedHtml !== "undefined" && (
                <>
                    <br />
                    <br />
                    <h1>Serialized HTML looks</h1>
                    <div dangerouslySetInnerHTML={{ __html: serializedHtml }} />
                    <br />
                    <br />
                    <h1>Serialized HTML code</h1>
                    <code>{serializedHtml}</code>
                </>
            )}
        </>
    );
};

export default Slate;
export { SlateProps };
