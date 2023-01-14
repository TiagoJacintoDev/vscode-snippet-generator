import { Position } from "./Position";

export interface Variable {
  name: string;
  defaultValues?: string[];
  positions: Position[];
}
