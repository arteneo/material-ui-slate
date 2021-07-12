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
