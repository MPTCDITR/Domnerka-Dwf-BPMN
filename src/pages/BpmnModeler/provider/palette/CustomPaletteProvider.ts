type Palette = import('diagram-js/lib/features/palette/Palette').default;

/* eslint-disable @typescript-eslint/no-explicit-any */
export default class CustomPaletteProvider {
  static $inject: string[];

  constructor(palette: Palette) {
    palette.registerProvider(this);
  }

  /**
   * @return
   */
  getPaletteEntries() {
    return function (entries: any) {
      delete entries['create.data-store'];
      delete entries['create.data-object'];
      delete entries['create.group'];
      delete entries['create.data-store'];
      delete entries['create.subprocess-expanded'];
      return entries;
    };
  }
}

CustomPaletteProvider.$inject = ['palette'];
