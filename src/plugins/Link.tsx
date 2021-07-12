import React from "react";
import { IconButton, IconButtonProps, Box, Popover, makeStyles, ClickAwayListener, TextField } from "@material-ui/core";
import { Check, Link, LinkOff } from "@material-ui/icons";
import { Editor, Transforms, Element as SlateElement, Range, BaseSelection } from "slate";
import { RenderElementProps, useSlate } from "slate-react";
import { isElementActive } from "@arteneo/material-ui-slate/utils/slate";
import { useTranslation } from "react-i18next";
import { jsx } from "slate-hyperscript";
import SlatePluginInterface from "@arteneo/material-ui-slate/definitions/SlatePluginInterface";
import TextType from "@arteneo/material-ui-slate/definitions/TextType";
import ElementType from "@arteneo/material-ui-slate/definitions/ElementType";
import DeserializeElementType from "@arteneo/material-ui-slate/definitions/DeserializeElementType";
import DeserializeType from "@arteneo/material-ui-slate/definitions/DeserializeType";
import isUrl from "is-url";

type LinkElementType = "link";

interface LinkElementInterface {
    type: LinkElementType;
    url: string;
    children: TextType[];
}

const serializeElement = (node: ElementType, children: string): undefined | string => {
    switch (node.type) {
        case "link":
            return "<a href='" + node.url + "'>" + children + "</a>";
    }
};

const deserializeElement = (element: Node, children: DeserializeType[]): DeserializeElementType => {
    switch (element.nodeName) {
        case "A":
            return jsx("element", { type: "link", url: (element as HTMLAnchorElement).href }, children);
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

const addLink = (editor: Editor, selection: BaseSelection, url: string) => {
    if (isElementActive(editor, "link")) {
        removeLink(editor);
    }

    const isCollapsed = selection && Range.isCollapsed(selection);
    const link: LinkElementInterface = {
        type: "link",
        url,
        children: isCollapsed ? [{ text: url }] : [],
    };

    if (selection !== null) {
        Transforms.select(editor, selection);
    }

    if (isCollapsed) {
        Transforms.insertNodes(editor, link);
    } else {
        Transforms.wrapNodes(editor, link, { split: true });
        Transforms.collapse(editor, { edge: "end" });
    }
};

const LinkButton = ({ ...iconButtonProps }: IconButtonProps) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
    const [value, setValue] = React.useState<string>("");
    const [selection, setSelection] = React.useState<undefined | BaseSelection>(undefined);

    const editor = useSlate();

    const onClick = (e: React.MouseEvent<HTMLElement>) => {
        const [links] = Editor.nodes(editor, {
            match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
        });

        if (links && links.length > 0) {
            const link = links[0] as LinkElementInterface;
            setValue(link.url);
        } else {
            setValue("");
        }

        setSelection(editor.selection);
        setAnchor(e.currentTarget);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const onClose = () => {
        setAnchor(null);
        setSelection(undefined);
    };

    const onClickRemoveLink = () => {
        removeLink(editor);
        onClose();
    };

    const onClickAddLink = () => {
        if (!selection) {
            return;
        }

        addLink(editor, selection, value);

        onClose();
    };

    return (
        <>
            <IconButton
                {...{
                    onClick,
                    children: <Link />,
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
                            <TextField
                                {...{
                                    value,
                                    onChange,
                                    variant: "outlined",
                                    size: "small",
                                    label: t("cms.muiSlate.link"),
                                }}
                            />
                            <Box mt={4} display="flex" justifyContent="space-between">
                                <IconButton
                                    {...{
                                        onClick: () => onClickRemoveLink(),
                                        size: "small",
                                        children: <LinkOff />,
                                    }}
                                />
                                <IconButton
                                    {...{
                                        onClick: () => onClickAddLink(),
                                        size: "small",
                                        children: <Check />,
                                    }}
                                />
                            </Box>
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
    toolbarComponent: <LinkButton />,
    renderElement,
    serializeElement,
    deserializeElement,
    withEditor,
};

export default plugin;
export {
    LinkElementType,
    LinkElementInterface,
    renderElement,
    serializeElement,
    deserializeElement,
    withEditor,
    LinkButton,
    IconButtonProps as LinkButtonProps,
};
