import { Position } from "./Position";

export interface Variable {
  id: string;
  defaultValue?: string;
  positions: Position[];
}
