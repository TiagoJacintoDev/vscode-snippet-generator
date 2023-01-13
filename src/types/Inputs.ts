import { Tab } from "./Tab";
import { Variable } from "./Variable";

export interface Inputs {
  name: string;
  prefix: string;
  scope: string;
  indentation: number;
  body: string;
  tabs: Tab[];
  variables: Variable[];
  description: string;
}
