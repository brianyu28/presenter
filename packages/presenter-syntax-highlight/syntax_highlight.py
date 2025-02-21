"""
Presenter.js Syntax Highlighter

A script that takes source code and generates a syntax highlighting JSON file.
"""

import json
import sys

from pygments import highlight
from pygments.formatter import Formatter
from pygments.lexers import get_lexer_for_filename

INCLUDE_BOLDING = False


def main():
    filename = sys.argv[1]
    highlights = CodeSyntaxHighlighter.format_file(filename, style="github-dark")

    output_filename = f"{filename}.highlight.json"
    with open(output_filename, "w") as outfile:
        json.dump(highlights, outfile, indent=2)
    print(f"Syntax highlighting saved to {output_filename}")


class CodeSyntaxHighlighter(Formatter):
    """
    Runs Pygments syntax highlighting on a file.
    """

    def __init__(self, **options):
        Formatter.__init__(self, **options)
        self.styles = {}
        for token, style in self.style:
            self.styles[token] = style

    def format(self, tokensource, outfile):
        next_start = 0
        for ttype, value in tokensource:
            style = self.styles[ttype]
            start = next_start
            end = start + len(value) - 1
            next_start = end + 1
            color = f"#{style['color']}"

            bold = 1 if style.get("bold") == True and INCLUDE_BOLDING else 0
            outfile.write(f"{start},{end},{color},{bold}\n")

    @classmethod
    def format_file(cls, filename, style=None):
        """
        Return character level styling for text via syntax highlighting.

        Style options:
        - default
        - sas (light mode)
        - github-dark (dark mode)
        """
        if style is None:
            style = "default"
        lexer = get_lexer_for_filename(filename)
        formatter = cls(style=style)
        contents = open(filename).read().strip()
        result = highlight(contents, lexer, formatter)

        # Get highlights as character offsets in file
        highlights = []
        for row in result.splitlines():
            values = row.split(",")
            highlights.append(
                {
                    "start": int(values[0]),
                    "end": int(values[1]),
                    "color": values[2],
                    "bold": int(values[3]) == 1,
                }
            )

        # Compute highlights as character offsets per-line
        lines = contents.split("\n")
        line_index = 0
        line_highlights = [[]]

        # Starting index of the current line
        character_index = 0

        while True:
            # Get the next highlighted region.
            # If there are no more, we're done.
            try:
                region = highlights.pop(0)
            except IndexError:
                break

            highlight_start = region["start"] - character_index
            highlight_end = region["end"] - character_index

            # If highlight is the newline at end of line, skip
            if highlight_start == len(lines[line_index]) and highlight_end == len(lines[line_index]):
                line_index += 1
                line_highlights.append([])
                character_index += len(lines[line_index - 1]) + 1
                continue

            # If highlight is out-of-bounds, we must move on to the next line
            if highlight_start < 0 or highlight_end >= len(lines[line_index]):
                # Use as many characters as we can on this line
                line_highlights[line_index].append({
                    "start": highlight_start + 1,
                    "end": len(lines[line_index]),
                    "content": lines[line_index][highlight_start:],
                    "color": region["color"],
                    "bold": region["bold"],
                })

                # The remaining characters must move on to the next line.
                # We add one to include the newline character.
                remaining = highlight_end - (len(lines[line_index]) + 1)
                highlights.insert(0, {
                    "start": region["end"] - remaining,
                    "end": region["end"],
                    "color": region["color"],
                    "bold": region["bold"],
                })

                line_index += 1
                line_highlights.append([])
                character_index += len(lines[line_index - 1]) + 1
                continue

            # Add the highlight configuration.
            # The "content" field is ignored by Presenter.js, but is useful for debugging.
            line_highlights[line_index].append({
                "start": highlight_start + 1,
                "end": highlight_end + 1,
                "content": lines[line_index][highlight_start:highlight_end + 1],
                "color": region["color"],
                "bold": region["bold"],
            })

        # Remove trailing newlines
        if len(line_highlights[-1]) == 0:
            line_highlights.pop()

        return line_highlights


if __name__ == "__main__":
    main()
