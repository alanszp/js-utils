import * as nunjucks from "nunjucks";
import { formatObject } from "./formatObject";
import { registerFilters } from "../registerFilters";

describe("formatObject", () => {
  it.each<{
    object: unknown;
    format: string;
    defaultTemplate?: string;
    toExpect: unknown;
  }>([
    {
      object: { key1: "hola", key2: "bye" },
      format: "Template vacio",
      toExpect: "Template vacio",
    },
    {
      object: { key1: "hola", key2: "bye" },
      format: "Template {{key1}} {{key2 | upper}}",
      toExpect: "Template hola BYE",
    },
    {
      object: { key1: "hola", key2: "bye" },
      format: "Template {{key3 | formatString('')}} - {{key2 | upper}}",
      toExpect: "Template  - BYE",
    },
    {
      object: { key1: "hola", object1: { some: "thing" } },
      format: "Template {{object1 | formatObject('tomo el object {{some}}')}}",
      toExpect: "Template tomo el object thing",
    },
    {
      object: [1, 2, 3],
      format: "Holas {{0}}",
      toExpect: "",
    },
    {
      object: ["uno", "dos", "tres"],
      format: "Holas {{0}}",
      toExpect: "",
    },
    {
      object: undefined,
      format: "Holas {{0}}",
      toExpect: "",
    },
    {
      object: null,
      format: "Holas {{0}}",
      toExpect: "",
    },
    {
      object: 1,
      format: "Holas {{0}}",
      toExpect: "",
    },
    {
      object: "asd",
      format: "Holas {{0}}",
      toExpect: "",
    },
    {
      object: "asd",
      format: "Holas {{0}}",
      defaultTemplate: "default",
      toExpect: "default",
    },
  ])(
    "when given $object should format with $format, defaultTemplate = $defaultTemplate and return: $toExpect",
    ({ object, format, defaultTemplate, toExpect }) => {
      expect(
        formatObject(
          registerFilters(
            nunjucks.configure({ autoescape: false, throwOnUndefined: true })
          ),
          object,
          format,
          defaultTemplate
        )
      ).toEqual(toExpect);
    }
  );
});
