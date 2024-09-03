import { formatString } from "./formatString";

describe("formatObject", () => {
  it.each<{
    text: unknown;
    template: string;
    placeholder?: string;
    toExpect: unknown;
  }>([
    { text: undefined, template: "(%)", toExpect: "" },
    { text: null, template: "(%)", toExpect: "" },
    { text: 0, template: "(%)", toExpect: "(0)" },
    { text: 0, template: "($)", placeholder: "$", toExpect: "(0)" },
    { text: "hola", template: "(%)", toExpect: "(hola)" },
    { text: "ho%la", template: "(%)", toExpect: "(ho%la)" },
    { text: "hola como va", template: "(%)", toExpect: "(hola como va)" },
    {
      text: "hola como va",
      template: "(%) - % y %",
      toExpect: "(hola como va) - hola como va y hola como va",
    },
    { text: "hola", template: "(-)", placeholder: "-", toExpect: "(hola)" },
    { text: "ho$la", template: "($)", placeholder: "$", toExpect: "(ho$la)" },
    {
      text: "hola como va",
      template: "(REPLACE)",
      placeholder: "REPLACE",
      toExpect: "(hola como va)",
    },
    {
      text: "hola como va",
      template: "(@) - @ y @",
      placeholder: "@",
      toExpect: "(hola como va) - hola como va y hola como va",
    },
  ])(
    "when given $text should format with $template, placeholder = $placeholder and return: $toExpect",
    ({ text, template, placeholder, toExpect }) => {
      expect(formatString(text, template, placeholder)).toEqual(toExpect);
    }
  );
});
