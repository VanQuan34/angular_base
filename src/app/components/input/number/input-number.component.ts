import {
  Component, EventEmitter, ViewChild, SimpleChanges,
  Output, Input, ElementRef, ChangeDetectionStrategy, Injector, ChangeDetectorRef, ComponentFactoryResolver } from '@angular/core';
// import { UnitUtils } from '../../../landing/editor/utils/unitUtils';
import { MoWbInputNumberUnitDropdownComponent } from './unit-dropdown/unit-dropdown.component';
import { MoWbInputNumberMinmaxComponent } from './minmax/minmax.component';
// import { Utils } from 'src/app/landing/editor/utils/utils';
import { MoWbDetectionComponent } from '../../detection.component';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { CacheService } from 'src/app/api/common/cache.service';
import { TranslateService } from '@ngx-translate/core';
import { IUnit, UnitKey, Units } from 'src/app/common/types/landing/unit';
import { UnitUtils } from 'src/app/utils/unitUtils';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'mo-wb-components-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbInputNumberComponent extends MoWbDetectionComponent {

  inputWidth: string;
  extendClass: string;
  error: boolean;
  isFocus: boolean;
  isShowUnit: boolean;
  unitItem: any ;
  unitList: any = Units;
  isInputEnable: boolean = true;
  isReadonly: boolean = false;
  inputWrapMaxWidth: string = '100%';
  inputMaxWidth: string = '100%';
  invalidError: boolean = false;
  emptyError: boolean = false;


  @Input() classInclude: string = '';
  @Input() classIncludeLabel: string = '';
  @Input() label: string;
  @Input() min: number = 0;
  @Input() max: number;
  @Input() value: any;
  @Input() isRequired: boolean = true;
  @Input() step: number = 1;
  @Input() enable: boolean = true;
  @Input() width: string = '100%';
  @Input() title: string;
  @Input() unit: UnitKey | any = UnitKey.px ;
  @Input() hideUnit: boolean = false;
  @Input() units: IUnit[] = [];
  @Input() type: 'INTEGER' | 'FLOAT' = 'FLOAT';
  @Input() labelIcon: string;
  @Input() actionKey : 'KEY-UP' | 'ENTER' = 'ENTER';
  @Input() ignoreValues: number[] = [];
  @Input() hasPlusButton: boolean = false; // deprecated
  @Input() autoSetMinMax: boolean = false;
  @Input() hasStepper: boolean = false;
  @Input() placeholder: string = '';
  @Input() classIncludeInputWrap: string = '';
  @Input() emptyErrorMsg: string = 'i18n_valid_empty_message';
  @Input() otherErrorMsg: string = '';
  @Input() notShowErrorMsg: boolean = true;
  @Input() invalidMsg: string = 'i18n_message_error_is_not_valid';
  @Input() classIncludeInput: string = '';
  @Input() defaultFocus: boolean = false;
  @Input() actionBlur: boolean = false;

  @Output() onValueChanged = new EventEmitter<number>();
  @Output() onUnitChange = new EventEmitter<IUnit>();
  @Output() onValueError = new EventEmitter<any>();
  @Output() onChangeMinUnit = new EventEmitter<any>();
  @Output() onChangeMaxUnit = new EventEmitter<any>();
  @Output() onChangeMinValue = new EventEmitter<any>();
  @Output() onChangeMinMaxValue = new EventEmitter<any>();

  @ViewChild('input') input: ElementRef;
  @ViewChild('inputWrap') inputWrap: ElementRef;
  @ViewChild('minmaxEl') minmaxRef: ElementRef;
  @ViewChild('unitEl') unitRef: ElementRef<HTMLElement>;
  @ViewChild('stepEl') stepRef: ElementRef<HTMLElement>;

  constructor(
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    public _toast: ToastTranslateService,
    public override _changeDetection: ChangeDetectorRef,
    // public _cacheService: CacheService,
    public _translate: TranslateService,
    public _componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(_changeDetection);
  }
 
  override ngOnInit() {
    this.unitItem = this.hideUnit || !this.unit ? null : this.unit && Units[this.unit];
    this.value = this.convertUnitValue(this.value, this.unit);
    this.isInputEnable = this.checkIsInputEnable();
    // console.log('isInputEnable=', this.isInputEnable);
    this.updateMaxWidthInput();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['unit']) {
      this.unitItem = Units[this.unit];
      this.isInputEnable = this.checkIsInputEnable();
      // console.log('ngOnChanges isInputEnable=', this.isInputEnable);
      this.detectChanges();
      setTimeout(() => {
        this.updateMaxWidthInput();
        this.detectChanges();
      }, 0);
    }

    if (changes['value']) {
      // console.log('ngOnChanges value=', changes['value'], ' this value=', this.value);
      this.value = this.convertUnitValue(this.value, this.unit);
      this.detectChanges();
    }
  }

  override ngAfterViewInit() {
    this.initEvents();
    this.detectChanges();
    setTimeout(() => {
      this.updateMaxWidthInput();
      this.detectChanges();
    }, 150);

    // set default focus
    if (this.defaultFocus) {
      this.input.nativeElement.focus();
    }
  }

  initEvents() {
    if (!this.input || !this.input.nativeElement) {
      return;
    }
    this.input.nativeElement.addEventListener('focus', this.handleOnInputFocus);
    this.input.nativeElement.addEventListener('blur', this.handleOnInputBlur);
    this.input.nativeElement.addEventListener('keyup', this.handleOnInputKeyup);
    this.input.nativeElement.addEventListener('paste', this.handleOnPaste);
    this.input.nativeElement.addEventListener('click', this.handleOnInputClick);
  }

  /**
   * update max width input
   */
  updateMaxWidthInput() {
    // console.log('updateMaxWidthInput unitRef=', this.unitRef);
    if (!this.unitRef) {
      this.inputWrapMaxWidth = '100%';
    } else {
      const unitWidth = this.unitRef.nativeElement.getBoundingClientRect().width || 32;
      this.inputWrapMaxWidth = `calc(100% - ${unitWidth}px)`;
    }

    if (!this.stepRef) {
      this.inputMaxWidth = '100%';
    } else {
      const stepWidth = this.stepRef.nativeElement.getBoundingClientRect().width || 12;
      this.inputMaxWidth = `calc(100% - ${stepWidth}px)`;
    }
    
  }

  isNumeric = (num: any) => {
    return !isNaN(num)
  }

  getValue() {
    return this.input.nativeElement.value;
  }

  getDisplayValue(val: string) {
    const valNumber = this.type === 'INTEGER' ? parseInt(val) : parseFloat(val);
    const displayVal = this.checkIfFloatValue(valNumber) ? valNumber.toFixed(1) : valNumber.toFixed();
    return displayVal;
  }

  setValue(value: number) {
    this.value = value;
    this.detectChanges();
  }

  checkIfFloatValue(value: number) {
    if (!isNaN(value) && value.toString().indexOf('.') != -1) {
      return true;
    }
    return false;
  }

  addValue(step: number = this.step) {
    if (this.error || !this.enable) {
      return;
    }
    let val =  this.type === 'FLOAT' ? parseFloat(this.input.nativeElement.value) : parseInt(this.input.nativeElement.value);
    val = val + step;
    if (this.max) {
      val = Math.min(this.max, val);
    }
    const displayVal = this.checkIfFloatValue(val) ? val.toFixed(2) : val.toFixed();
    this.input.nativeElement.value = `${displayVal}`;
    this.detectChanges();
    this.onValueChanged.emit(parseFloat(displayVal));
  }

  subtractValue(step: number = this.step) {
    if (this.error || !this.enable) {
      return;
    }
    let val =  this.type === 'FLOAT' ? parseFloat(this.input.nativeElement.value) : parseInt(this.input.nativeElement.value);
    val = Math.max(this.min, val - step);
    const displayVal = this.checkIfFloatValue(val) ? val.toFixed(2) : val.toFixed();
    this.input.nativeElement.value = `${displayVal}`;

    this.detectChanges();
    this.onValueChanged.emit(parseFloat(displayVal));
  }

  /**
   * select input value
   */
  selectInputValue() {
    try {
      const InputElement = this.input.nativeElement as HTMLInputElement
      InputElement.setSelectionRange(0, this.input.nativeElement.value.length);
    } catch(ex) {
    }
  }

  /**
   * show unit menu
   * @param targetEl
   */
  showMenuUnits(targetEl: HTMLElement = null) {
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbInputNumberUnitDropdownComponent).create(this._injector);
    //const modalRef =  this.viewContainerRef.createComponent(MoWbColorComponent); //this._componentFactoryResolver.resolveComponentFactory(MoWbColorComponent).create(this._injector);
    modalRef.instance.units = this.units;
    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
      this.isShowUnit = false;
      this.detectChanges();
    });
    // handle selected unit item
    modalRef.instance.onSelectItem.subscribe((unit: IUnit) => {
      this.changeUnit(unit);
    });
    this._domService.addDomToBody(modalRef);
    
    modalRef.instance.selectedKey = this.unit;
    modalRef.instance.show(targetEl);

    this.isShowUnit = true;
    this.detectChanges();
  }

  showMinmax() {
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbInputNumberMinmaxComponent).create(this._injector);
    modalRef.instance.min = this.value.min;
    modalRef.instance.max = this.value.max;
    modalRef.instance.units = this.units;

    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
    });

    // modalRef.instance.onChangeMinUnit.subscribe((unit: IUnit) => {
    //   this.onChangeMinUnit.emit(unit);
    // });
    // modalRef.instance.onChangeMaxUnit.subscribe((unit: IUnit) => {
    //   this.onChangeMaxUnit.emit(unit);
    // });
    // modalRef.instance.onChangeMinValue.subscribe((value: number) => {
    //   console.log('onChangeMinValue value=', value);
    //   this.onChangeMinValue.emit(value);
    // });
    // modalRef.instance.onChangeMaxValue.subscribe((value: number) => {
    //   this.onChangeMaxValue.emit(value);
    // });
    modalRef.instance.onChangeValue.subscribe((value: any) => {
      this.onChangeMinMaxValue.emit(value);
    });
    this._domService.addDomToBody(modalRef);
    modalRef.instance.show(this.minmaxRef);
  }

  /**
   * change unit
   * @param unit 
   */
  changeUnit(unit: IUnit) {
        this.onUnitChange.emit(unit);
  }

  /**
   * convert value by unit
   * @param value 
   */
  convertUnitValue(value: any, unit: string) {
    if (!unit) {
      return value;
    }
    if (!value && value !== 0) {
      // console.log('return value ', value);
      return value;
    }
    // return value;
    if (!Utils.isNumeric(`${value}`)) {
      return value;
    }
    
    switch(unit) {
      case UnitKey.minMax:
        return value;
      case UnitKey.auto:
      case UnitKey.maxC:
      case UnitKey.minC:
      case UnitKey.none:
        return '';
      case UnitKey.px:
        return UnitUtils.convertToFloatValue(value, 0);
      default:
        return UnitUtils.convertToFloatValue(value, 1);
    }
  } 

  /**
   * check input enable
   * @returns 
   */
  checkIsInputEnable() {
    // console.log('checkIsInputEnable unit=', this.unit);
    if (!this.unit) {
      return true;
    }
    switch(this.unit) {
      case UnitKey.auto:
      // case UnitKey.fr:
      case UnitKey.maxC:
      case UnitKey.minC:
      case UnitKey.minMax:
      case UnitKey.none:
        return false;
      default:
        return true;
    }
  }

  blur() {
    this.input.nativeElement.blur();
    this.detectChanges();
  }

  /**
   * validate input value
   * @returns 
   */
  validate(): boolean {
    const isValid = true;
    let val: string = this.input.nativeElement.value;
    if (!val) {
      this.error = true;
      this.emptyError = true;

      this.detectChanges();
      this.onValueError.emit();
      return false;
    }
    this.emptyError = false;

    if (!this.isNumeric(val) && val !== '-') {
      this.error = true;
      this.detectChanges();

      this.onValueError.emit();
      return false;
    }

    let valNumber = this.type === 'FLOAT' ? parseFloat(val) : parseInt(val);
    if (isNaN(valNumber)) {
      // this.input.nativeElement.value = val.includes('-') ? val.trim() : '';
      return false;
    }
    if (this.ignoreValues.includes(valNumber)) {
      this.error = true;
      this.invalidError = true;
      this.detectChanges();
      this.onValueError.emit();
      return false;
    }

    if(this.min !== undefined && valNumber < this.min) {
      // if (!this.error) {
      //   this._toast.show('error', `Vui lòng nhập số lớn hơn ${this.min}${this.unit}`);
      // }
      if (this.autoSetMinMax) {
        this.setValueByMinMax('min');
        return true;
      }
      this.invalidError = true;
      this.invalidMsg = 'Giá trị nhập vào vượt quá giới hạn cho phép';
      this.error = true;
      this.detectChanges();
      this.onValueError.emit();
      return false;
    }

    if (this.max !=undefined && valNumber > this.max) {
      // if (!this.error) {
      //   this._toast.show('error', `Vui lòng nhập số bé hơn ${this.max}${this.unit}`);
      // }
      if (this.autoSetMinMax) {
        this.setValueByMinMax('max');
        return true;
      }
      this.error = true;
      this.invalidError = true;
      this.invalidMsg = 'Giá trị nhập vào vượt quá giới hạn cho phép';
      this.detectChanges();
      this.onValueError.emit();
      return false;
    }
    this.invalidError = false;
    this.error = false;
    this.detectChanges();
    return isValid;
  }

  handleOnInputFocus = (e: any) => {
    if (!this.enable || !this.isInputEnable) {
      return;
    }
    this.isFocus = true;
    (<any>window).isInput = true;
    this.detectChanges();
  }

  /**
   * handle on input blur
   * @param e 
   * @returns 
   */
  handleOnInputBlur = (e: any) => {
    if (!this.enable || !this.isInputEnable) {
      return;
    }
    (<any>window).isInput = false;
    if (!this.validate()) {
      this.isFocus = false;
      this.detectChanges();
      return;
    }

    if (this.isFocus) {
      const val: string = this.input.nativeElement.value;
      const valNumber = this.type === 'FLOAT' ? parseFloat(val) : parseInt(val);
      this.onValueChanged.emit(valNumber);
    }
    this.isFocus = false;
    this.detectChanges();
  }

  handleOnInputKeyup = (e: any) => {
    if (!this.enable || !this.isInputEnable) {
      return;
    }
    var charCode = e.which || e.keyCode;
    // console.log('handleOnInputKeyup charCode=', charCode);
    if (charCode === 38) {
      this.addValue();
      this.selectInputValue();
      return;
    }
    if (charCode === 40) {
      this.subtractValue();
      this.selectInputValue();
      return;
    }
    this.handleValueChange(e);
  }

  handleOnInputClick = (e: any) => {
    if (!this.enable || !this.isInputEnable) {
      return;
    }
    this.selectInputValue();
  }

  handleOnPaste = (e: any) => {
    if (!this.enable || !this.isInputEnable) {
      return;
    }
    setTimeout(() => {
      this.handleValueChange(e);
    }, 20);
  }

  handleOnIncreaseButton = (e: any) => {
    e.stopPropagation();
    if (!this.enable || !this.isInputEnable) {
      return;
    }
    this.addValue();
  }

  handleOnDecreaseButton = (e: any) => {
    e.stopPropagation();
    if (!this.enable || !this.isInputEnable) {
      return;
    }
    this.subtractValue();
  }

  /**
   * handle on value change
   * @param e 
   * @returns 
   */
  handleValueChange(e: any) {
    if (!this.enable) {
      return;
    }

    this.error = false;
    if (!this.valueIsValid(e)) {
      e.preventDefault();
      return;
    }
    
    if (!this.validate()) {
      return;
    }

    let val: string = this.input.nativeElement.value;
    // if (this.value === val && this.actionKey !== 'ENTER') {
    //   return;
    // }

    this.value = val;
    let valNumber = this.type === 'FLOAT' ? parseFloat(val) : parseInt(val);

    this.error = false;
    this.detectChanges();
    // console.log('handleValueChange error=', this.error);
    const keyCode = e.keyCode;
    if (this.actionKey === 'ENTER') {
      if (keyCode === 13) {
        this.onValueChanged.emit(valNumber);
        this.isFocus = false;
        this.blur();
      }
      return;
    }
    this.onValueChanged.emit(valNumber);
    
    if (keyCode === 13) {
      this.blur();
    }
  }

  /**
   * handle on unit select
   * @param e 
   * @param unitEl 
   * @returns 
   */
  handleOnUnitSelect(e: any, unitEl: HTMLElement) {
    if (!this.enable || !this.units || !this.units.length || this.units.length <= 1) {
      return;
    }
    this.showMenuUnits(unitEl);
    this.detectChanges();
  }

  handleOnMinmaxClick(e: any, targetEl: HTMLElement) {
    this.showMenuUnits(targetEl);
  }

  handleOnEditMinMaxIconClick(e: any) {
    this.showMinmax();
  }

  // TODO
  private safeValue(val: string | number): number {
    const safeValue = parseFloat(this.stringify(val).replace(',', '.'));
    return isNaN(safeValue) ? undefined : safeValue;
  }

  private stringify(val: string | number): string {
    return val === undefined || val === null ? '' : `${val}`;
  }

  private getNewValue(target: HTMLInputElement, str: string): string {
    const currentValue = this.input.nativeElement.value;
    console.log('target :', target, str);
    const { value = '', selectionStart, selectionEnd } = target;

    return [
      ...value.split('').splice(0, selectionStart),
      currentValue,
      ...value.split('').splice(selectionEnd),
    ].join('');
  }

  private valueIsValid(event: KeyboardEvent): boolean {
    // const regex: RegExp = new RegExp(/^-?\d*(,|\.)?\d*$/g);
    // const regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
    // Allow Backspace, tab, end, and home keys

    // if (this.specialKeys.indexOf(event.key) !== -1) {
    //   return true;
    // }
    const currentValue: string = this.input.nativeElement.value;
    const isValid = /^-?\d*(,|\.)?\d*$/.test(currentValue);
    if (isValid) {

      const lastCharacter = currentValue.slice(-1);
      if (this.type === 'FLOAT' && lastCharacter === '.') {
        return false;
      }
      return true;
    }
    const length = currentValue.length;

    this.input.nativeElement.value = currentValue.substring(0,  length - 1);
    this.detectChanges();
    return false;
    
    // let current: string = this.input.nativeElement.value;
    // const position = this.input.nativeElement.selectionStart;
    // const next: string = [
    //   current.slice(0, position),
    //   event.key == 'Decimal' ? '.' : event.key,
    //   current.slice(position),
    // ].join('');
    // console.log('next :', next);
    // console.log('check :', !String(next).match(regex));
    // if (next && !String(next).match(regex)) {
    //   event.preventDefault();
    //   return true;
    // }


    // return false;
  }
  // TO DO

  /**
   * Auto set value equal max or min
   * @param type 
   * @returns 
   */
  setValueByMinMax(type: string) {

    if (type === 'min') {
      this.input.nativeElement.value = this.min;
      this.isFocus = false;
      return;
    }

    if (type === 'max') {
      this.input.nativeElement.value = this.max;
      this.isFocus = false;
      return;
    }
  }

  override ngOnDestroy() {

  }

}
