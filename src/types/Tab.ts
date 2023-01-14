import { Position } from "./Position";

export interface Tab {
  id: string;
  label?: string;
  choices?: string[];
  positions: Position[];
}
