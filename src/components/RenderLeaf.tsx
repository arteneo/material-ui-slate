import React from "react";
import { RenderLeafProps as SlateRenderLeafProps } from "slate-react";
import SlatePluginsType from "@arteneo/material-ui-slate/definitions/SlatePluginsType";

interface RenderLeafProps extends SlateRenderLeafProps {
    plugins: SlatePluginsType;
}

const RenderLeaf = ({ plugins, attributes, children, leaf, text }: RenderLeafProps): JSX.Element => {
    children = plugins.reduce((children, plugin) => {
        if (typeof plugin.renderLeaf !== "undefined") {
            return plugin.renderLeaf({ attributes, children, leaf, text });
        }

        return children;
    }, children);

    return <span {...attributes}>{children}</span>;
};

export default RenderLeaf;
export { RenderLeafProps };
