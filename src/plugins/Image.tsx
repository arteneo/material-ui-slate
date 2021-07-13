import React from "react";
import clsx from "clsx";
import {
    IconButton,
    IconButtonProps,
    Box,
    Popover,
    makeStyles,
    ClickAwayListener,
    TextField,
    Grid,
    alpha,
    ButtonGroup,
    Button,
} from "@material-ui/core";
import {
    Check,
    Image,
    Clear,
    VerticalSplit,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
} from "@material-ui/icons";
import { Editor, Transforms, Element as SlateElement, BaseSelection } from "slate";
import { RenderElementProps, useFocused, useSelected, useSlate } from "slate-react";
import { isElementActive, getStyleAttr } from "@arteneo/material-ui-slate/utils/slate";
import { useTranslation } from "react-i18next";
import { jsx } from "slate-hyperscript";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";
import TextType from "@arteneo/material-ui-slate/definitions/TextType";
import ElementType from "@arteneo/material-ui-slate/definitions/ElementType";
import DeserializeElementType from "@arteneo/material-ui-slate/definitions/DeserializeElementType";
import DeserializeType from "@arteneo/material-ui-slate/definitions/DeserializeType";

type ImageElementType = "image";

type ImageElementAlignType = "left" | "center" | "right" | "float-left" | "float-right";

interface ImageElementInterface {
    type: ImageElementType;
    src: string;
    alt?: string;
    maxWidth?: number;
    align?: ImageElementAlignType;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    children: TextType[];
}

type InsertImageElementType = Omit<ImageElementInterface, "type" | "children">;

const serializeElement = (node: ElementType): undefined | string => {
    if (node.type === "image") {
        const style = getImageStyle(node);
        return "<img src='" + node.src + "' alt='" + node.alt + "'" + getStyleAttr(style) + "/>";
    }
};

const deserializeElement = (element: Node, children: DeserializeType[]): DeserializeElementType => {
    const imageElement = element as HTMLImageElement;
    let align: undefined | ImageElementAlignType = undefined;
    const style = imageElement.style;

    if (style.marginLeft === "auto") {
        align = "right";
    }

    if (style.marginRight === "auto") {
        align = "left";
    }

    if (style.marginLeft === "auto" && style.marginRight === "auto") {
        align = "center";
    }

    if (style.float === "left") {
        align = "float-left";
    }

    if (style.float === "right") {
        align = "float-right";
    }

    const jsxAttributes = {
        type: "image",
        src: imageElement.src,
        alt: imageElement.alt ?? "Image",
        align,
        maxWidth: convertStyleToNumber(style.maxWidth),
        paddingTop: convertStyleToNumber(style.paddingTop),
        paddingRight: convertStyleToNumber(style.paddingRight),
        paddingBottom: convertStyleToNumber(style.paddingBottom),
        paddingLeft: convertStyleToNumber(style.paddingLeft),
    };

    switch (element.nodeName) {
        case "IMG":
            return jsx("element", jsxAttributes, children);
    }
};

const convertStyleToNumber = (style: string): undefined | number => {
    if (style.includes("%")) {
        return undefined;
    }

    const styleString = style.replace(/\D/g, "");
    const styleNumber = styleString ? parseInt(styleString, 10) : undefined;

    if (typeof styleNumber === "undefined") {
        return undefined;
    }

    if (isNaN(styleNumber)) {
        return undefined;
    }

    return styleNumber;
};

const renderElement = ({ attributes, children, element }: RenderElementProps): undefined | JSX.Element => {
    switch (element.type) {
        case "image":
            return (
                <ImageElement
                    {...{
                        attributes,
                        children,
                        element,
                    }}
                />
            );
    }
};

const useStyles = makeStyles(() => ({
    content: {
        maxWidth: 360,
    },
    floatLeftIcon: {
        transform: "rotate(180deg)",
        transformOrigin: "center",
    },
}));

const removeImage = (editor: Editor) => {
    Transforms.unwrapNodes(editor, {
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "image",
        voids: true,
    });
};

const insertImage = (editor: Editor, insertImage: InsertImageElementType) => {
    if (isElementActive(editor, "image", { voids: true })) {
        removeImage(editor);
    }

    const image: ImageElementInterface = {
        type: "image",
        children: [{ text: "" }],
        ...insertImage,
    };

    Transforms.insertNodes(editor, image);
};

