import React from "react";
import { RenderElementProps as SlateRenderElementProps } from "slate-react";
import SlatePluginsType from "@arteneo/material-ui-slate/definitions/SlatePluginsType";

interface RenderElementProps extends SlateRenderElementProps {
    plugins: SlatePluginsType;
}

const RenderElement = ({ plugins, attributes, children, element }: RenderElementProps): JSX.Element => {
    const result = plugins.reduce((result: undefined | JSX.Element, plugin) => {
        if (typeof result === "undefined" && typeof plugin.renderElement !== "undefined") {
            return plugin.renderElement({ attributes, children, element });
        }

        return result;
    }, undefined);

    if (typeof result === "undefined") {
        return <p {...attributes}>{children}</p>;
    }

    return result;
};

export default RenderElement;
export { RenderElementProps };
