import {
  Component, EventEmitter, ViewChild,
  Output, Input, ElementRef, ChangeDetectionStrategy} from '@angular/core';
import { MoWbDetectionComponent } from '../detection.component';

@Component({
  selector: 'mo-wb-components-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbInputComponent extends MoWbDetectionComponent {

  inputWidth: string;
  extendClass: string;
  isFocus: boolean;
  invalidError: boolean;
  emptyError: boolean;
  valueLength: number = 0;

  @Input() classPlaceholder: string;
  @Input() height: number = 32;
  @Input() classInput: string;
  @Input() error: boolean;
  @Input() classInclude: string = '';
  @Input() maxLength: number;
  @Input() value: string;
  @Input() isRequired: boolean = true;
  @Input() enable: boolean = true;
  @Input() readOnly: boolean = false;
  @Input() width: string = '100%';
  @Input() title: string;
  @Input() label: string;
  @Input() showIconSearch: boolean;
  @Input() placeholder: string = 'i18n_import_content';
  @Input() note: string = '';
  @Input() inputType: string = 'text';
  @Input() requireNote: string = '';
  @Input() toolTip: string;
  @Input() tooltip: string;
  @Input() require: string;
  @Input() emptyErrorMsg: string = 'i18n_valid_empty_message';
  @Input() invalidMsg: string = 'i18n_message_error_is_not_valid';
  @Input() otherErrorMsg: string;
  @Input() validType: 'URL' | 'EMAIL' | 'PHONE' | 'FONT' | 'YOUTUBE' | 'VIMEO' | 'FACEBOOK' 
    | 'DAILYMOTION' | 'TWITCH' | 'OTHER' | 'NONE' | 'MP4' | 'PIXEL' | 'GG_ANALYTICS' | 'GTM' | 'GOOGLE_DRIVE_ID' = 'OTHER';
  @Input() isMultiple: boolean = false;
  @Input() inputHeight: number = 80;
  @Input() tooltipWidth: number = 200;
  @Input() hideTextRequire: boolean = false;
  @Input() showAsterisk: boolean = false;
  @Input() actionKey: 'KEY-UP' | 'ENTER' = 'ENTER';
  @Input() classTitle: string = '';
  @Input() defaultFocus: boolean = false;
  @Input() notShowErrorMsg: boolean = false;
  @Input() isNotShowLength: boolean = false;
  @Input() isReadonly: boolean = false;
  @Input() isSearchInput: boolean = false;
  @Input() isCheckEmpty: boolean = false;
  @Input() classTextArea: string = '';
 
  @Output() onValueChanged = new EventEmitter<string>();
  @Output() onInputError = new EventEmitter<any>();
  @Output() onBlurInput = new EventEmitter<any>();

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  override ngOnInit() {
    this.inputWidth = this.label ? `calc(100% - ${33}px)` : `calc(100% - ${0}px)`;
  }

  override ngAfterViewInit() {
    if (this.maxLength && this.value && this.value.length > this.maxLength) {
      this.value = this.value.substring(0, this.maxLength);
    }
    this.valueLength = this.value ? this.value.length : 0;
    // console.log('valueLength=', this.valueLength, this.value);
    this.initEvents();
    if (this.defaultFocus){
      this.input.nativeElement.focus();
    }
    setTimeout(() => {
      if (this.maxLength && this.value && this.value.length > this.maxLength) {
        this.value = this.value.substring(0, this.maxLength);
      }
      this.valueLength = this.value ? this.value.length : 0;
      this.detectChanges();
    }, 50);
    this.detectChanges();
  }

  initEvents() {
    if (!this.input || !this.input.nativeElement) {
      return;
    }

    this.input.nativeElement.addEventListener('focus', this.handleOnInputFocus);
    this.input.nativeElement.addEventListener('blur', this.handleOnInputBlur);
    this.input.nativeElement.addEventListener('keyup', this.handleOnInputKeyup);
    this.input.nativeElement.addEventListener('paste', this.handleOnPaste);
  }

  isNumeric = (num: number) => {
    return !isNaN(num)
  }

  setValue(value: string) {
    this.value = value;
    if (this.maxLength && this.value && this.value.length > this.maxLength) {
      this.value = this.value.substring(0, this.maxLength);
    }
    this.valueLength = this.value.length;
    this.input.nativeElement.value = this.value;
    this.reset();
    this.detectChanges();
  }

  blur() {
    this.input.nativeElement.blur();
  }

  getValue() {
    return this.input.nativeElement.value;
  }

  validate(): boolean {
    if (this.isSearchInput) {
      return true;
    } 

    if(this.validType === 'NONE'){
      return true;
    }
    let val = this.input ? this.input.nativeElement.value : this.value;
    val = val && val.trim();
    // if is not required and value is empty
    if (!this.isRequired && !val) {
      this.error = false;
      this.invalidError = false;
      this.emptyError = false;
      this.onInputError.emit(false);
      this.detectChanges();
      return true;
    }
    
    if (this.isRequired && !val) {
      this.otherErrorMsg = null;
      this.error = true;
      this.invalidError = false;
      this.emptyError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }
    this.emptyError = false;
    if (this.validType === 'URL' && ((!val.includes('https://') && !val.includes('http://')) || !this.urlPatternValidation(val))) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'YOUTUBE' && !this.validateYouTubeUrl(val)) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if(this.validType === 'FONT' && !this.validateNameFont(val)){
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'VIMEO' && !this.validateVimeoUrl(val)) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'FACEBOOK' && !this.validateFacebookUrl(val)) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'DAILYMOTION' && !this.validateDailyMotionUrl(val)) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'TWITCH' && !this.validateTwitchUrl(val)) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'MP4' && !this.validateMp4Url(val)) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'PHONE' && !this.validatePhoneNumber(val)) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'EMAIL' && !this.validateEmail(val)) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'GG_ANALYTICS' && !this.validateGoogleAnalyticId(val)) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'GTM' && !this.validateGTM(val)) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'PIXEL' && !this.validateFacebookPixelId(val)) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    if (this.validType === 'GOOGLE_DRIVE_ID' && val.length !== 33) {
      this.error = true;
      this.invalidError = true;
      this.onInputError.emit(true);
      this.detectChanges();
      return false;
    }

    this.invalidError = false;
    this.error = false;
    this.onInputError.emit(false);
    return true;
  }

  validateNameFont(name: string){
    if(name != undefined || name != ''){
      const regExp = /[a-zA-Z0-9-_ àÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ]/g;
      const match = name.match(regExp);
      const char:string[] = name.split('');
     for(let i =0; i<char.length; i++){
        if(!char[i].match(regExp)){
          return false;
        }
      } 
      if (match) {
        return true;
      }
    }
    return false;
  }

  validatePhoneNumber(tel: string){
    if(!tel || tel.length >= 12){
      return false;
    }
    const regExp = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
    return regExp.test(tel);
  }

  validateEmail(email: string){
    if(!email){
      return false;
    }
    const regExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return regExp.test(email);
  }

  validateYouTubeUrl(url: string) {
    if (url != undefined || url != '') {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length == 11) {
        return true;
      }
    }
    return false;
  }
  validateVimeoUrl(url: string) {
    if (url != undefined || url != '') {
      if (/^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/.test(url)) { 
        return true;
      }
    }
    return false;
  }

  validateFacebookUrl(url: string){
    if(url != undefined || url != ''){
      if(/^https?:\/\/www\.facebook\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/gm.test(url)){
        return true;
      }
    }
    return false;
  }

  validateDailyMotionUrl(url: string){
    if(url != undefined || url != ''){
      const match = url.match(/^(?:(?:http|https):\/\/)?(?:www.)?(dailymotion\.com|dai\.ly)\/((video\/([^_]+))|(hub\/([^_]+)|([^\/_]+)))$/);
      if(match){
        return true;
      }
    }
    return false;
  }

  validateTwitchUrl(url: string){
    if(url != undefined || url != ''){
      const twitchVideoUrlPattern = /^https?:\/\/(?:www\.)?twitch\.tv\/videos\/(\d+)$/;
      const matches = url.match(twitchVideoUrlPattern);
      if(matches) {
      return true;
      }
    }
    return false;
  }

  validateMp4Url(url: string){
    if(url != undefined || url != ''){
      const reg = /^(http(s)?:\/\/|www\.).*(\.mp4|\.mkv)$/
      const matches = url.match(reg);
      if(matches) {
      return true;
      }
    }
    return false;
  }

  validateGoogleAnalyticId(id: string){
    const gaIdRegex = /^(G|UA)-\w{6,}$/;
    const match = gaIdRegex.test(id);
    if(match){
      return true;
    }
    return false;
  }

  validateGTM(id: string){
    const gtmContainerIDRegex = /GTM-[A-Z0-9]{6,}/;
    return gtmContainerIDRegex.test(id);
  }

  validateFacebookPixelId(id: string){
    const facebookPixelIDRegex = /^[0-9]{15,}$/;
  return facebookPixelIDRegex.test(id);
  }

  urlPatternValidation = (URL: string) => {
    const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
    return regex.test(URL);
  };

  reset() {
    this.error = false;
    this.emptyError = false;
    this.invalidError = false;
    this.detectChanges();
  }

  focus(){
    this.input.nativeElement.focus();
    this.detectChanges();
  }

  /**
   * set invalid error
   * @param errorMsg 
   */
  setInvalidError(errorMsg: string = '') {
    this.invalidError = true;
    this.error = true;
    if (errorMsg) {
      this.invalidMsg = errorMsg;
    }
    this.detectChanges();
  } 

  /**
   * reset error
   */
  resetError() {
    this.invalidError = false;
    this.emptyError = false;
    this.detectChanges();
  }

  handleOnInputFocus = (e: any) => {
    if (!this.enable || this.isReadonly) {
      return;
    }
    this.isFocus = true;
    (<any>window).isInput = true;
    this.input.nativeElement.select();
    this.detectChanges();
  }

  handleOnInputBlur = (e: any) => {
    if (!this.enable || this.isReadonly) {
      return;
    }
    (<any>window).isInput = false;
    if (!this.validate()) {
      this.isFocus = false;
      this.detectChanges();
      return;
    }

    
    let val = this.input.nativeElement.value;
    this.value = val;
    this.onBlurInput.emit(val);

    if (this.isFocus) {
      this.onValueChanged.emit(val);
    }

    this.isFocus = false;
    this.detectChanges();
    
  }

  handleOnInputKeyup = (e: any) => {
    this.handleValueChange(e);
  }

  handleOnPaste = (e: any) => {
    setTimeout(() => {
      this.handleValueChange(e);
    }, 20);
  }

  handleValueChange(e: any) {
    if (!this.enable || this.isReadonly) {
      return;
    }
    let val = this.input.nativeElement.value;
    this.valueLength = val.length;

    if (!this.validate()) {
      this.detectChanges();
      return;
    }
    this.value = val;
    if (this.maxLength && val.length > this.maxLength) {
      val = val.substring(0, this.maxLength);
      this.input.nativeElement.value = val;
      this.value = val;
      this.valueLength = val.length;
    }
    this.detectChanges();
    const keyCode = e.keyCode;
    if(this.isCheckEmpty){
      setTimeout(()=>{
        const inputVal = this.input.nativeElement.value;
        if(inputVal !== ''){
          return;
        }
        this.isFocus = false;
        this.onValueChanged.emit(val);
        this.detectChanges();
      }, 200);
    }
    if (this.actionKey === 'ENTER') {
      if (keyCode === 13) {
        this.isFocus = false;
        this.onValueChanged.emit(val);
        this.blur();
      }
      return;
    }
    this.onValueChanged.emit(val);
    if (keyCode === 13) {
      this.isFocus = false;
      this.blur();
    }
  }

  handleOnClick(event: MouseEvent) {
    event.stopPropagation();
  }

  /**
   * handle on clear click
   * @param event 
   */
  handleOnClearClick(event: MouseEvent) {
    this.value = '';
    this.detectChanges();

    this.onValueChanged.emit('');
  }

  handleOnInputMousedown(event: any) {
    event.stopPropagation();
  }

  override ngOnDestroy() {

  }
}
