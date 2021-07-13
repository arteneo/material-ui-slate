import { ImageElementType } from "@arteneo/material-ui-slate/plugins/Image";
import { LinkElementType } from "@arteneo/material-ui-slate/plugins/Link";
import { HeadingElementType } from "@arteneo/material-ui-slate/plugins/Heading";
import { ParagraphElementType } from "@arteneo/material-ui-slate/plugins/Paragraph";
import { OrderedListElementType } from "@arteneo/material-ui-slate/plugins/OrderedList";
import { UnorderedListElementType } from "@arteneo/material-ui-slate/plugins/UnorderedList";

type ElementTypeType =
    | ImageElementType
    | LinkElementType
    | HeadingElementType
    | ParagraphElementType
    | OrderedListElementType
    | UnorderedListElementType;

export default ElementTypeType;
