import * as moment from 'moment';
import { omitBy, isNil } from 'lodash';
import { DefinePattern } from './pattern.define';
import SimpleCrypto from 'simple-crypto-js';
import { Router } from '@angular/router';
import { CacheKeys } from 'src/app/common/define/cache-keys.define';
import { LANGUAGE, CURRENT_LANG } from './language.define';
import { CacheService } from '../../api/common/cache.service';
import { WheelZoomOption } from './wheel-zoom-option';
import { IDateRange } from '../../components/date-picker/api/date-range';

export class DefineFunction {
  static lockRedirectUrl = false;

  static convertObjectOfArray(objectPattern: any, data: Array<any>, dataDefault?: any) { // demo trong file language.define.ts
    if (!objectPattern || !Object.keys(objectPattern).length) {
      return data;
    }
    return data.map(item => {
      return this.convertObject(objectPattern, item, dataDefault);
    });
  }

  static convertObject(objectPattern: any, data: any, dataDefault?: any) { // dữ liệu đầu vào là object
    if (!objectPattern || !Object.keys(objectPattern).length) {
      return data;
    }
    const keys = Object.keys(objectPattern);
    const objectConvert: any = {};
    keys.forEach((key => {
      const valKey = objectPattern[key];
      if (!valKey || !(typeof valKey === 'string')) {
        return;
      }
      const keysObject: Array<string> = valKey.split('.');
      objectConvert[key] = this.getDataObject(keysObject, data, dataDefault);
    }));
    return objectConvert;
  }

  private static getDataObject(keysObject: Array<string>, object: any, dataDefault: any) {
    let value = object;
    const length = keysObject.length;
    for (let i = 0; i < length; i++) {
      const key = keysObject[i];
      if (!key) {
        return undefined;
      }
      if (!value[key]) {
        if (i === length - 1 && dataDefault) {
          return dataDefault[key];
        }
        return undefined;
      }
      value = value[key];
    }
    return value;
  }


  static mergeObject(objCopyFrom: any, objCopyTo: any, mixField?: boolean) {
    if (!objCopyFrom || !objCopyTo) {
      return;
    }
    const keys = Object.keys(objCopyTo);
    keys.forEach(key => {
      objCopyTo[key] = objCopyFrom[key];
    });

    if (!mixField) {
      return;
    }
    const keysObjFrom = Object.keys(objCopyFrom);
    keysObjFrom.forEach(keyObjFrom => {
      if (!keys.find(KeyObjTo => KeyObjTo === keyObjFrom)) {
        objCopyTo[keyObjFrom] = objCopyFrom[keyObjFrom];
      }
    });
  }

  static mergeArray(arr1: Array<any>, arr2: Array<any>, key?: string) {
    if (!arr1) {
      arr1 = [];
    }
    if (!arr2 || !arr2.length) {
      return arr1;
    }

    arr1.forEach(item1 => {
      const result = arr2.find(item2 => {
        if (key) {
          return item1[key] === item2[key];
        }
        return (item1['key'] || item1['id']) === (item2['key'] || item2['id']);
      });
      if (!result) {
        arr2.push(item1);
      }
    });

    return arr2;
  }

  static compareObject(obj1: any, obj2: any): boolean {
    const str1 = JSON.stringify(obj1);
    const str2 = JSON.stringify(obj2);
    return str1 === str2;
  }

  static compareArrayObjByMultiField(arr1: Array<any>, arr2: Array<any>, fields: string): boolean {
    if (!arr1 && !arr2 || !arr1.length && !arr2.length) {
      return true;
    }

    if (!arr1 || !arr2 || !fields || !fields.length) {
      return false;
    }

    for (const field of fields) {
      if (!this.compareArrayObjByField(arr1, arr2, field)) {
        return false;
      }
    }
    return true;
  }