const useImageStyles = makeStyles((theme) => ({
    imageHighlight: {
        boxShadow: "0 0 0 3px " + alpha(theme.palette.primary.main, 0.5),
    },
}));

const getImageStyle = (image: ImageElementInterface): React.CSSProperties => {
    const style: React.CSSProperties = {};

    switch (image.align) {
        case "left":
            style["display"] = "block";
            style["margin"] = "0 auto 0 0";
            break;
        case "center":
            style["display"] = "block";
            style["margin"] = "0 auto";
            break;
        case "right":
            style["display"] = "block";
            style["margin"] = "0 0 0 auto";
            break;
        case "float-left":
            style["float"] = "left";
            break;
        case "float-right":
            style["float"] = "right";
            break;
    }

    if (typeof image.maxWidth !== "undefined") {
        style["maxWidth"] = image.maxWidth + "px";
    }

    if (typeof image.paddingTop !== "undefined") {
        style["paddingTop"] = image.paddingTop + "px";
    }

    if (typeof image.paddingRight !== "undefined") {
        style["paddingRight"] = image.paddingRight + "px";
    }

    if (typeof image.paddingBottom !== "undefined") {
        style["paddingBottom"] = image.paddingBottom + "px";
    }

    if (typeof image.paddingLeft !== "undefined") {
        style["paddingLeft"] = image.paddingLeft + "px";
    }

    if (typeof style.maxWidth !== "undefined") {
        style["width"] = "100%";
    } else {
        style["maxWidth"] = "100%";
    }

    return style;
};

const ImageElement = ({ attributes, children, element }: RenderElementProps) => {
    const classes = useImageStyles();
    const selected = useSelected();
    const focused = useFocused();

    const image = element as ImageElementInterface;

    return (
        <div {...attributes}>
            <div contentEditable={false}>
                <img
                    {...{
                        src: image.src,
                        alt: image.alt ?? "Unknown image",
                        style: getImageStyle(image),
                        className: clsx(selected && focused && classes.imageHighlight),
                    }}
                />
            </div>
            {children}
        </div>
    );
};

