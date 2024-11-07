import { formatTable } from "./formatTable";

describe("formatTable", () => {
  it.each([
    {
      headers: [],
      rows: [],
    },
    {
      headers: ["h1", "h2"],
      rows: [
        ["v11", "v12"],
        ["v21", "v22", "v23"],
      ],
    },
    {
      headers: null,
      rows: [["v11", "v12"]],
    },
    {
      headers: ["h1"],
      rows: null,
    },
    {
      headers: ["h1"],
      rows: ["v11"],
    },
  ])("should throw an error if the input is invalid", ({ headers, rows }) => {
    expect(() => formatTable(headers, rows)).toThrow(
      "formatTable: Invalid input"
    );
  });

  it("should format a table for string values", () => {
    const headers = ["h1", "h2", "h3"];
    const rows = [
      ["v11", "v12", "v13"],
      ["v21", "v22", "v23"],
      ["v31", "v32", "v33"],
      ["vLong1", "vLong2", "v33"],
      ["v51", "v52", "v533333333333"],
    ];
    const expected = `h1     | h2     | h3           
------ | ------ | -------------
v11    | v12    | v13          
v21    | v22    | v23          
v31    | v32    | v33          
vLong1 | vLong2 | v33          
v51    | v52    | v533333333333`;
    const result = formatTable(headers, rows);
    expect(result).toBe(expected);
  });
  it("should format a table for object values", () => {
    const headers = ["h1", "h2", "h3"];
    const rows = [
      [{ r1: "v11" }, { r1: "v12" }, { r1: "v13" }],
      [{ r1: "v21" }, { r1: "v22" }, { r1: "v23" }],
      [{ r1: "v31" }, { r1: "v32" }, { r1: "v33" }],
      [{ r1: "vLong1" }, { r1: "vLong2" }, { r1: "v33" }],
      [{ r1: "v51" }, { r1: "v52" }, { r1: "v533333333333" }],
    ];
    const expected = `h1     | h2     | h3           
------ | ------ | -------------
v11    | v12    | v13          
v21    | v22    | v23          
v31    | v32    | v33          
vLong1 | vLong2 | v33          
v51    | v52    | v533333333333`;
    const result = formatTable(headers, rows, "r1");
    expect(result).toBe(expected);
  });
});
