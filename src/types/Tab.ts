import { Position } from "./Position";

export interface Tab {
  id: string;
  label?: string;
  positions: Position[];
}
