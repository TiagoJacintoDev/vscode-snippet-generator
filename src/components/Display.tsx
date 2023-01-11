import { formatBody, indentText, paragraph } from "../helpers/functions";
import { Inputs } from "../types/Inputs";

interface DisplayProps {}

export const Display = ({
  body,
  description,
  indentation,
  name,
  prefix,
}: Inputs) => {
  const display = [
    `"${name}": {`,
    `"prefix": "${prefix}",`,
    `"body": [`,
    body,
    `],`,
    description && `"description": "${description}"`,
    `}`,
  ];

  const indentedDisplay = display.map((line, index) => {
    const lastIndex = display.length - 1;
    if (index === 0 || index === lastIndex) {
      return indentText(line, indentation);
    } else if (line === body) {
      return formatBody(line, indentation);
    } else if (line) {
      return indentText(line, indentation * 2);
    }
  });

  return (
    <>
      {indentedDisplay.map((line) => (
        <p style={{ whiteSpace: "pre", marginBlock: "10px" }}>{line}</p>
      ))}
    </>
  );
};
