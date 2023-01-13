import { ChangeEvent, useState } from "react";
import { Display } from "./components/Display";
import { Form } from "./components/Form";
import { Inputs } from "./types/Inputs";

export const App = () => {
  const [inputs, setInputs] = useState<Inputs>({
    name: "",
    scope: "",
    prefix: "",
    body: "",
    description: "",
    indentation: 2,
    tabs: [],
    variables: [],
  });

  return (
    <>
      <Form {...inputs} setInputs={setInputs} />
      <Display {...inputs} />
    </>
  );
};
