interface IZIndex {
  editor: {
    base: number,
    layer: number,
    toolbar: number,
    inspector: number,
    richText: number
  },
  toolbar: number,
  topBar: number,
  popup: number,
  modal: number,
  color: number,
  dropdown: number,
  progress: number,
  notify: number
}
const baseZIndex: number = 3000;
const ZIndex: IZIndex = {
  editor: {
    base: baseZIndex,
    layer: baseZIndex + 1000,
    toolbar: baseZIndex + 2000,
    inspector: baseZIndex + 3000,
    richText: baseZIndex + 4000,
  },
  toolbar: baseZIndex + 5000,
  topBar: baseZIndex + 5000,
  modal: baseZIndex + 6000,
  popup: baseZIndex + 6000,
  color: baseZIndex + 8000,
  dropdown: baseZIndex + 9000,
  progress: baseZIndex + 10000,
  notify: baseZIndex + 11000,
}

export {
  ZIndex
}