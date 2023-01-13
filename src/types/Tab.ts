export interface Tab {
  id: number;
  label?: string;
  positions: { startPos: number; endPos: number }[];
}
