export default class Note {
  private readonly _noteSize: number;
  private readonly _label: string;
  private readonly _isTriplet: boolean;
  private readonly _note: string;

  constructor(noteSize: number, isTriplet: boolean) {
    this._noteSize = noteSize;
    this._isTriplet = isTriplet;
    this._label = `${noteSize !== 1 ? `1/${noteSize}` : `${noteSize}`}${isTriplet ? "T" : ""}`;
    this._note = `${noteSize}${isTriplet ? "t" : "n"}`;
  }

  get noteSize(): number {
    return this._noteSize;
  }

  get label(): string {
    return this._label;
  }

  get isTriplet(): boolean {
    return this._isTriplet;
  }

  get note(): string {
    return this._note;
  }
}
