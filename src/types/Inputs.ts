import { Tab } from "./Tab";

export interface Inputs {
  name: string;
  prefix: string;
  indentation: number;
  body: string;
  tabs: Tab[];
  description: string;
}
