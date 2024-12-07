export interface Theme {
  backgroundColor: string;
  text: {
    /** Mapping from font labels (e.g. "primary", "secondary") to font names. */
    fonts: Partial<Record<string, string>>;
  };
}