const ImageButton = ({ ...iconButtonProps }: IconButtonProps) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
    const [src, setSrc] = React.useState<string>("");
    const [alt, setAlt] = React.useState<undefined | string>("");
    const [align, setAlign] = React.useState<undefined | ImageElementAlignType>(undefined);
    const [maxWidth, setMaxWidth] = React.useState<undefined | number>(undefined);
    const [paddingTop, setPaddingTop] = React.useState<undefined | number>(undefined);
    const [paddingRight, setPaddingRight] = React.useState<undefined | number>(undefined);
    const [paddingBottom, setPaddingBottom] = React.useState<undefined | number>(undefined);
    const [paddingLeft, setPaddingLeft] = React.useState<undefined | number>(undefined);
    const [selection, setSelection] = React.useState<undefined | BaseSelection>(undefined);

    const editor = useSlate();

    const onClick = (e: React.MouseEvent<HTMLElement>) => {
        const [images] = Editor.nodes(editor, {
            match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "image",
            voids: true,
        });

        if (images && images.length > 0) {
            const image = images[0] as ImageElementInterface;
            setSrc(image.src);
            setAlt(image.alt);
            setMaxWidth(image.maxWidth);
            setPaddingTop(image.paddingTop);
            setPaddingRight(image.paddingRight);
            setPaddingBottom(image.paddingBottom);
            setPaddingLeft(image.paddingLeft);
            setAlign(image.align);
        } else {
            setSrc("");
            setAlt("");
            setMaxWidth(undefined);
            setPaddingTop(undefined);
            setPaddingRight(undefined);
            setPaddingBottom(undefined);
            setPaddingLeft(undefined);
            setAlign(undefined);
        }

        setSelection(editor.selection);
        setAnchor(e.currentTarget);
    };

    const onChangeSrc = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSrc(event.target.value);
    };

    const onChangeAlt = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAlt(event.target.value);
    };

    const onChangeNumber = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        setNumber: (number: undefined | number) => void
    ) => {
        const number = parseInt(event.target.value, 10);
        if (isNaN(number)) {
            setNumber(undefined);
            return;
        }

        setNumber(number);
    };

    const onClose = () => {
        setAnchor(null);
        setSelection(undefined);
    };

    const onClickRemoveImage = () => {
        if (selection) {
            Transforms.select(editor, selection);
        }

        removeImage(editor);

        onClose();
    };

    const onClickAddImage = () => {
        if (selection) {
            Transforms.select(editor, selection);
        }

        insertImage(editor, {
            src,
            alt,
            align,
            maxWidth,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
        });

        onClose();
    };

    const renderAlignButton = (alignOption: ImageElementAlignType, icon: React.ReactElement) => {
        return (
            <Button onClick={() => setAlign(alignOption)}>
                {React.cloneElement(icon, {
                    fontSize: "small",
                    color: align === alignOption ? "primary" : undefined,
                })}
            </Button>
        );
    };

    return (
        <>
            <IconButton
                {...{
                    onClick,
                    children: <Image />,
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
                        <Box p={4}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <TextField
                                        {...{
                                            value: src,
                                            onChange: onChangeSrc,
                                            variant: "outlined",
                                            size: "small",
                                            fullWidth: true,
                                            label: t("cms.muiSlate.image.src"),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...{
                                            value: alt,
                                            onChange: onChangeAlt,
                                            variant: "outlined",
                                            size: "small",
                                            fullWidth: true,
                                            label: t("cms.muiSlate.image.alt"),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <ButtonGroup variant="outlined" fullWidth>
                                        {renderAlignButton("left", <FormatAlignLeft />)}
                                        {renderAlignButton("center", <FormatAlignCenter />)}
                                        {renderAlignButton("right", <FormatAlignRight />)}
                                        {renderAlignButton(
                                            "float-left",
                                            <VerticalSplit className={classes.floatLeftIcon} />
                                        )}
                                        {renderAlignButton("float-right", <VerticalSplit />)}
                                    </ButtonGroup>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={4} justifyContent="center">
                                        <Grid item xs={6}>
                                            <TextField
                                                {...{
                                                    value: paddingTop,
                                                    onChange: (e) => onChangeNumber(e, setPaddingTop),
                                                    variant: "outlined",
                                                    size: "small",
                                                    fullWidth: true,
                                                    label: t("cms.muiSlate.image.paddingTop"),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={4} justifyContent="center">
                                        <Grid item xs={6}>
                                            <TextField
                                                {...{
                                                    value: paddingLeft,
                                                    onChange: (e) => onChangeNumber(e, setPaddingLeft),
                                                    variant: "outlined",
                                                    size: "small",
                                                    fullWidth: true,
                                                    label: t("cms.muiSlate.image.paddingLeft"),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                {...{
                                                    value: paddingRight,
                                                    onChange: (e) => onChangeNumber(e, setPaddingRight),
                                                    variant: "outlined",
                                                    size: "small",
                                                    fullWidth: true,
                                                    label: t("cms.muiSlate.image.paddingRight"),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={4} justifyContent="center">
                                        <Grid item xs={6}>
                                            <TextField
                                                {...{
                                                    value: paddingBottom,
                                                    onChange: (e) => onChangeNumber(e, setPaddingBottom),
                                                    variant: "outlined",
                                                    size: "small",
                                                    fullWidth: true,
                                                    label: t("cms.muiSlate.image.paddingBottom"),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...{
                                            value: maxWidth,
                                            onChange: (e) => onChangeNumber(e, setMaxWidth),
                                            variant: "outlined",
                                            size: "small",
                                            fullWidth: true,
                                            label: t("cms.muiSlate.image.maxWidth"),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="space-between">
                                        <IconButton
                                            {...{
                                                onClick: () => onClickRemoveImage(),
                                                size: "small",
                                                children: <Clear />,
                                            }}
                                        />
                                        <IconButton
                                            {...{
                                                onClick: () => onClickAddImage(),
                                                size: "small",
                                                children: <Check />,
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </ClickAwayListener>
                </div>
            </Popover>
        </>
    );
};

const withEditor = (editor: Editor): Editor => {
    const { isVoid } = editor;

    editor.isVoid = (element) => {
        return element.type === "image" ? true : isVoid(element);
    };

    return editor;
};

const plugin: SlatePluginInterface = {
    toolbarComponent: <ImageButton />,
    renderElement,
    serializeElement,
    deserializeElement,
    withEditor,
};

export default plugin;
export {
    ImageElementType,
    ImageElementInterface,
    renderElement,
    serializeElement,
    deserializeElement,
    withEditor,
    ImageButton,
    IconButtonProps as ImageButtonProps,
    ImageElement,
    RenderElementProps as ImageElementProps,
};
