import React from "react";
import { IconButton, IconButtonProps, Box, Popover, makeStyles, ClickAwayListener, Button } from "@material-ui/core";
import { Title } from "@material-ui/icons";
import { RenderElementProps, useSlate } from "slate-react";
import { toggleElement } from "@arteneo/material-ui-slate/utils/slate";
import { useTranslation } from "react-i18next";
import { jsx } from "slate-hyperscript";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";
import TextType from "@arteneo/material-ui-slate/definitions/TextType";
import ElementType from "@arteneo/material-ui-slate/definitions/ElementType";
import DeserializeElementType from "@arteneo/material-ui-slate/definitions/DeserializeElementType";
import DeserializeType from "@arteneo/material-ui-slate/definitions/DeserializeType";

type HeadingElementType =
    | "heading-one"
    | "heading-two"
    | "heading-three"
    | "heading-four"
    | "heading-five"
    | "heading-six";

interface HeadingElementInterface {
    type: HeadingElementType;
    children: TextType[];
}

const serializeElement = (node: ElementType, children: string): undefined | string => {
    switch (node.type) {
        case "heading-one":
            return "<h1>" + children + "</h1>";
        case "heading-two":
            return "<h2>" + children + "</h2>";
        case "heading-three":
            return "<h3>" + children + "</h3>";
        case "heading-four":
            return "<h4>" + children + "</h4>";
        case "heading-five":
            return "<h5>" + children + "</h5>";
        case "heading-six":
            return "<h6>" + children + "</h6>";
    }
};

const deserializeElement = (element: Node, children: DeserializeType[]): DeserializeElementType => {
    switch (element.nodeName) {
        case "H1":
            return jsx("element", { type: "heading-one" }, children);
        case "H2":
            return jsx("element", { type: "heading-two" }, children);
        case "H3":
            return jsx("element", { type: "heading-three" }, children);
        case "H4":
            return jsx("element", { type: "heading-four" }, children);
        case "H5":
            return jsx("element", { type: "heading-five" }, children);
        case "H6":
            return jsx("element", { type: "heading-six" }, children);
    }
};

const renderElement = ({ attributes, children, element }: RenderElementProps): undefined | JSX.Element => {
    switch (element.type) {
        case "heading-one":
            return <h1 {...attributes}>{children}</h1>;
        case "heading-two":
            return <h2 {...attributes}>{children}</h2>;
        case "heading-three":
            return <h3 {...attributes}>{children}</h3>;
        case "heading-four":
            return <h4 {...attributes}>{children}</h4>;
        case "heading-five":
            return <h5 {...attributes}>{children}</h5>;
        case "heading-six":
            return <h6 {...attributes}>{children}</h6>;
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
