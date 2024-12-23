import { generateTextNodes } from "../util/richText";
import { Text, TextContent } from "./text";

jest.mock("../util/richText", () => ({
  generateTextNodes: jest.fn(),
}));

describe("contentLength", () => {
  test.each<{ name: string; content: TextContent; length: number }>([
    { name: "empty string", content: "", length: 0 },
    { name: "non-empty string", content: "Hello, world!", length: 13 },
    {
      name: "multi-line string",
      content: ["hello", "example", "testing"],
      length: 19,
    },
    {
      name: "multi-line string with spans",
      content: [
        ["hello ", "world"],
        "example",
        ["testing", "one", "two", "three"],
      ],
      length: 36,
    },
    {
      name: "multi-line string with rich text",
      content: [
        ["hello ", ["world", { fontSize: 20 }]],
        "example",
        ["testing", "one", ["two", { color: "#ff0000" }], "three"],
      ],
      length: 36,
    },
  ])("$name", ({ content, length }) => {
    const textObject = new Text(content);
    expect(textObject.contentLength()).toBe(length);
  });
});

describe("childrenWithContentLength", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Testing simple strings and verifying that content length is trimmed.
  test.each([
    { length: 0, result: "" },
    { length: 5, result: "Hello" },
    { length: null, result: "Hello, world!" },
  ])("simple string with content length $length", ({ length, result }) => {
    const textObject = new Text("Hello, world!");
    const nodes = textObject.childrenWithContentLength(length);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].nodeValue).toBe(result);
  });

  test.each<{
    name: string;
    content: TextContent;
    length: number;
    result: TextContent;
  }>([
    {
      name: "multi-line string, no length",
      content: ["line one", "line two"],
      length: 0,
      result: [""],
    },
    {
      name: "multi-line string, within a line",
      content: ["line one", "line two"],
      length: 6,
      result: ["line o"],
    },
    {
      name: "multi-line string, crossing multiple lines",
      content: ["line one", "line two"],
      length: 9,
      result: ["line one", "l"],
    },
    {
      name: "multi-line string with spans, within one line",
      content: [
        ["test", "one", "two"],
        ["three", "four", "five"],
      ],
      length: 8,
      result: [["test", "one", "t"]],
    },
    {
      name: "multi-line string with spans, crossing multiple lines",
      content: [
        ["test", "one", "two"],
        ["three", "four", "five"],
      ],
      length: 17,
      result: [
        ["test", "one", "two"],
        ["three", "fo"],
      ],
    },
    {
      name: "multi-line string with rich text, crossing multiple lines",
      content: [
        ["test", ["one", { fontSize: 28 }], "two"],
        ["three", ["four", { color: "#282828" }], "five"],
      ],
      length: 17,
      result: [
        ["test", ["one", { fontSize: 28 }], "two"],
        ["three", ["fo", { color: "#282828" }]],
      ],
    },
  ])("$name", ({ content, length, result }) => {
    const textObject = new Text(content);
    textObject.childrenWithContentLength(length);
    expect(generateTextNodes).toHaveBeenCalledTimes(1);
    expect(generateTextNodes).toHaveBeenCalledWith(
      result,
      expect.anything(),
      expect.anything(),
    );
  });
});
