export class Presentation {

  /**
   * Title of the presentation.
   */
  title: string;

  /**
   *
   * @param title Title of the presentation.
   */
  constructor(title: string) {
    this.title = title;
  }

  present() {
    document.title = this.title;
  }
}
