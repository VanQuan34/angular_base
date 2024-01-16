declare var require: any
var tinycolor = require("tinycolor2");

class Utils {

  /**
   * return copy object
   * @param obj 
   */
  static copyObject(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * remove accents string
   * @param str 
   * @returns 
   */
  static toNormalize(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

   /**
   * return true if has difference
   * @param rect1 
   * @param rect2 
   */
   static checkDifferentRect(rect1: DOMRect, rect2: DOMRect) {
    // console.log('checkDifferentRect rect1=', rect1, ' rect2=', rect2);
    if (!rect1 || !rect2) {
      return true;
    }
    const x1 = rect1.x;
    const x2 = rect2.x;
    const y1 = rect1.y;
    const y2 = rect2.y;
    const w1 = rect1.width;
    const w2 = rect2.width;
    const h1 = rect1.height;
    const h2 = rect2.height;

    if (x1 !== x2) {
      // console.log('diff x1=',x1, 'x2=',x2);
      return true;
    }

    if (y1 !== y2) {
      // console.log('diff y1=',y1, 'y2=',y2);
      return true;
    }

    if (w1 !== w2) {
      // console.log('diff w1=',w1, 'w2=',w2);
      return true;
    }

    if (h1 !== h2) {
      // console.log('diff h1=', h1, 'h2=',h2);
      return true;
    }
    // console.log('no diff');
    return false;
  }

  static isNumeric(str: any): boolean {
    if (typeof str != "string") {
      return false // we only process strings!  
    }  
    return !isNaN(parseFloat(str));
  }

  /**
   * build theme
   * @param color 
   * @returns 
   */
  static buildRootColor(color: string) {
    let genColor = [
      {
        b: 20,
        w: 0
      },
      {
        b: 0,
        w: 20
      },
      {
        b: 0,
        w: 90
      },
      {
        b: 0,
        w: 95
      },
      {
        b: 0,
        w: 50
      },
      {
        b: 0,
        w: 70
      },
      {
        b: 0,
        w: 80
      }
    ]
    const colors = Utils.genColorPalettes(color, '1', genColor);
    const colorNames = ['--pri', '--pri-d', '--pri-l1', '--pri-l2', '--pri-l3', '--pri-l4', '--pri-l5', '--pri-l6'];
    let styles = '<style> :root {';
    let colorCode: any = {};
    for (let i=0; i < colors.length; i++) {
      const itemColor = colors[i];
      styles += `${colorNames[i]} : ${itemColor.hex} ;`;
      colorCode[colorNames[i]] = itemColor.hex;
    }
    styles += ' } </style>';
    localStorage.setItem('FILE_MANAGER_THEME', JSON.stringify(colorCode));
    document.body.insertAdjacentHTML('beforebegin', styles);
    return styles;
  }

  /**
   * generate color palettes
   * @param color 
   * @param id 
   * @returns 
   */
  static genColorPalettes(color: string, id: string, gens: {b: number, w: number}[] = []) {
    const rgb = tinycolor(color).toRgb();
    let colors : any[] = [];
    gens = gens.length ? gens :  
    [
      {
        b: 20,
        w: 0
      },
      {
        b: 0,
        w: 20
      },
      {
        b: 0,
        w: 50
      },
      {
        b: 0,
        w: 90
      },
      {
        b: 0,
        w: 95
      }
    ];
    
    let _colors : string[] = [color];
    for(let i=0; i < gens.length; i++) {
      const gen = gens[i];
      let _color = color;
      let _r = rgb.r;
      let _g = rgb.g;
      let _b = rgb.b;
      
      if (gen.b) {
        _r -= Math.ceil(_r*gen.b/100);
        _g -= Math.ceil(_g*gen.b/100);
        _b -= Math.ceil(_b*gen.b/100);
      }
      if (gen.w) {
        _r += Math.ceil((255 - _r)*gen.w/100);
        _g += Math.ceil((255 - _g)*gen.w/100);
        _b += Math.ceil((255 - _b)*gen.w/100);
      }
      _color = tinycolor(`rgb(${_r},${_g},${_b})`).toHex();
      _colors.push(`#${_color}`);
    }

    colors = _colors;

    colors = colors.map((_color: any, index: number) => {
      return {
        id: `--${id}${index+1}`,
        rgb: Utils.hexToRgb(`${_color}`),
        hex: `${_color}`,
        isDark: !tinycolor(`${_color}`).isLight()
      }
    });

    return colors;
  }

  static hexToRgb = (hexColor: string) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    if (!result) {
      return '';
    }

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return r + "," + g + "," + b;
  }

}

export {
  Utils
}