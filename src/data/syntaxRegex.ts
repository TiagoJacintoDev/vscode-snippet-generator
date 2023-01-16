import { composeRegex } from "../helpers/functions";

export const getSyntaxRegex = () => {
  const tab = /(?<=\${)(\d+)(?=})|(?<=\$)(\d+)/;
  const placeholder = /(?<=\${)(\d+:.+?)(?=})/;
  const choice = /(?<=\${)(\d+\|.+?)(?=\|})/;
  const variableWithoutBrackets = /(?<=\$)([A-Z_]+)/;
  const variableWithBrackets = /(?<=\${)([A-Z_]+?)(?=})/;
  const variableWithDefaultValue = /(?<=\${)([A-Z_]+?:[a-z]+)(?=})/;

  const variablesRegex = composeRegex(
    variableWithBrackets,
    variableWithDefaultValue,
    variableWithoutBrackets
  );

  const tabsRegex = composeRegex(tab, placeholder, choice);

  return { tabsRegex, variablesRegex };
};
