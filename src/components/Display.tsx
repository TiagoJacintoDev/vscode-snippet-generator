import { formatBody, indentText } from "../helpers/functions";
import { Inputs } from "../types/Inputs";

export const Display = ({
  body,
  description,
  indentation,
  name,
  prefix,
  scope,
}: Inputs) => {
  const display = [
    `"${name}": {`,
    scope ? `"scope": "${scope}",` : null,
    `"prefix": "${prefix}",`,
    `"body": [`,
    body,
    `],`,
    description ? `"description": "${description}"` : null,
    `}`,
  ];

  const indentedDisplay = display.map((line, index) => {
    const lastIndex = display.length - 1;
    if (index === 0 || index === lastIndex) {
      return indentText(line!, indentation);
    } else if (line === body) {
      return formatBody(line, indentation);
    } else if (line) {
      return indentText(line, indentation * 2);
    }
  });

  return (
    <section>
      {indentedDisplay.map((line, index) => (
        <p
          key={index}
          style={{
            whiteSpace: "pre",
            marginBlock: "10px",
            fontSize: "25px",
          }}
        >
          {line}
        </p>
      ))}
    </section>
  );
};
