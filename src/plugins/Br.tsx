import DeserializeElementType from "@arteneo/material-ui-slate/definitions/DeserializeElementType";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";

const deserializeElement = (element: Node): DeserializeElementType => {
    switch (element.nodeName) {
        case "BR":
            return "\n";
    }
};

const plugin: SlatePluginInterface = {
    deserializeElement,
};

export default plugin;
export { deserializeElement };
