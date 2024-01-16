import {
  Component, Input, EventEmitter, SimpleChanges, ChangeDetectionStrategy, Output, ViewChild, ElementRef,
} from '@angular/core';
import { MoWbBaseComponent } from '../base.component';
import { ColorEvent } from 'ngx-color';
import { CacheKeys } from 'src/app/common/define/cache-keys.define';

interface IColorRgb {
  r: number,
  g: number,
  b: number,
  a: any;
}

@Component({
  selector: 'mo-wb-components-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbColorComponent extends MoWbBaseComponent {

  color: Object;
  hexColor: String;
  rgbaColor: Object;
  colorFont: string;
  top: number;
  left: number;

  @Input() presetColors: Array<string>;
  @Input() width: number;
  @Input() parentEL: ElementRef;

  @Output() onClose = new EventEmitter<any>;
  @Output() onChangeColor = new EventEmitter<any>;
  @Output() onAcceptColor = new EventEmitter<any>;

  override ngOnInit() {
    const theme = localStorage.getItem(CacheKeys.KEY_THEME);
    let currentTheme = theme && JSON.parse(theme);
    this.colorFont = currentTheme && currentTheme['--pri'] || '#226FF5';
    
    if(!this.presetColors || !this.presetColors.length){
      this.presetColors = ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF'];
    }
    this.setPosition();
    console.log('parentEL=', this.parentEL);
  }

  override ngAfterViewInit() {

  }

  override ngOnDestroy() {
  }

  setPosition(){
    if(!this.parentEL){
      return;
    }
    const rect = this.parentEL.nativeElement.getBoundingClientRect();
    this.top = rect.top;
    this.left = rect.left + 35;
  }

  handleChange($event: ColorEvent) {
    this.color = $event.color;
    this.hexColor = $event.color.hex;
    this.rgbaColor = $event.color.rgb;
    const rgba: IColorRgb = $event.color.rgb;
    this.colorFont = `rgb(${rgba.r +','+ rgba.g+','+ rgba.b+','+ rgba.a})`;
    console.log('this.rgbaColor=', this.rgbaColor, rgba.r);
    this.onChangeColor.emit(this.colorFont);
  }

  handleChangeColor(e: MouseEvent){
    this.onAcceptColor.emit(this.colorFont);
    this.onClose.emit();
  }

  handleOverlayClick(){
    this.onClose.emit();
  }
  

}
