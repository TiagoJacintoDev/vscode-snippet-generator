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

export const composeRegex = (...regexes: RegExp[]) => {
  return new RegExp(regexes.map((regex) => regex.source).join("|"), "g");
};

export const getUniqueIds = (
  matches: RegExpMatchArray[],
  splitter: RegExp | string
) => {
  return [
    ...new Set(
      matches.map((match) => {
        const id = match[0].split(splitter)[0];
        return id;
      })
    ),
  ];
};

export const getTabPositions = (currentTab: RegExpMatchArray[]) => {
  return currentTab.map((tab) => {
    const startPos = tab.index!;
    const endPos = startPos + tab[0].length;

    return { startPos, endPos };
  });
};

export const getCurrentMatches = (
  currentMatch: RegExpMatchArray[],
  id: string,
  splitter: RegExp | string
) => {
  return currentMatch.filter((match) => {
    const currentId = match[0].split(splitter)[0];
    return id === currentId;
  });
};

export const getFirstAssignedTab = (
  currentTab: RegExpMatchArray[],
  id: string
) => {
  return currentTab
    .map((tab) => {
      const currentMatch = tab[0];
      const isLabel = currentMatch.includes(":");

      const label = isLabel ? currentMatch.slice(id.length + 1) : undefined;
      const values = !isLabel ? currentMatch.slice(id.length + 1) : undefined;

      const choices = values ? values?.split(",") : undefined;

      return { label, choices };
    })
    .find(({ label, choices }) => {
      if (label) {
        return true;
      } else if (choices) {
        return true;
      } else {
        return false;
      }
    });
};

export const getDefaultValues = (currentVariable: RegExpMatchArray[]) => {
  return currentVariable.map((variable) => variable[0].split(":")[1]);
};
