import React from "react";
import {
    IconButton,
    IconButtonProps,
    Box,
    Popover,
    makeStyles,
    ClickAwayListener,
    Button,
    Omit,
} from "@material-ui/core";
import { Title } from "@material-ui/icons";
import { RenderElementProps, useSlate } from "slate-react";
import { getStyleAttr, toggleElement } from "@arteneo/material-ui-slate/utils/slate";
import { useTranslation } from "react-i18next";
import { jsx } from "slate-hyperscript";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";
import TextType from "@arteneo/material-ui-slate/definitions/TextType";
import ElementType from "@arteneo/material-ui-slate/definitions/ElementType";
import DeserializeElementType from "@arteneo/material-ui-slate/definitions/DeserializeElementType";
import DeserializeType from "@arteneo/material-ui-slate/definitions/DeserializeType";
import { getTextAlignStyle, TextAlignElementType } from "@arteneo/material-ui-slate/plugins/TextAlign";
import ElementTypeType from "@arteneo/material-ui-slate/definitions/ElementTypeType";

type HeadingElementType =
    | "heading-one"
    | "heading-two"
    | "heading-three"
    | "heading-four"
    | "heading-five"
    | "heading-six";

interface HeadingElementInterface {
    type: HeadingElementType;
    textAlign?: TextAlignElementType;
    children: TextType[];
}

const serializeElement = (node: ElementType, children: string): undefined | string => {
    let component: undefined | string = undefined;

    switch (node.type) {
        case "heading-one":
            component = "h1";
            break;
        case "heading-two":
            component = "h2";
            break;
        case "heading-three":
            component = "h3";
            break;
        case "heading-four":
            component = "h4";
            break;
        case "heading-five":
            component = "h5";
            break;
        case "heading-six":
            component = "h6";
            break;
    }

    if (typeof component === "undefined") {
        return;
    }

    const style = getTextAlignStyle(node);

    return "<" + component + getStyleAttr(style) + ">" + children + "</" + component + ">";
};

const deserializeElement = (element: Node, children: DeserializeType[]): DeserializeElementType => {
    let type: undefined | ElementTypeType = undefined;

    switch (element.nodeName) {
        case "H1":
            type = "heading-one";
            break;
        case "H2":
            type = "heading-two";
            break;
        case "H3":
            type = "heading-three";
            break;
        case "H4":
            type = "heading-four";
            break;
        case "H5":
            type = "heading-five";
            break;
        case "H6":
            type = "heading-six";
            break;
    }

    if (typeof type === "undefined") {
        return;
    }

    const attributes: Omit<HeadingElementInterface, "children"> = {
        type,
    };

    const hElement = element as HTMLHeadingElement;
    const style = hElement.style;

    switch (style.textAlign) {
        case "left":
            attributes["textAlign"] = "text-align-left";
            break;
        case "center":
            attributes["textAlign"] = "text-align-center";
            break;
        case "right":
            attributes["textAlign"] = "text-align-right";
            break;
        case "justify":
            attributes["textAlign"] = "text-align-justify";
            break;
    }

    return jsx("element", attributes, children);
};

const renderElement = ({ attributes, children, element }: RenderElementProps): undefined | JSX.Element => {
    switch (element.type) {
        case "heading-one":
            return (
                <h1 {...attributes} style={getTextAlignStyle(element)}>
                    {children}
                </h1>
            );
        case "heading-two":
            return (
                <h2 {...attributes} style={getTextAlignStyle(element)}>
                    {children}
                </h2>
            );
        case "heading-three":
            return (
                <h3 {...attributes} style={getTextAlignStyle(element)}>
                    {children}
                </h3>
            );
        case "heading-four":
            return (
                <h4 {...attributes} style={getTextAlignStyle(element)}>
                    {children}
                </h4>
            );
        case "heading-five":
            return (
                <h5 {...attributes} style={getTextAlignStyle(element)}>
                    {children}
                </h5>
            );
        case "heading-six":
            return (
                <h6 {...attributes} style={getTextAlignStyle(element)}>
                    {children}
                </h6>
            );
    }
};

interface HeadingTypes {
    types?: HeadingElementType[];
}

type HeadingButtonProps = HeadingTypes & IconButtonProps;

const useStyles = makeStyles(() => ({
    content: {
        maxWidth: 250,
    },
    "heading-one": {
        fontSize: 22,
    },
    "heading-two": {
        fontSize: 20,
    },
    "heading-three": {
        fontSize: 18,
    },
    "heading-four": {
        fontSize: 16,
    },
    "heading-five": {
        fontSize: 14,
    },
    "heading-six": {
        fontSize: 12,
    },
}));

const HeadingButton = ({
    types = ["heading-one", "heading-two", "heading-three", "heading-four", "heading-five", "heading-six"],
    ...iconButtonProps
}: HeadingButtonProps) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

    const editor = useSlate();

    const onClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchor(e.currentTarget);
    };

    const onMouseDown = (e: React.MouseEvent<HTMLElement>, type: HeadingElementType) => {
        e.preventDefault();
        toggleElement(editor, type);
    };

    const onClose = () => {
        setAnchor(null);
    };

    return (
        <>
            <IconButton
                {...{
                    onClick,
                    children: <Title />,
                    ...iconButtonProps,
                }}
            />
            <Popover
                open={anchor !== null}
                anchorEl={anchor}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <div className={classes.content}>
                    <ClickAwayListener onClickAway={onClose}>
                        <Box>
                            {types.map((type) => (
                                <Button
                                    key={type}
                                    onMouseDown={(e) => onMouseDown(e, type)}
                                    fullWidth
                                    className={classes[type]}
                                >
                                    {t("cms.muiSlate.heading." + type)}
                                </Button>
                            ))}
                        </Box>
                    </ClickAwayListener>
                </div>
            </Popover>
        </>
    );
};

const plugin: SlatePluginInterface = {
    toolbarComponent: <HeadingButton />,
    renderElement,
    serializeElement,
    deserializeElement,
};

export default plugin;
export {
    HeadingElementType,
    HeadingElementInterface,
    renderElement,
    serializeElement,
    deserializeElement,
    HeadingButton,
    HeadingButtonProps,
    HeadingTypes,
};
