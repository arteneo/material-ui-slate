import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

type EditorType = BaseEditor & ReactEditor & HistoryEditor;

export default EditorType;
