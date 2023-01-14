export const indentText = (text: string, indentation: number) => {
  return " ".repeat(indentation) + text;
};

export const paragraph = (text: string) => "\n" + text;

export const formatBody = (body: string, indentation: number) => {
  const multiplier = 3;
  const lines = body.split(/\n/);

  const indentedLines = lines.map((line, index) => {
    const lastIndex = lines.length - 1;
    let newLine = indentText(`"${line}"`, indentation * multiplier);

    if (index !== 0) {
      newLine = paragraph(newLine);
    }

    if (index !== lastIndex) {
      newLine += ",";
    }

    return newLine;
  });

  return indentedLines.join("");
};

export const composeRegex = (...regexes: RegExp[]) =>
  new RegExp(regexes.map((regex) => regex.source).join("|"), "g");
