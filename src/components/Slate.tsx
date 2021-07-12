import React from "react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Slate as SlateReact, Editable, withReact } from "slate-react";
import TextType from "@arteneo/material-ui-slate/definitions/TextType";
import EditorType from "@arteneo/material-ui-slate/definitions/EditorType";
import ElementType from "@arteneo/material-ui-slate/definitions/ElementType";
import Toolbar from "@arteneo/material-ui-slate/components/Toolbar";
import SlatePluginsType from "@arteneo/material-ui-slate/definitions/SlatePluginsType";
import { deserialize } from "@arteneo/material-ui-slate/utils/slate";
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
    plugins: SlatePluginsType;
    onChange?: (value: Descendant[]) => void;
    initialHtml?: string;
    disabled?: boolean;
}

const Slate = ({ plugins, onChange, initialHtml, disabled = false }: SlateProps) => {
    const emptyValue = [jsx("element", { type: "paragraph" }, [{ text: "" }])];

    const getInitialValue = (): Descendant[] => {
        if (typeof initialHtml !== "undefined") {
            const document = new DOMParser().parseFromString(initialHtml, "text/html");

            const deserializeValue = deserialize(document.body, plugins);
            if (typeof deserializeValue !== "undefined") {
                return deserializeValue as Descendant[];
            }
        }

        return emptyValue;
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

    const [value, setValue] = React.useState<Descendant[]>(emptyValue);

    React.useEffect(() => updateInitialValue(), [initialHtml]);

    const updateInitialValue = () => {
        setValue(getInitialValue());
    };

    const renderElement = React.useCallback((props) => <RenderElement {...{ plugins, ...props }} />, []);
    const renderLeaf = React.useCallback((props) => <RenderLeaf {...{ plugins, ...props }} />, []);

    const internalOnChange = (value: Descendant[]) => {
        setValue(value);

        if (typeof onChange !== "undefined") {
            onChange(value);
        }
    };

    return (
        <SlateReact
            {...{
                editor,
                value,
                onChange: internalOnChange,
            }}
        >
            <Toolbar {...{ plugins, disabled }} />
            <Editable
                {...{
                    renderElement,
                    renderLeaf,
                    readOnly: disabled,
                }}
            />
        </SlateReact>
    );
};

export default Slate;
export { SlateProps };
