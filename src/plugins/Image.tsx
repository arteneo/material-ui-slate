import React from "react";
import {
    IconButton,
    IconButtonProps,
    Box,
    Popover,
    makeStyles,
    ClickAwayListener,
    TextField,
    Grid,
} from "@material-ui/core";
import { Check, Image, Clear } from "@material-ui/icons";
import { Editor, Transforms, Element as SlateElement, Range, BaseSelection } from "slate";
import { RenderElementProps, useSlate } from "slate-react";
import { isElementActive } from "@arteneo/forge/slate/utils/slate";
import { useTranslation } from "react-i18next";
import { jsx } from "slate-hyperscript";
import SlatePluginInterface from "@arteneo/forge/slate/definitions/SlatePluginInterface";
import TextType from "@arteneo/forge/slate/definitions/TextType";
import ElementType from "@arteneo/forge/slate/definitions/ElementType";
import DeserializeElementType from "@arteneo/forge/slate/definitions/DeserializeElementType";
import DeserializeType from "@arteneo/forge/slate/definitions/DeserializeType";
import isUrl from "is-url";

type ImageElementType = "image";

interface ImageElementInterface {
    type: ImageElementType;
    src: string;
    alt: string;
    maxWidth?: number;
    float?: string;
    children: TextType[];
}

const serializeElement = (node: ElementType, children: string): undefined | string => {
    switch (node.type) {
        case "image":
            return "<img src='abc' />";
    }
};

const deserializeElement = (element: Node, children: DeserializeType[]): DeserializeElementType => {
    switch (element.nodeName) {
        case "IMG":
            return jsx("element", { type: "image", url: (element as HTMLAnchorElement).href }, children);
    }
};

const renderElement = ({ attributes, children, element }: RenderElementProps): undefined | JSX.Element => {
    switch (element.type) {
        case "link":
            return (
                <a {...attributes} href={element.url}>
                    {children}
                </a>
            );
    }
};

const useStyles = makeStyles(() => ({
    content: {
        maxWidth: 250,
    },
}));

const removeLink = (editor: Editor) => {
    Transforms.unwrapNodes(editor, {
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
    });
};

const insertImage = (editor: Editor, selection: BaseSelection, src: string, alt: string, maxWidth?: number) => {
    if (isElementActive(editor, "link")) {
        removeLink(editor);
    }

    const image: ImageElementInterface = {
        type: "image",
        src,
        alt,
        maxWidth,
        children: [{ text: "" }],
    };

    if (selection !== null) {
        Transforms.select(editor, selection);
    }

    Transforms.insertNodes(editor, image);
};

const ImageButton = ({ ...iconButtonProps }: IconButtonProps) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
    const [src, setSrc] = React.useState<string>("");
    const [alt, setAlt] = React.useState<string>("");
    const [maxWidth, setMaxWidth] = React.useState<undefined | number>(undefined);
    const [selection, setSelection] = React.useState<undefined | BaseSelection>(undefined);

    const editor = useSlate();

    const onClick = (e: React.MouseEvent<HTMLElement>) => {
        // const [links] = Editor.nodes(editor, {
        //     match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
        // });

        // if (links && links.length > 0) {
        //     const link = links[0] as LinkElementInterface;
        //     setValue(link.url);
        // } else {
        //     setValue("");
        // }

        setSelection(editor.selection);
        setAnchor(e.currentTarget);
    };

    const onChangeSrc = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSrc(event.target.value);
    };

    const onChangeAlt = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAlt(event.target.value);
    };

    const onChangeMaxWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
        const number = parseInt(event.target.value, 10);
        if (isNaN(number)) {
            setMaxWidth(undefined);
            return;
        }

        setMaxWidth(number);
    };

    const onClose = () => {
        setAnchor(null);
        setSelection(undefined);
    };

    const onClickRemoveImage = () => {
        // TODO
        // removeLink(editor);
        onClose();
    };

    const onClickAddImage = () => {
        if (!selection) {
            return;
        }

        insertImage(editor, selection, src, alt, maxWidth);

        onClose();
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
                                            label: t("cms.muiSlate.image.alt"),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...{
                                            value: maxWidth,
                                            onChange: onChangeMaxWidth,
                                            variant: "outlined",
                                            size: "small",
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
    const { insertData, insertText, isInline, selection } = editor;

    editor.isInline = (element) => {
        return element.type === "link" ? true : isInline(element);
    };

    editor.insertText = (text) => {
        if (text && isUrl(text)) {
            addLink(editor, selection, text);
        } else {
            insertText(text);
        }
    };

    editor.insertData = (data) => {
        const text = data.getData("text/plain");

        if (text && isUrl(text)) {
            addLink(editor, selection, text);
        } else {
            insertData(data);
        }
    };

    return editor;
};

const plugin: SlatePluginInterface = {
    toolbarComponent: <ImageButton />,
    renderElement,
    serializeElement,
    deserializeElement,
    // withEditor,
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
};
