import { BoldInterface } from "@arteneo/material-ui-slate/plugins/Bold";
import { ItalicInterface } from "@arteneo/material-ui-slate/plugins/Italic";
import { StrikethroughInterface } from "@arteneo/material-ui-slate/plugins/Strikethrough";
import { UnderlineInterface } from "@arteneo/material-ui-slate/plugins/Underline";
import { ColorInterface } from "@arteneo/material-ui-slate/plugins/Color";

type TextType = BoldInterface | ItalicInterface | StrikethroughInterface | UnderlineInterface | ColorInterface;

export default TextType;
