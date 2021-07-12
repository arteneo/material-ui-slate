import { LinkElementInterface } from "@arteneo/material-ui-slate/plugins/Link";
import { HeadingElementInterface } from "@arteneo/material-ui-slate/plugins/Heading";
import { ParagraphElementInterface } from "@arteneo/material-ui-slate/plugins/Paragraph";
import { OrderedListElementInterface } from "@arteneo/material-ui-slate/plugins/OrderedList";
import { UnorderedListElementInterface } from "@arteneo/material-ui-slate/plugins/UnorderedList";

type ElementType =
    | LinkElementInterface
    | HeadingElementInterface
    | ParagraphElementInterface
    | OrderedListElementInterface
    | UnorderedListElementInterface;

export default ElementType;