  static compareArrayObjByField(arr1: Array<any>, arr2: Array<any>, field: string): boolean {
    if (!arr1 && !arr2 || !arr1.length && !arr2.length) {
      return true;
    }

    if (!arr1 || !arr2 || !field) {
      return false;
    }

    for (const obj1 of arr1) {
      if (!arr2.find(obj2 => obj2[field] === obj1[field])) {
        return false;
      }
    }
    
    for (const obj2 of arr2) {
      if (!arr1.find(obj1 => obj2[field] === obj1[field])) {
        return false;
      }
    }
    return true;
  }

  static base64Encode(value: string) {
    return btoa(DefineFunction.encodeURI(value));
  }

  static encodeURI(value: string) {
    return encodeURIComponent(value).replace(DefinePattern.ENCODE_URI, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    });
  }

  static base64Decode(value: string) {
    return DefineFunction.decodeURI(atob(value));
  }

  static decodeURI(value: any) {
    return decodeURIComponent(value.split('').map((c: any) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  public static endCodeUrl(params: any, isBody: boolean): String {
    params = omitBy(params, param => param === '' || isNil(param));
    let res = '';
    for (const p in params) {
      res += `&${p}=${encodeURIComponent(params[p])}`;
    }
    return res === '' ? '' : `${isBody ? '' : '?'}${res.substring(1)}`;
  }

  static formatNumberValue(value: number, acceptNegativeValue: boolean, parseFixed: number = 1): any {
    const lang = CURRENT_LANG();
    if (value === undefined || typeof value !== 'number' || (!acceptNegativeValue && value <= 0)) {
      return 0;
    }
    value = parseFloat(value.toFixed(parseFixed));
    // Xử lý không format dữ liệu phần thập phân
    const valueString = value.toString();
    const index = valueString.indexOf('.');
    if (index !== -1 && parseFixed > 3) {
      const decimalPart = valueString.substring(index + 1, valueString.length);
      let int = valueString.substring(0, index + 1);
      if (lang === LANGUAGE.EN) {
        int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${int}${decimalPart}`;
      }
      int = int.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return `${int}${decimalPart}`;
    }
    if (index === -1 || parseFixed <= 3) {
      if (lang === LANGUAGE.EN) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return value.toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
  }

  static validateMail(value: string) {
    return DefinePattern.EMAIL.test(value);
  }

  static validateNumbers(value: string) {
    return DefinePattern.NUMBER.test(value);
  }

  static validateUrl(value: string) {
    return DefinePattern.URL.test(value);
  }

  static validatePhoneNumber(phoneNumber: string) {
    return DefinePattern.PHONE.test(phoneNumber);
  }

  static phoneFormatDisplay(phone: string, numberHidden?: number): string {
    if (!phone || !DefinePattern.PHONE.test(phone)) {
      return `${phone}`;
    }
    let numberOfHidden: number = CacheService.Get('', 0);
    if (numberHidden) {
      numberOfHidden = numberHidden;
    }
    if (!numberOfHidden || numberOfHidden > 9) {
      if (phone.substr(0, 2) === '84') {
        return phone.replace('84', '0');
      }
      if (phone.substr(0, 3) === '+84') {
        return phone.replace('+84', '0');
      }
      return phone;
    }

    const patternStart = numberOfHidden === 9 ? '0xx' : numberOfHidden === 8 ? '0$2x' : '0$2$3';
    let patternEnd = '';
    for (let i = 1; i <= 7; i++) {
      if (i <= numberOfHidden) {
        patternEnd = `${patternEnd}x`;
        continue;
      }
      patternEnd = `${patternEnd}$${i + 3}`;
    }

    return phone.replace(DefinePattern.PHONE, `${patternStart}${patternEnd}`);
  }

  static convertNewHeadPhoneNumerVN(phone_number: string, headerPhone?: string) {
    let res = phone_number;
    res = res.replace(/^(0|\+84|84)12([068])/gi, `$17$2`);
    res = res.replace(/^(0|\+84|84)121/, `$179`);
    res = res.replace(/^(0|\+84|84)122/, `$177`)
    res = res.replace(/^(0|\+84|84)12([345])/, `$18$2`);
    res = res.replace(/^(0|\+84|84)127/, `$181`);
    res = res.replace(/^(0|\+84|84)129/, `$182`);
    res = res.replace(/^(0|\+84|84)16([2-9])/, `$13$2`);
    res = res.replace(/^(0|\+84|84)18([68])/, `$15$2`);
    res = res.replace(/^(0|\+84|84)199/, `$159`);
    if (headerPhone) {
      res = res.replace(/^(0|\+84|84)/, headerPhone);
    }
    return res;
  }

  static emailFormatDisplay(email: string): string {
    if (!email || !DefinePattern.EMAIL.test(email)) {
      return `${email}`;
    }
    const numberOfHidden = CacheService.Get('', 0);
    if (!numberOfHidden) {
      return email;
    }

    if (email.lastIndexOf('@') < numberOfHidden) {
      return email;
    }

    const star = Array(numberOfHidden).fill('x').join('');
    const pattern: RegExp = new RegExp(`([A-Za-z0-9._-]{1,${numberOfHidden}}@)`);
    return email.replace(pattern, `${star}@`);
  }

  static get DefaultRangeDatePicker(): IDateRange {
    const dateDefault = DefineFunction.setPointStartAndEndTime(moment().subtract(29, 'days'), moment(), true);
    return {
      ...dateDefault,
      label: ''
    };
  }

  static setPointStartAndEndTime(start: any, end: any, isResponseObject?: boolean): any { // mặc định trả về  kiểu Array
    if (start) {
      start.set('hour', 0);
      start.set('minute', 0);
      start.set('millisecond', 0);
    }

    if (end) {
      end.set('hour', 23);
      end.set('minute', 59);
      end.set('millisecond', 0);
    }

    if (isResponseObject) {
      return { start, end };
    }

    return [start, end];
  }

  static convertCitationVietnameseUnsigned(words: string) {
    if (!words || !words.trim()) {
      return '';
    }

    const wordsSplit = words.split(' ');
    const citationConvert = new Array();
    wordsSplit.forEach(word => {
      citationConvert.push(DefineFunction.convertWordVietnameseUnsigned(word));
    });

    return citationConvert.join(' ');
  }

  static convertWordVietnameseUnsigned(word: string) {
    word = word.toLocaleLowerCase();
    word = word.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    word = word.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    word = word.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    word = word.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    word = word.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    word = word.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    word = word.replace(/đ/g, 'd');
    return word;
  }

  static replacePersonalizeText(personalize: Array<any>, textsChange: Array<any>, textTemp: string) {

    if (personalize.length > 0) {
      personalize.forEach(element => {
        textsChange.forEach(text => {
          if (element.key.toLowerCase() === text.key.toLowerCase()) {
            textTemp = textTemp.split(element.key).join(text.value);
          }
        });
      });
    }
    return textTemp;
  }

  static removeEmoji(text: string) {
    if (!text || !text.trim()) {
      return text;
    }
    return text.replace(DefinePattern.EMOJI, '');
  }

  static encrypt(plainData: string): string {
    const simpleCrypto = new SimpleCrypto('');
    const chipperText = simpleCrypto.encrypt(plainData);
    return chipperText;
  }

  static decrypt(encryptedData: string): string {
    const simpleCrypto = new SimpleCrypto('');
    const decipherText = simpleCrypto.decrypt(encryptedData);
    try {
      return JSON.stringify(decipherText);
    } catch(ex) {
      return decipherText.toString();
    };
  }

  static isResponse401(err: any): boolean {
    if (err && err.status === 401) {
      return DefineFunction.redirectToLogin();
    }
    return false;
  }

  static redirectToLogin(router?: Router): boolean {
    CacheService.ClearAll();
    if (window.location.pathname.includes('login')) {
      return false;
    }
    // CacheService.Set(CacheKeys.KEY_CACHE_PAGE_PREVIOUS, window.location.href, CacheService.CACHE_EXPIRE_NONE);
    if (router) {
      router.navigateByUrl('/login');
      return true;
    }
    window.location.href = '/login';
    return true;
  }

  static exportInterface(name: string, object: any): string {
    const fields = Object.keys(object);
    let interfaceExport = `export interface I${name}{`;
    fields.forEach(item => {
      switch (typeof object[item]) {
        case 'string':
          interfaceExport = `${interfaceExport}\n${item}?: string;`;
          break;
        case 'number':
          interfaceExport = `${interfaceExport}\n${item}?: number;`;
          break;
        case 'boolean':
          interfaceExport = `${interfaceExport}\n${item}?: boolean;`;
          break;
        case 'function':
          interfaceExport = `${interfaceExport}\n${item}?: Function;`;
          break;
        case 'object':
          if (object[item] === null || object[item] === undefined) {
            interfaceExport = `${interfaceExport}\n${item}?: any;`;
            break;
          }

          if (Array.isArray(object[item])) {
            interfaceExport = `${interfaceExport}\n${item}?: Array<any>;`;
            break;
          }
          interfaceExport = `${interfaceExport}\n${item}?: object;`;
          break;
        default:
          interfaceExport = `${interfaceExport}\n${item}?: any;`;
      }
    });
    interfaceExport = `${interfaceExport}\n}`;
    return interfaceExport;
  }

  static deleteUnicode(str: string) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    return str;
  }

  static displayRuleLanguage(dataLanguage: string, allowMultiLang?: boolean) {
    const langDefault = LANGUAGE.LANGUAGE_CMS_SUPPORT();
    const langCurrent = CURRENT_LANG();
    if (!langDefault || typeof dataLanguage !== 'object' || !dataLanguage) {
      return '&mdash;';
    }
    if (!allowMultiLang) {
      return dataLanguage[langDefault[0]];
    }
    for (const key of Object.keys(dataLanguage)) {
      if (key === langCurrent) {
        return dataLanguage[key];
      }
      if (key === langDefault[0]) {
        return dataLanguage[key];
      }
      if (key.includes(langDefault)) {
        return dataLanguage[key];
      }
    }
    return '&mdash;';
  }

  static getParamsName(func: any) {
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    return result || [];
  }



  static wheelZoomImage(img: any, options: WheelZoomOption) {
    if (!img || !img.nodeName || img.nodeName !== 'IMG') {
      return;
    }
    img.style.cursor = 'zoom-in';
    const srcRoot = img.src;
    const defaults = {
      zoom: 0.10,
      maxZoom: false,
      initialZoom: 1,
      initialX: 0.5,
      initialY: 0.5,
    };
    const settings: any = {};
    let width: any;
    let height: any;
    let bgWidth: any;
    let bgHeight: any;
    let bgPosX: any;
    let bgPosY: any;
    let previousEvent: any;
    let transparentSpaceFiller: any;

    const setSrcToBackground = (imgTag: any) => {
      imgTag.style.backgroundRepeat = 'no-repeat';
      imgTag.style.backgroundImage = 'url("' + imgTag.src + '")';
      transparentSpaceFiller = 'data:image/svg+xml;base64,' + window.btoa('<svg xmlns="http://www.w3.org/2000/svg" width="' + imgTag.naturalWidth + '" height="' + imgTag.naturalHeight + '"></svg>');
      imgTag.src = transparentSpaceFiller;
    };

    const updateBgStyle = () => {
      if (bgPosX > 0) {
        bgPosX = 0;
      } else if (bgPosX < width - bgWidth) {
        bgPosX = width - bgWidth;
      }

      if (bgPosY > 0) {
        bgPosY = 0;
      } else if (bgPosY < height - bgHeight) {
        bgPosY = height - bgHeight;
      }

      img.style.backgroundSize = bgWidth + 'px ' + bgHeight + 'px';
      img.style.backgroundPosition = bgPosX + 'px ' + bgPosY + 'px';
    };

    const reset = () => {
      bgWidth = width;
      bgHeight = height;
      bgPosX = bgPosY = 0;
      updateBgStyle();
    };

    const onwheel = (e: any) => {
      let deltaY = 0;
      e.preventDefault();
      if (e.deltaY) { // FireFox 17+ (IE9+, Chrome 31+?)
        deltaY = e.deltaY;
      } else if (e.wheelDelta) {
        deltaY = -e.wheelDelta;
      }

      // As far as I know, there is no good cross-browser way to get the cursor position relative to the event target.
      // We have to calculate the target element's position relative to the document, and subtrack that from the
      // cursor's position relative to the document.
      const rect = img.getBoundingClientRect();
      const offsetX = e.pageX - rect.left - window.pageXOffset;
      const offsetY = e.pageY - rect.top - window.pageYOffset;

      // Record the offset between the bg edge and cursor:
      const bgCursorX = offsetX - bgPosX;
      const bgCursorY = offsetY - bgPosY;

      // Use the previous offset to get the percent offset between the bg edge and cursor:
      const bgRatioX = bgCursorX / bgWidth;
      const bgRatioY = bgCursorY / bgHeight;

      // Update the bg size:
      if (deltaY < 0) {
        bgWidth += bgWidth * settings.zoom;
        bgHeight += bgHeight * settings.zoom;
      } else {
        bgWidth -= bgWidth * settings.zoom;
        bgHeight -= bgHeight * settings.zoom;
      }

      if (settings.maxZoom) {
        bgWidth = Math.min(width * settings.maxZoom, bgWidth);
        bgHeight = Math.min(height * settings.maxZoom, bgHeight);
      }

      // Take the percent offset and apply it to the new size:
      bgPosX = offsetX - (bgWidth * bgRatioX);
      bgPosY = offsetY - (bgHeight * bgRatioY);

      // Prevent zooming out beyond the starting size
      if (bgWidth <= width || bgHeight <= height) {
        reset();
      } else {
        updateBgStyle();
      }
    };

    const drag = (e: any) => {
      e.preventDefault();
      bgPosX += (e.pageX - previousEvent.pageX);
      bgPosY += (e.pageY - previousEvent.pageY);
      previousEvent = e;
      updateBgStyle();
    };

    const removeDrag = () => {
      document.removeEventListener('mouseup', removeDrag);
      document.removeEventListener('mousemove', drag);
    };

    // Make the background draggable
    const draggable = (e: any) => {
      e.preventDefault();
      previousEvent = e;
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', removeDrag);
    };

    const load = () => {
      const initial = Math.max(settings.initialZoom, 1);

      if (img.src === transparentSpaceFiller) {
        return;
      }

      const computedStyle = window.getComputedStyle(img, null);

      width = parseInt(computedStyle.width, 10);
      height = parseInt(computedStyle.height, 10);
      bgWidth = width * initial;
      bgHeight = height * initial;
      bgPosX = -(bgWidth - width) * settings.initialX;
      bgPosY = -(bgHeight - height) * settings.initialY;

      setSrcToBackground(img);

      img.style.backgroundSize = bgWidth + 'px ' + bgHeight + 'px';
      img.style.backgroundPosition = bgPosX + 'px ' + bgPosY + 'px';
      img.addEventListener('wheelzoom.reset', reset);

      img.addEventListener('wheel', onwheel);
      img.addEventListener('mousedown', draggable);
      img.addEventListener('mouseleave', () => {
        img.src = srcRoot;
      });
    };

    options = options || {};
    // Object.keys(defaults).forEach(function (key) {
    //   settings[key] = options[key] !== undefined ? options[key] : defaults[key];
    // });

    if (img.complete) {
      load();
    }
  }

  // merchant_types: do phía BE cấu hình trả về
  // key_function: key cấu hình hiển thị các phần trong config web với các loại merchant_type
  static checkDisplayByMerchantType(merchant_types: Array<string>, functions_merchant: Array<string>) {
    let active = false;
    if (!merchant_types || !merchant_types.length) {
      return active;
    }

    const types = new Map<string, any>();
    merchant_types.forEach(item => {
      types.set(item, true);
    });

    if (!functions_merchant || !functions_merchant.length) {
      return active;
    }

    functions_merchant.forEach(item => {
      if (!types.get(item)) {
        return;
      }
      active = true;
    });
    return active;
  }
}
