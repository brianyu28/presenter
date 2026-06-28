import { NotesEntry } from "../types/NotesEntry";

interface GetTypstDocumentProps {
  readonly author: string | null;
  readonly description: string | null;
  readonly entries: NotesEntry[];
  readonly slideWidth: number;
  readonly title: string;
}

export function getTypstDocument({
  author,
  description,
  entries,
  slideWidth,
  title,
}: GetTypstDocumentProps): string {
  const documentAuthor = author === null ? "none" : toTypstString(author);
  const documentDescription = description ?? getCurrentRenderDate();
  const metadataAuthor = author === null ? "" : `\n    author: (${toTypstString(author)},),`;
  const slideWidthPercentage = Number((slideWidth * 100).toFixed(4));

  return `#let document-title = ${toTypstString(title)}
#let document-author = ${documentAuthor}
#let document-description = ${toTypstString(documentDescription)}

#let body = [
  #set page(
    margin: (top: 1cm, bottom: 1.5cm, x: 1cm),
    footer: context [
      #align(right)[#text(size: 9pt)[Page #counter(page).display("1 of 1", both: true)]]
    ],
  )

  #let notes-entry(image-path, caption, title: none, notes: none) = block(
    breakable: false,
    width: 100%,
  )[
    #grid(
      columns: (${slideWidthPercentage}%, 1fr),
      gutter: 1cm,
      align: top,
      stack(
        dir: ttb,
        spacing: 4pt,
        image(image-path, width: 100%),
        text(size: 9pt, fill: rgb("4b5563"), caption),
      ),
      if title == none and notes == none { [] } else {
        pad(top: 3pt)[
          #if title != none { strong(title) }
          #if title != none and notes != none { v(0.7em) }
          #if notes != none { text(notes) }
        ]
      },
    )
  ]

  #block(width: 100%)[
    #text(size: 20pt, weight: "bold", document-title)
    #if document-author != none {
      linebreak()
      text(size: 11pt, document-author)
    }
    #linebreak()
    #text(size: 10pt, fill: rgb("4b5563"), document-description)
  ]
  #v(1.5em)

  ${entries.map(getEntryMarkup).join("\n#v(1em)\n\n")}
]

// Typst added description metadata in 0.13. Keep the document compatible with older compilers.
#if sys.version >= version(0, 13, 0) {
  set document(
    title: document-title,${metadataAuthor}
    description: document-description,
  )
  body
} else {
  set document(
    title: document-title,${metadataAuthor}
  )
  body
}
`;
}

function getEntryMarkup({ caption, imageFilename, notes, title }: NotesEntry): string {
  const titleArgument = title === null ? "" : `, title: ${toTypstString(title)}`;
  const notesArgument = notes === null ? "" : `, notes: ${toTypstString(notes)}`;
  return `#notes-entry(${toTypstString(imageFilename)}, ${toTypstString(caption)}${titleArgument}${notesArgument})`;
}

function getCurrentRenderDate(): string {
  return new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toTypstString(value: string): string {
  return JSON.stringify(value);
}
