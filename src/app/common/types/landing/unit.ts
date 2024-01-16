const enum UnitKey {
  px = 'px',
  per = '%',
  vh = 'vh',
  vw = 'vw',
  minC = 'min-content',
  maxC = 'max-content',
  minMax = 'minmax',
  none = 'none',
  auto = 'auto',
  fr = 'fr',
  line = 'line'
};

interface IUnit {
  key: UnitKey,
  value: string,
  label: string,
  title: string
}

const Units: any = {
  'px': {
    key: 'px',
    value: 'px',
    label: 'px',
    title: 'Pixel(px)',
  },

  '%': {
    key: '%',
    value: '%',
    label: '%',
    title: 'Phần trăm(%)'
  },

  'vh': {
    key: 'vh',
    value: 'vh',
    label: 'vh',
    title: 'Chiều cao cổng nhìn(vh)'
  },

  'vw': {
    key: 'vw',
    value: 'vw',
    label: 'vw',
    title: 'Chiều rộng cổng nhìn(vw)'
  },

  'min-content': {
    key: 'min-content',
    label: 'min-c',
    value: 'min-content',
    title: 'Nội dung tối thiểu(min-c)'
  },

  'max-content': {
    key: 'max-content',
    label: 'max-c',
    value: 'max-content',
    title: 'Nội dung tối đa(max-c)'
  },

  'minmax': {
    key: 'minmax',
    label: 'minmax',
    value: 'minmax',
    title: 'Tối thiểu / Tối đa'
  },

  'fr': {
    key: 'fr',
    label: 'fr',
    value: 'fr',
    title: 'Phân số(fr)'
  },

  'auto': {
    key: 'auto',
    label: 'Tự động',
    value: 'auto',
    title: 'Tự động'
  },

  'none': {
    key: 'none',
    label: 'Không',
    value: 'unset',
    title: 'Không'
  },

  'line' : {
    key: 'divider',
    label: 'Không',
    value: 'none',
    title: 'Không'
  },

  '°'  : {
    key: '°',
    label: '°',
    value: '°',
    title: '°'
  }
}

interface IUnitInfoItem {
  value: any,
  unit: string
}
interface IUnitInfo {
  value: any,
  valuePx?: number,
  unit: string,
  min?: IUnitInfoItem,
  max?: IUnitInfoItem
}

export {
  IUnit,
  Units,
  UnitKey,
  IUnitInfo
}