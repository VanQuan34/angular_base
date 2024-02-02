import { Component, OnInit, EventEmitter, ViewChild, ViewChildren, QueryList, ComponentFactoryResolver,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector } from '@angular/core';
import { MoWbMediaStoreEditAddNewFileComponent } from './add-new/media-store-edit-add-new.component';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { MoWbFileApiService } from 'src/app/api/media/fileApiService';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { MoWbDetectionComponent } from 'src/app/components/detection.component';

let CONTAINER_HEIGHT= 640;
let CONTAINER_WIDTH = 1120;
const MIN_HEIGHT = 20;
const MIN_WIDTH = 20;

@Component({
  selector: 'mo-wb-media_store_edit',
  templateUrl: './media-store-edit.component.html',
  styleUrls: ['./media-store-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreEditModalComponent extends MoWbDetectionComponent {
  modalHeight: string = '801px';
  loading: boolean = false;
  isOpen: boolean = false;
  isImageChanged: boolean = false;
  isHeightAutoSize: boolean = false;
  imgContainerRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  }
  rectClip: {
    top: number;
    left: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
  }
  resizeState: 'TL' | 'BL' | 'TR' | 'BR' | 'VL' | 'VR' | 'HT' | 'HB' | 'NONE' = 'NONE';
  moveState: 'CLIP' | 'IMAGE' | 'NONE' = 'NONE';
  startMouseDim: {
    clientX: number;
    clientY: number;
    width: number;
    height: number;
    top: number;
    left: number;
    imageTop: number;
    imageLeft: number;
    imageWidth: number;
    imageHeight: number;
  }

  cropSize: {
    width: number;
    height: number;
  } = {
    width: 0,
    height: 0 
  }

  canvas = document.createElement('canvas');
  ctx = this.canvas.getContext("2d");
  image = new Image();
  dataUrlOrigin: string;
  originWidth: number;
  originHeight: number;

  cropRatioList: {
    key: 'Free' | 'Origin' | '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9';
    label: string;
    className: string;
    value?: number;
  }[];

  selectedCropRatioIndex: number = 1;
  ratioValue?: number;
  isCropRatioShow: boolean;
  isCropMode: boolean = true;
  isResizeShow: boolean;

  resizeData: {
    ratio: number;
    width: number;
    height: number;
  } = {
    ratio: 100,
    width: 600,
    height: 800
  }

  quality: number = 100;


  @Input() saveDefaultFolder: boolean = false;
  @Input() mode: 'FILE' | 'SAVE' | 'ALL' = 'SAVE';
  @Input() folderId: string = '';
  @Input() mimetype: string = '';
  @Input() zIndex: number = 10000;
  @Input() imgSrcList: string[] = [];
  @Input() originUrl: string = '';
  @Input() hasZoom: boolean = false;

  @Output() onClose = new EventEmitter<any>();
  @Output() onSaveFileOk = new EventEmitter<any>();
  @Output() onFileSelected = new EventEmitter<any>();

  @ViewChild('imageOrigin') imageOrigin: ElementRef;
  @ViewChild('imageClip') imageClip: ElementRef;
  @ViewChild('imageContainer') imageContainer: ElementRef;
  @ViewChild('cropArea') cropArea: ElementRef;
  @ViewChild('cropTL') cropTL: ElementRef;
  @ViewChild('cropBL') cropBL: ElementRef;
  @ViewChild('cropBR') cropBR: ElementRef;
  @ViewChild('cropTR') cropTR: ElementRef;

  @ViewChild('cropLineVL') cropLineVL: ElementRef;
  @ViewChild('cropLineVR') cropLineVR: ElementRef;
  @ViewChild('cropLineHT') cropLineHT: ElementRef;
  @ViewChild('cropLineHB') cropLineHB: ElementRef;
  @ViewChild('cropImg') cropImg: ElementRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private _domService: AddComponentToBodyService,
    private injector: Injector,
    private _toast: ToastTranslateService,
    // private _folderApiService: MoFolderApiService,
    // private _fileApiService: MoWbFileApiService,
    public override _changeDetection: ChangeDetectorRef
  ) {
    super(_changeDetection);
  }
  override ngOnInit() {
    this.isCropMode = true;
    this.cropRatioList = [
      {
        key: 'Free',
        label: 'i18n_custom',
        className: 'box-free',
      },
      {
        key: 'Origin',
        label: 'i18n_ratio',
        className: 'box-origin'
      },
      {
        key: '1:1',
        label: '1 : 1',
        className: 'box-1-1',
        value: 1
      },
      {
        key: '2:3',
        label: '2 : 3',
        className: 'box-2-3',
        value: 2/3
      },
      {
        key: '3:2',
        label: '3 : 2',
        className: 'box-3-2',
        value: 3/2
      },
      {
        key: '3:4',
        label: '3 : 4',
        className: 'box-3-4',
        value: 3/4
      },
      {
        key: '4:3',
        label: '4 : 3',
        className: 'box-4-3',
        value: 4/3
      },
      {
        key: '9:16',
        label: '9 : 16',
        className: 'box-9-16',
        value: 9/16
      },
      {
        key: '16:9',
        label: '16 : 9',
        className: 'box-16-9',
        value: 16/9
      },
    ];
    this.detectChanges();
  }

  override ngAfterViewInit() {
    setTimeout(() => {
      this.updateModalSize();
      this.initData();
      this.initMouseEvent();
    }, 0);
    this.detectChanges();
  }

  initData() {
    this.imgContainerRect = this.imageContainer.nativeElement.getBoundingClientRect();
    // var img = new Image();
    //drawing of the test image - img1
    this.image.setAttribute('crossorigin', 'anonymous');
    this.image.onload = () => {
      this.imgContainerRect = this.imageContainer.nativeElement.getBoundingClientRect();
      this.canvas.height = this.image.height;
      this.canvas.width = this.image.width;
      this.originHeight = this.image.height;
      this.originWidth = this.image.width;
      this.updateOriginImageSize();
      this.canvas.getContext('2d').drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
      this.dataUrlOrigin = this.getDataUrl(this.canvas);
      console.log('dataUrlOrigin = ', this.dataUrlOrigin);
      this.imgSrcList = [this.dataUrlOrigin];
    };

    this.image.src = this.imgSrcList[this.imgSrcList.length - 1];
  }

  updateModalSize() {
    const windowHeight = window.innerHeight;
    const maxHeight = windowHeight - 40;
    let containerHeight = Math.min(801, maxHeight);
    this.modalHeight = `${containerHeight}px`;
    CONTAINER_HEIGHT = containerHeight - 52 - 90 - 20;
    // console.log('containerHeight= ', containerHeight, ' CONTAINER_HEIGHT=',CONTAINER_HEIGHT);
    this.detectChanges();
  }

  updateOriginImageSize = () => {
    let width = this.originWidth;
    let height = this.originHeight;
    const ratio = width / height;

    if (width >= height) {
      width = Math.min(CONTAINER_WIDTH, width);
      height = Math.min(width/ratio, CONTAINER_HEIGHT);
      width = height * ratio;
    } else {
      height = Math.min(CONTAINER_HEIGHT, height);
      width = height * ratio;
    }

    this.setImagePosition(width, height);
    this.updateCropAreaPos();
    this.updateRectClipPos();
  }

  initMouseEvent() {
    document.removeEventListener('mousemove', this.handleOnMousemove);
    document.addEventListener('mousemove', this.handleOnMousemove);

    document.removeEventListener('mouseup', this.handleOnMouseup);
    document.addEventListener('mouseup', this.handleOnMouseup);

    document.removeEventListener('wheel', this.handleOnMousewheel);
    document.addEventListener('wheel', this.handleOnMousewheel);

    window.addEventListener('resize', this.handleOnWindowResize, false );

    this.imageContainer.nativeElement.removeEventListener('mousedown', this.handleOnImageContainerMousedown);
    this.imageContainer.nativeElement.addEventListener('mousedown', this.handleOnImageContainerMousedown);

    this.cropTL.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeTL);
    this.cropTL.nativeElement.addEventListener('mousedown', this.handleOnCropResizeTL);

    this.cropBL.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeBL);
    this.cropBL.nativeElement.addEventListener('mousedown', this.handleOnCropResizeBL);

    this.cropBR.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeBR);
    this.cropBR.nativeElement.addEventListener('mousedown', this.handleOnCropResizeBR);

    this.cropTR.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeTR);
    this.cropTR.nativeElement.addEventListener('mousedown', this.handleOnCropResizeTR);

    this.cropLineVL.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeVL);
    this.cropLineVL.nativeElement.addEventListener('mousedown', this.handleOnCropResizeVL);

    this.cropLineVR.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeVR);
    this.cropLineVR.nativeElement.addEventListener('mousedown', this.handleOnCropResizeVR);

    this.cropLineHT.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeHT);
    this.cropLineHT.nativeElement.addEventListener('mousedown', this.handleOnCropResizeHT);

    this.cropLineHB.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeHB);
    this.cropLineHB.nativeElement.addEventListener('mousedown', this.handleOnCropResizeHB);

    this.cropArea.nativeElement.removeEventListener('mousedown', this.handleOnMousedownCropArea);
    this.cropArea.nativeElement.addEventListener('mousedown', this.handleOnMousedownCropArea);
  }

  handleOnWindowResize = (e: any) => {
    // console.log('handleOnWindowResize');
    this.updateModalSize();
  }

  handleOnImageContainerMousedown = (e: any) => {
    // console.log('handleOnImageContainerMousedown moveState= ',this.moveState, ' resizeState=', this.resizeState);
    if (this.resizeState === 'NONE' && this.moveState === 'NONE') {
      this.moveState = 'IMAGE';
      this.handleMousedown(e);
    }
    return false;
  }

  handleOnCropResizeTL = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    this.resizeState = 'TL';
    this.handleMousedown(e);
  }

  handleOnCropResizeBL = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    this.resizeState = 'BL';
    this.handleMousedown(e);
  }

  handleOnCropResizeBR = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    this.resizeState = 'BR';
    this.handleMousedown(e);
  }

  handleOnCropResizeTR = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    this.resizeState = 'TR';
    this.handleMousedown(e);
  }

  handleOnCropResizeVL = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    this.resizeState = 'VL';
    this.handleMousedown(e);
  }

  handleOnCropResizeVR = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    this.resizeState = 'VR';
    this.handleMousedown(e);
  }

  handleOnCropResizeHT = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    this.resizeState = 'HT';
    this.handleMousedown(e);
  }

  handleOnCropResizeHB = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    this.resizeState = 'HB';
    this.handleMousedown(e);
  }

  handleOnMousedownCropArea = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    this.moveState = 'CLIP';
    this.handleMousedown(e);
  } 

  handleOnMousemove = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (this.moveState === 'NONE' && this.resizeState === 'NONE') {
      return;
    }
    
    switch (this.resizeState) {
      case 'BL':
        this.resizeCropFollowBLDir(e);
        break;
      case 'TL':
        this.resizeCropFollowTLDir(e);
        break;
      case 'TR':
        this.resizeCropFollowTRDir(e);
        break;
      case 'BR':
        this.resizeCropFollowBRDir(e);
        break;
      case 'VL':
        this.resizeCropFollowVLDir(e);
        break;
      case 'VR':
        this.resizeCropFollowVRDir(e);
        break;
      case 'HT':
        this.resizeCropFollowHTDir(e);
        break;
      case 'HB':
        this.resizeCropFollowHBDir(e);
        break;
      default:
        break;
    }
    // console.log('move moveState=', this.moveState);
    switch (this.moveState) {
      case 'CLIP':
        this.moveClipArea(e);
        break;
      case 'IMAGE':
        this.moveImage(e);
        break;
      default:
        break;
    }
    this.isImageChanged = true;
    this.detectChanges();
  }

  handleOnMouseup = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    switch (this.resizeState) {
      case 'BL':
        this.imageContainer.nativeElement.classList.remove('bl-cursor');
        this.cropArea.nativeElement.classList.remove('bl-cursor');
        break;
      case 'TL':
        this.imageContainer.nativeElement.classList.remove('tl-cursor');
        this.cropArea.nativeElement.classList.remove('tl-cursor');
        break;
      case 'TR':
        this.imageContainer.nativeElement.classList.remove('tr-cursor');
        this.cropArea.nativeElement.classList.remove('tr-cursor');
        break;
      case 'BR':
        this.imageContainer.nativeElement.classList.remove('br-cursor');
        this.cropArea.nativeElement.classList.remove('br-cursor');
        break;
      case 'VL':
      case 'VR':
        this.imageContainer.nativeElement.classList.remove('v-cursor');
        this.cropArea.nativeElement.classList.remove('v-cursor');
        break;
      case 'HT':
      case 'HT':
        this.imageContainer.nativeElement.classList.remove('H-cursor');
        this.cropArea.nativeElement.classList.remove('h-cursor');
        break;
      default:
        break;
    }

    switch(this.moveState) {
      case 'IMAGE' :
        this.imageContainer.nativeElement.classList.remove('move-cursor');
        this.cropArea.nativeElement.classList.remove('move-cursor');
        break;
      default: 
        break;
    }
    
    this.resizeState = 'NONE';
    this.moveState = 'NONE';

    // console.log('handleOnMouseup resizeState=', this.resizeState, ' moveState=', this.moveState);
  }

  handleMousedown(e: any) {
    switch (this.resizeState) {
      case 'BL':
        this.imageContainer.nativeElement.classList.add('bl-cursor');
        this.cropArea.nativeElement.classList.add('bl-cursor');
        break;
      case 'TL':
        this.imageContainer.nativeElement.classList.add('tl-cursor');
        this.cropArea.nativeElement.classList.add('tl-cursor');
        break;
      case 'TR':
        this.imageContainer.nativeElement.classList.add('tr-cursor');
        this.cropArea.nativeElement.classList.add('tr-cursor');
        break;
      case 'BR':
        this.imageContainer.nativeElement.classList.add('br-cursor');
        this.cropArea.nativeElement.classList.add('br-cursor');
        break;
      case 'VL':
      case 'VR':
        this.imageContainer.nativeElement.classList.add('v-cursor');
        this.cropArea.nativeElement.classList.add('v-cursor');
        break;
      case 'HT':
      case 'HT':
        this.imageContainer.nativeElement.classList.add('H-cursor');
        this.cropArea.nativeElement.classList.add('h-cursor');
        break;
      default:
        break;
    }

    switch(this.moveState) {
      case 'IMAGE' :
        this.imageContainer.nativeElement.classList.add('move-cursor');
        this.cropArea.nativeElement.classList.add('move-cursor');
        break;
      default: 
        break;
    }

    const width = this.cropArea.nativeElement.offsetWidth;
    const height = this.cropArea.nativeElement.offsetHeight;
    const top = parseInt(this.cropArea.nativeElement.style.top);
    const left = parseInt(this.cropArea.nativeElement.style.left);
    const imageLeft = parseInt(this.imageOrigin.nativeElement.style.left);
    const imageTop = parseInt(this.imageOrigin.nativeElement.style.top);
    const imageWidth = this.imageOrigin.nativeElement.offsetWidth;
    const imageHeight = this.imageOrigin.nativeElement.offsetHeight;

    this.startMouseDim = {
      clientX: e.clientX,
      clientY: e.clientY,
      width: width,
      height: height,
      top: top,
      left: left,
      imageTop: imageTop,
      imageLeft: imageLeft,
      imageWidth: imageWidth,
      imageHeight: imageHeight
    }

    this.ratioValue = this.getCropRatioValue();
  }

  getCropSize(maxHeight: number, height: number, width: number, maxWidth: number) {
    height = Math.min(maxHeight, height) ;
    height = Math.max(MIN_HEIGHT, height);
    if (this.ratioValue) {
      width = height * this.ratioValue;
      width = Math.min(maxWidth, width);
      width = Math.max(MIN_WIDTH, width);
      height = width / this.ratioValue
    }
    width = Math.min(maxWidth, width);

    return {
      height: height,
      width: width
    }
  }

  resizeCropFollowTLDir = (e: any) => {
    const momentY = e.clientY - this.startMouseDim.clientY;
    const momentX = this.ratioValue ? this.ratioValue * momentY : e.clientX - this.startMouseDim.clientX;

    let top = this.startMouseDim.top + momentY;
    let height = this.startMouseDim.height - momentY;
    let left = this.startMouseDim.left + momentX;
    let width = this.startMouseDim.width - momentX;
    const maxHeight = this.startMouseDim.top + this.startMouseDim.height - this.startMouseDim.imageTop ;
    const maxWidth = this.startMouseDim.left + this.startMouseDim.width - this.startMouseDim.imageLeft;

    // const size = this.getCropSize(maxHeight, height, width, maxWidth);
    height = Math.min(maxHeight, height) ;
    height = Math.max(MIN_HEIGHT, height);
    if (this.ratioValue) {
      width = height * this.ratioValue;
      width = Math.min(maxWidth, width);
      width = Math.max(MIN_WIDTH, width);
      height = width / this.ratioValue
    }
    width = Math.min(maxWidth, width);
    width = Math.max(MIN_WIDTH, width);
    left = this.startMouseDim.left + this.startMouseDim.width - width;
    top = this.startMouseDim.top + this.startMouseDim.height - height; 

    this.cropArea.nativeElement.style.top = `${top}px`;
    this.cropArea.nativeElement.style.left = `${left}px`;
    this.cropArea.nativeElement.style.width = `${width}px`;
    this.cropArea.nativeElement.style.height = `${height}px`;

    this.updateRectClipPos();
  }

  resizeCropFollowBLDir = (e: any) => {
    const momentY = e.clientY - this.startMouseDim.clientY;
    const momentX = this.ratioValue ? -momentY * this.ratioValue :  e.clientX - this.startMouseDim.clientX;

    const maxHeight = this.startMouseDim.imageTop + this.startMouseDim.imageHeight - this.startMouseDim.top;
    const maxWidth = this.startMouseDim.left + this.startMouseDim.width - this.startMouseDim.imageLeft;

    let top = this.startMouseDim.top + momentY;
    let height = this.startMouseDim.height + momentY;
    let left = this.startMouseDim.left + momentX;
    let width = this.startMouseDim.width - momentX;

    height = Math.min(maxHeight, height);
    height = Math.max(MIN_HEIGHT, height);
    if (this.ratioValue) {
      width = height * this.ratioValue;
      width = Math.min(maxWidth, width);
      width = Math.max(MIN_WIDTH, width);
      height = width / this.ratioValue
    }

    width = Math.min(maxWidth, width);
    width = Math.max(MIN_WIDTH, width);
    left = this.startMouseDim.left + this.startMouseDim.width - width;
    // top = this.startMouseDim.top + this.startMouseDim.height - height; 

    // this.cropArea.nativeElement.style.top = `${top}px`;
    this.cropArea.nativeElement.style.left = `${left}px`;
    this.cropArea.nativeElement.style.width = `${width}px`;
    this.cropArea.nativeElement.style.height = `${height}px`;

    this.updateRectClipPos();
  }

  resizeCropFollowTRDir = (e: any) => {
    const momentY = e.clientY - this.startMouseDim.clientY;
    const momentX = this.ratioValue ? -momentY * this.ratioValue : e.clientX - this.startMouseDim.clientX;

    const maxHeight = this.startMouseDim.top +  this.startMouseDim.height - this.startMouseDim.imageTop;
    const maxWidth = this.startMouseDim.imageLeft + this.startMouseDim.imageWidth - this.startMouseDim.left ;

    let top = this.startMouseDim.top + momentY;
    let height = this.startMouseDim.height - momentY;
    let width = this.startMouseDim.width + momentX;

    height = Math.min(maxHeight, height) ;
    height = Math.max(MIN_HEIGHT, height);
    if (this.ratioValue) {
      width = height * this.ratioValue;
      width = Math.min(maxWidth, width);
      width = Math.max(MIN_WIDTH, width);
      height = width / this.ratioValue
    }
    width = Math.min(maxWidth, width);
    width = Math.max(MIN_WIDTH, width);
    top = this.startMouseDim.top + this.startMouseDim.height - height; 

    this.cropArea.nativeElement.style.top = `${top}px`;
    this.cropArea.nativeElement.style.width = `${width}px`;
    this.cropArea.nativeElement.style.height = `${height}px`;

    this.updateRectClipPos();
  }

  resizeCropFollowBRDir = (e: any) => {
    const momentY = e.clientY - this.startMouseDim.clientY;
    const momentX = this.ratioValue ? momentY * this.ratioValue : e.clientX - this.startMouseDim.clientX;

    //const top = this.startMouseDim.top + momentY;
    let height = this.startMouseDim.height + momentY;
    let width = this.startMouseDim.width + momentX;
    const maxHeight = this.startMouseDim.imageTop + this.startMouseDim.imageHeight - this.startMouseDim.top;
    const maxWidth = this.startMouseDim.imageLeft + this.startMouseDim.imageWidth - this.startMouseDim.left;
    
    // console.log('resizeCropFollowBRDir height=',height, maxHeight);

    height = Math.min(height,  maxHeight);
    height = Math.max(MIN_HEIGHT, height);
    if (this.ratioValue) {
      width = height * this.ratioValue;
      width = Math.min(maxWidth, width);
      width = Math.max(MIN_WIDTH, width);
      height = width / this.ratioValue;
    }
    width = Math.min(maxWidth, width);
    width = Math.max(MIN_WIDTH, width);
    //this.cropArea.nativeElement.style.top = `${top}px`;
    this.cropArea.nativeElement.style.width = `${width}px`;
    this.cropArea.nativeElement.style.height = `${height}px`;

    this.updateRectClipPos();
  }

  resizeCropFollowVLDir = (e: any) => {
    const momentX = e.clientX - this.startMouseDim.clientX;
    const momentY = this.ratioValue ? momentX / this.ratioValue : 0;

    const maxHeight = this.startMouseDim.top +  this.startMouseDim.height - this.startMouseDim.imageTop;
    const maxWidth = this.startMouseDim.left + this.startMouseDim.width - this.startMouseDim.imageLeft;

    let width = this.startMouseDim.width - momentX;
    let left = this.startMouseDim.left + momentX;
    let top = this.startMouseDim.top + momentY;
    let height = this.startMouseDim.height - momentY;

    height = Math.min(height,  maxHeight);
    height = Math.max(MIN_HEIGHT, height);
    if (this.ratioValue) {
      width = height * this.ratioValue;
      width = Math.min(maxWidth, width);
      width = Math.max(MIN_WIDTH, width);
      height = width / this.ratioValue;
    }
    width = Math.min(maxWidth, width);
    width = Math.max(MIN_WIDTH, width);
    left = this.startMouseDim.left + this.startMouseDim.width - width;
    top = this.startMouseDim.top + this.startMouseDim.height - height;

    this.cropArea.nativeElement.style.width = `${width}px`;
    this.cropArea.nativeElement.style.left = `${left}px`;
    this.cropArea.nativeElement.style.top = `${top}px`;
    this.cropArea.nativeElement.style.height = `${height}px`;

    this.updateRectClipPos();
  }

  resizeCropFollowVRDir = (e: any) => {
    const momentX = e.clientX - this.startMouseDim.clientX;
    const momentY = this.ratioValue ? -momentX / this.ratioValue : 0;
    const maxHeight = this.startMouseDim.top + this.startMouseDim.height - this.startMouseDim.imageTop;
    const maxWidth = this.startMouseDim.imageLeft + this.startMouseDim.imageWidth - this.startMouseDim.left;

    let width = this.startMouseDim.width + momentX;
    let top = this.startMouseDim.top + momentY;
    let height = this.startMouseDim.height - momentY;

    height = Math.min(height,  maxHeight);
    height = Math.max(MIN_HEIGHT, height);
    if (this.ratioValue) {
      width = height * this.ratioValue;
      width = Math.min(maxWidth, width);
      width = Math.max(MIN_WIDTH, width);
      height = width / this.ratioValue;
    }
    width = Math.min(maxWidth, width);
    width = Math.max(MIN_WIDTH, width);
    top = this.startMouseDim.top + this.startMouseDim.height - height;

    this.cropArea.nativeElement.style.width = `${width}px`;
    this.cropArea.nativeElement.style.top = `${top}px`;
    this.cropArea.nativeElement.style.height = `${height}px`;

    this.updateRectClipPos();
  }

  resizeCropFollowHTDir = (e: any) => {
    const momentY = e.clientY - this.startMouseDim.clientY;
    const momentX = this.ratioValue ? momentY * this.ratioValue : 0;
    const maxHeight = this.startMouseDim.top + this.startMouseDim.height - this.startMouseDim.imageTop;
    const maxWidth = this.startMouseDim.width + this.startMouseDim.left - this.startMouseDim.imageLeft;

    let top = this.startMouseDim.top + momentY;
    let height = this.startMouseDim.height - momentY;
    let left = this.startMouseDim.left + momentX;
    let width = this.startMouseDim.width - momentX;

    height = Math.min(height,  maxHeight);
    height = Math.max(MIN_HEIGHT, height);
    if (this.ratioValue) {
      width = height * this.ratioValue;
      width = Math.min(maxWidth, width);
      width = Math.max(MIN_WIDTH, width);
      height = width / this.ratioValue;
    }
    width = Math.min(maxWidth, width);
    width = Math.max(MIN_WIDTH, width);
    top = this.startMouseDim.top + this.startMouseDim.height - height;
    left = this.startMouseDim.left + this.startMouseDim.width - width;

    this.cropArea.nativeElement.style.height = `${height}px`;
    this.cropArea.nativeElement.style.top = `${top}px`;
    this.cropArea.nativeElement.style.left = `${left}px`;
    this.cropArea.nativeElement.style.width = `${width}px`;

    this.updateRectClipPos();
  }

  resizeCropFollowHBDir = (e: any) => {
    const momentY = e.clientY - this.startMouseDim.clientY;
    const momentX = this.ratioValue ? momentY * this.ratioValue : 0;
    const maxHeight = this.startMouseDim.imageTop + this.startMouseDim.imageHeight - this.startMouseDim.top;
    const maxWidth = this.startMouseDim.width + this.startMouseDim.left - this.startMouseDim.imageLeft;

    let height = this.startMouseDim.height + momentY;
    let left = this.startMouseDim.left - momentX;
    let width = this.startMouseDim.width + momentX;

    height = Math.min(height,  maxHeight);
    height = Math.max(MIN_HEIGHT, height);
    if (this.ratioValue) {
      width = height * this.ratioValue;
      width = Math.min(maxWidth, width);
      width = Math.max(MIN_WIDTH, width);
      height = width / this.ratioValue;
    }
    width = Math.min(maxWidth, width);
    width = Math.max(MIN_WIDTH, width);
    left = this.startMouseDim.left + this.startMouseDim.width - width;

    this.cropArea.nativeElement.style.height = `${height}px`;
    this.cropArea.nativeElement.style.left = `${left}px`;
    this.cropArea.nativeElement.style.width = `${width}px`;

    this.updateRectClipPos();
  }

  moveImage = (e: any) => {
    const momentY = e.clientY - this.startMouseDim.clientY;
    const momentX = e.clientX - this.startMouseDim.clientX;

    const imgTop = this.startMouseDim.imageTop + momentY;
    const imgLeft = this.startMouseDim.imageLeft + momentX;

    this.imageOrigin.nativeElement.style.top = `${imgTop}px`;
    this.imageOrigin.nativeElement.style.left = `${imgLeft}px`;

    this.imageClip.nativeElement.style.top = `${imgTop}px`;
    this.imageClip.nativeElement.style.left = `${imgLeft}px`;

    const top = this.startMouseDim.top + momentY;
    const left = this.startMouseDim.left + momentX;

    this.cropArea.nativeElement.style.left = `${left}px`;
    this.cropArea.nativeElement.style.top = `${top}px`;
  }

  moveClipArea = (e: any) => {
    const imgLeft = parseInt(this.imageClip.nativeElement.style.left);
    const imgTop = parseInt(this.imageClip.nativeElement.style.top);
    const imgWidth = parseInt(this.imageClip.nativeElement.offsetWidth);
    const imgHeight = parseInt(this.imageClip.nativeElement.offsetHeight);

    const cropWidth = parseInt(this.cropArea.nativeElement.offsetWidth);
    const cropHeight = parseInt(this.cropArea.nativeElement.offsetHeight);

    const momentY = e.clientY - this.startMouseDim.clientY;
    const momentX = e.clientX - this.startMouseDim.clientX;

    let top = Math.max(imgTop, this.startMouseDim.top + momentY);
    let left = Math.max(imgLeft, this.startMouseDim.left + momentX);
    
    top = Math.min(top, imgTop + imgHeight - cropHeight);
    left = Math.min(left, imgLeft + imgWidth - cropWidth);

    this.cropArea.nativeElement.style.left = `${left}px`;
    this.cropArea.nativeElement.style.top = `${top}px`;

    this.updateRectClipPos();
  }

  getRectClipImage = () => {
    
    const imageRect = this.imageClip.nativeElement.getBoundingClientRect();
    const cropRect = this.cropArea.nativeElement.getBoundingClientRect();
    const width = parseInt(cropRect.width);
    const height = parseInt(cropRect.height);
    const left = cropRect.left - imageRect.left;
    const top = cropRect.top - imageRect.top;
    const right = left + width;
    const bottom = top + height;

    const ratio = this.originWidth / imageRect.width ;

    this.rectClip = {
      left: left,
      top: top,
      right: right,
      bottom: bottom,
      width: width,
      height: height
    };

    this.cropSize = {
      width: parseInt(`${(right - left) * ratio}`),
      height: parseInt(`${(bottom - top) * ratio}`)
    }
    this.detectChanges();
    
    return this.rectClip;
  }

  updateRectClipPos = () => {
    const reactClip = this.getRectClipImage();
    this.imageClip.nativeElement.style.clip = `rect(${reactClip.top}px, ${reactClip.right}px, ${reactClip.bottom}px, ${reactClip.left}px)`;
  }

  setImagePosition(width: number, height: number ){
    const left = CONTAINER_WIDTH / 2 - width / 2;
    const top = CONTAINER_HEIGHT / 2 - height / 2;

    this.imageOrigin.nativeElement.style.left = `${left}px`;
    this.imageOrigin.nativeElement.style.width = `${width}px`;
    this.imageOrigin.nativeElement.style.height = `${height}px`;
    this.imageOrigin.nativeElement.style.top = `${top}px`;
    this.imageOrigin.nativeElement.style.display = 'block';
    
    this.imageClip.nativeElement.style.top = `${top}px`;
    this.imageClip.nativeElement.style.left = `${left}px`;
    this.imageClip.nativeElement.style.width = `${width}px`;
    this.imageClip.nativeElement.style.height = `${height}px`;
    this.imageClip.nativeElement.style.display = 'block';
    
  }

  updateCropAreaPos() {
    const imgTop = parseInt(this.imageClip.nativeElement.style.top);
    const imgLeft = parseInt(this.imageClip.nativeElement.style.left);
    const imgWidth = parseInt(this.imageClip.nativeElement.offsetWidth);
    const imgHeight = parseInt(this.imageClip.nativeElement.offsetHeight);

    const rectImg : {
      top: number;
      left: number;
      width: number;
      height: number;
    } = {
      top:  Math.max(0, imgTop),
      left: Math.max(0, imgLeft),
      width: imgWidth,
      height: imgHeight
    }

    if (imgLeft < 0) {
      rectImg.width = Math.min(imgWidth + imgLeft, CONTAINER_WIDTH);
    } else {
      rectImg.width = Math.min(imgWidth, CONTAINER_WIDTH - imgLeft);
    }

    if (imgTop < 0) {
      rectImg.height = Math.min(imgTop + imgHeight, CONTAINER_HEIGHT);
    } else {
      rectImg.height = Math.min(imgHeight, CONTAINER_HEIGHT - imgTop);
    }

    this.ratioValue = this.getCropRatioValue();
    if (!this.ratioValue) {
      this.cropArea.nativeElement.style.top = `${rectImg.top}px`;
      this.cropArea.nativeElement.style.left = `${rectImg.left}px`;
      this.cropArea.nativeElement.style.width = `${rectImg.width}px`;
      this.cropArea.nativeElement.style.height = `${rectImg.height}px`;
      return;
    }
    
    let width = rectImg.width;
    let height = width / this.ratioValue;
    if (this.ratioValue) { 
      width = Math.min(rectImg.width, width);
      height = width / this.ratioValue;
      height =  Math.min(rectImg.height, height);
      width = height * this.ratioValue;
    }

    let top = rectImg.top + (rectImg.height - height) / 2;
    let left = rectImg.left + (rectImg.width - width) / 2;

    this.cropArea.nativeElement.style.top = `${top}px`;
    this.cropArea.nativeElement.style.left = `${left}px`;
    this.cropArea.nativeElement.style.width = `${width}px`;
    this.cropArea.nativeElement.style.height = `${height}px`;
  }

  public showModal() {
    this.isOpen = true;
  }

  public hideModal() {
    this.isOpen = false;
    this.onClose.emit({});
  }

  handleOnCancel() {
    this.hideModal();
  }

  handleOnCropImage() {
    this.cropImage(null);
  }

  handleOnZoomInImage() {
    this.zoomImage(1.1);
    // this.changeCropMode(false);
  }

  handleOnZoomOutImage() {
    this.zoomImage(1/1.1);
    // this.changeCropMode(false);
  }

  handleOnRotateImage() {
    this.rotateImage();
    // this.changeCropMode(false);
  }

  handleOnRestoreImage() {
    this.restoreImage();
  }

  handleOnSelectFipImage() {
    this.flipImage();
  }

  handleOnSelectMirrorImage() {
    this.mirrorImage();
  }

  handleOnSelectCropRatioPopup() {
    // this.detectChanges();
    this.isCropRatioShow = true;
    this.detectChanges();
  }

  handleOnClickOverlayCropRatioPopup() {
    this.isCropRatioShow = false;
    this.detectChanges();
  }

  handleOnCropRatioItemSelect(item: any, index: number) {
    // if (this.selectedCropRatioIndex === index) {
    //   return;
    // }
    this.selectedCropRatioIndex = index;
    this.isCropRatioShow = false;
    this.isImageChanged = true;
    this.detectChanges();

    this.changeCropRatio();
  }

  handleOnSelectCropMode() {
    this.changeCropMode(!this.isCropMode);
  }

  handleOnClickOverlayResizePopup() {
    this.isResizeShow = false;
    this.detectChanges();
  }

  handleOnSelectResize() {
    this.openResizePopup();
  }

  handleOnResizeRatioChange(value: any) {
    // console.log('handleOnResizeRatioChange ratio=', this.resizeData.ratio);
    let ratio = parseInt(`${value}`);
    // console.log('handleOnResizeRatioChange ratio = ', ratio);
    if (!ratio || ratio < 0) {
      return;
    }

    if (ratio > 100) {
      ratio = 100;
      this.resizeData.ratio = ratio;
      // value.substring(0,2)
    };

    this.resizeData.ratio = ratio;
    this.resizeData.width = Math.max(parseInt(`${this.originWidth * ratio / 100}`), 1);
    this.resizeData.height  = Math.max(parseInt(`${this.originHeight * ratio / 100}`), 1);
    this.detectChanges();
  }

  handleOnResizeWidthChange(value: any) {
    let width = parseInt(`${value}`);
    if (!width) {
      this.resizeData.width = 1;
      width = 1;
    }
    
    if (width > this.originWidth) {
      this.resizeData.width = this.originWidth;
      width = this.originWidth;
    }
    this.resizeData.width = width;
    this.resizeData.height = Math.max(parseInt(`${width * this.originHeight / this.originWidth}`), 1);
    this.resizeData.ratio  = Math.max(parseInt(`${100 * width / this.originWidth}`) , 1);
    
    this.detectChanges();
  }

  handleOnResizeHeightChange(value: any) {
    let height = parseInt(`${value}`);
    if (!height) {
      this.resizeData.height = 1;
      height = 1;
    }

    if (height > this.originHeight) {
      this.resizeData.height = this.originHeight;
      height = this.originHeight;
    }
    this.resizeData.height = height;
    this.resizeData.width = Math.max(parseInt(`${this.originWidth * height / this.originHeight}`), 1);
    this.resizeData.ratio  = Math.max(parseInt(`${100*height / this.originHeight}`), 1);

    this.detectChanges();
  }

  handleOnCancelResizePopup() {
    this.isResizeShow = false;
    this.detectChanges();
  }

  handleOnSaveResize() {
    this.isResizeShow = false;
    this.detectChanges();
    this.saveResize();
  }

  handleOnSaveClick(event: any) {
    event.stopPropagation();
    this.cropImage((dataUrl: string)=> {
      this.saveFile(dataUrl);
    });
  }

  handleOnSaveNewFileClick(event: any) {
    event.stopPropagation();
    this.cropImage((dataUrl: string)=> {
      console.log('dataUrl=', dataUrl);
      if (this.saveDefaultFolder) {
        this.saveNewFile(null, dataUrl);
      } else {
        this.showSelectFolder(dataUrl);
      }
    });
  }

  handleOnSelectFile(event: any) {
    event.stopPropagation();
    this.cropImage((dataUrl: string)=> {
      this.selectFile(dataUrl);
    });
  }

  handleOnCropWidthChange(event: any) {
    this.resizeCropWidth(event);
    this.detectChanges();
  }

  handleOnCropHeightChange(event: any) {
    this.resizeCropHeight(event);
    this.detectChanges();
  }

  handleOnMousewheel = (event: any) => {
    event.preventDefault();
    if (!this.hasZoom) {
      return;
    }
    if (event.deltaY < 0) {
      this.zoomImage(1/1.1);
      return;
    }
    this.zoomImage(1.1);
  }

  zoomImage(scale: number) {
    const currWidth = parseInt(this.imageOrigin.nativeElement.offsetWidth);
    const currHeight = parseInt(this.imageOrigin.nativeElement.offsetHeight);
    const currTop = parseInt(this.imageOrigin.nativeElement.style.top);
    const currLeft = parseInt(this.imageOrigin.nativeElement.style.left);

    let width = Math.max(currWidth * scale, 50);
    let height = this.imageOrigin.nativeElement.offsetHeight * width /  this.imageOrigin.nativeElement.offsetWidth; ///currHeight * scale;
    const top = currTop + (currHeight - height) / 2;
    const left = currLeft + (currWidth - width) / 2;
    
    const movementY = currTop - top;
    const movementX = currLeft - left;

    let cropTop = parseInt(this.cropArea.nativeElement.style.top);
    let cropLeft = parseInt(this.cropArea.nativeElement.style.left);
    let cropWidth = parseInt(this.cropArea.nativeElement.offsetWidth);
    let cropHeight = parseInt(this.cropArea.nativeElement.offsetHeight);
    
    cropLeft = Math.max(cropLeft, left);
    cropTop = Math.max(cropTop, top);

    const maxCropWidth = width + left - cropLeft;
    const maxCropHeight = height +  top - cropTop;
    const minWidth = 20;
    const minHeight = 20;
    cropWidth = Math.min(cropWidth, maxCropWidth);
    cropHeight = Math.min(cropHeight, maxCropHeight);
  
    cropWidth = Math.max(cropWidth, minWidth);
    cropHeight = Math.max(cropHeight, minHeight);

    this.ratioValue = this.getCropRatioValue();
    if (this.ratioValue) {
      cropHeight = cropWidth / this.ratioValue;
      cropHeight = Math.min(cropHeight, maxCropHeight);
      cropHeight = Math.max(cropHeight, minHeight);
      cropWidth = cropHeight * this.ratioValue;
    }

    this.cropArea.nativeElement.style.top = `${cropTop}px`;
    this.cropArea.nativeElement.style.left = `${cropLeft}px`;
    this.cropArea.nativeElement.style.width = `${cropWidth}px`;
    this.cropArea.nativeElement.style.height = `${cropHeight}px`;


    this.rectClip.top = cropTop - top;
    this.rectClip.left = cropLeft - left;
    this.rectClip.right = this.rectClip.left + cropWidth;
    this.rectClip.bottom = this.rectClip.top + cropHeight;



    this.imageOrigin.nativeElement.style.top = `${top}px`;
    this.imageOrigin.nativeElement.style.left = `${left}px`;
    this.imageOrigin.nativeElement.style.width = `${width}px`;
    this.imageOrigin.nativeElement.style.height = `${height}px`;

    this.imageClip.nativeElement.style.top = `${top}px`;
    this.imageClip.nativeElement.style.left = `${left}px`;
    this.imageClip.nativeElement.style.width = `${width}px`;
    this.imageClip.nativeElement.style.height = `${height}px`;

    this.imageClip.nativeElement.style.clip =  `rect(${this.rectClip.top}px, ${this.rectClip.right}px, ${this.rectClip.bottom}px, ${this.rectClip.left}px)`;

    this.getRectClipImage();
    
  }

  cropImage(callback: (dataUrl: string) => void) {
    this.image.src = this.imgSrcList[this.imgSrcList.length - 1];
    this.image.onload = () => {
      var canvas = document.createElement('canvas');
      const originWidth = this.image.width;
      const originHeight = this.image.height;
      const width = parseInt(this.imageClip.nativeElement.offsetWidth);
      const height = parseInt(this.imageClip.nativeElement.offsetHeight);

      const scale = originWidth / width;
      const rectClip = this.getRectClipImage();

      const cropRect = this.getCropRectImage(rectClip, width, height, scale);
      canvas.height = cropRect.height;
      canvas.width = cropRect.width;
      this.originHeight = canvas.height;
      this.originWidth = canvas.width; 
      canvas.getContext('2d').drawImage(this.image, cropRect.left, cropRect.top, cropRect.width, cropRect.height, 0,0, cropRect.width, cropRect.height);
      var dataUrl = this.getDataUrl(canvas);

      // this.imgSrcList = [dataUrl];
      // this.imageClip.nativeElement.src = dataUrl;
      // this.imageOrigin.nativeElement.src = dataUrl;

      // this.updateOriginImageSize();
      this.changeImageStatus(true);

      callback(dataUrl);
    }
  }

  getCropRectImage(rectClip: {left: number; top: number; width: number; height: number; }, imgWidth: number, imgHeight: number, scale: number ) {
    return {
      left: Math.max(rectClip.left * scale, 0),
      top: Math.max(rectClip.top * scale, 0),
      width: rectClip.width * scale,
      height: rectClip.height * scale
    }
  }

  rotateImage() {
    this.image.src = this.imgSrcList[this.imgSrcList.length - 1];;
    this.image.onload = () => { 
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext("2d");

      const width = parseInt(this.imageOrigin.nativeElement.offsetWidth);
      const height = parseInt(this.imageOrigin.nativeElement.offsetHeight);
      const originWidth = this.image.width;
      const originHeight = this.image.height;
      let top = parseInt(this.imageOrigin.nativeElement.style.top);
      let left = parseInt(this.imageOrigin.nativeElement.style.left);

      let newHeight = width;
      let newWidth = height;

      const ratio = newWidth / newHeight ;

      // canvas.height = originHeight;
      // canvas.width = originHeight;
      // ctx.drawImage(this.image,0,0, originWidth, originHeight);

      canvas.height = originWidth;
      canvas.width = originHeight;
      // 
      ctx.translate(originHeight / 2, originWidth / 2);
      ctx.rotate(Math.PI / 2);      
      ctx.drawImage(this.image, -originWidth / 2, -originHeight / 2);

      var dataUrl = this.getDataUrl(canvas);
      this.imgSrcList = [dataUrl];
      
      newWidth = Math.max(newWidth, originHeight);
      newWidth = Math.min(newWidth, CONTAINER_WIDTH);
      newHeight = newWidth / ratio;

      newHeight = Math.max(newHeight, originWidth);
      newHeight = Math.min(newHeight, CONTAINER_HEIGHT);
      newWidth = newHeight * ratio;

      top = top - (newHeight / 2 - height / 2);
      left = left - (newWidth / 2 - width / 2);

      this.imageOrigin.nativeElement.src = dataUrl;
      this.imageOrigin.nativeElement.style.width = `${newWidth}px`;
      this.imageOrigin.nativeElement.style.height = `${newHeight}px`;
      this.imageOrigin.nativeElement.style.top = `${top}px`;
      this.imageOrigin.nativeElement.style.left = `${left}px`;

      this.imageClip.nativeElement.src = dataUrl;
      this.imageClip.nativeElement.style.width = `${newWidth}px`;
      this.imageClip.nativeElement.style.height = `${newHeight}px`;
      this.imageClip.nativeElement.style.top = `${top}px`;
      this.imageClip.nativeElement.style.left = `${left}px`;

      this.updateCropAreaPos();
      this.updateRectClipPos();

      this.getOriginalImageSize(()=> {
        this.cropSize.width = this.originWidth;
        this.cropSize.height = this.originHeight;
        // console.log('origin height=', this.originHeight, ' origin width=', this.originWidth); 
        this.detectChanges();
      });

      this.changeImageStatus(true);
      this.detectChanges();
    }
  }

  flipImage() {
    this.image.src = this.imgSrcList[this.imgSrcList.length - 1];
    this.image.onload = () => { 
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext("2d");
      const width = this.image.width; // parseInt(this.imageOrigin.nativeElement.offsetWidth);
      const height = this.image.height; // parseInt(this.imageOrigin.nativeElement.offsetHeight);
      canvas.height = height;
      canvas.width = width;

      ctx.drawImage(this.image, 0, 0, width, height);
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(this.image, 0, 0);
      // ctx.restore();

      var dataUrl = this.getDataUrl(canvas);
      this.imgSrcList = [dataUrl];


      this.imageOrigin.nativeElement.src = dataUrl;
      this.imageClip.nativeElement.src = dataUrl;

      this.updateCropAreaPos();
      this.updateRectClipPos();
      this.changeImageStatus(true);
    }
  }

  mirrorImage() {
    this.image.src = this.imgSrcList[this.imgSrcList.length - 1];;
    console.log('src=',  this.image.src );
    this.image.onload = () => { 
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext("2d");
      const width = this.image.width; // parseInt(this.imageOrigin.nativeElement.offsetWidth);
      const height = this.image.height; // parseInt(this.imageOrigin.nativeElement.offsetHeight);
      canvas.height = height;
      canvas.width = width;

      ctx.drawImage(this.image, 0, 0, width, height);
      ctx.translate(0, height);
      ctx.scale(1, -1);
      ctx.drawImage(this.image, 0, 0);

      var dataUrl = this.getDataUrl(canvas);
      this.imgSrcList = [dataUrl];


      this.imageOrigin.nativeElement.src = dataUrl;
      this.imageClip.nativeElement.src = dataUrl;

      this.updateCropAreaPos();
      this.updateRectClipPos();

      this.changeImageStatus(true);
    }
  }

  restoreImage() {
    this.imgSrcList = [this.dataUrlOrigin];
    this.getOriginalImageSize(()=>{
      this.updateOriginImageSize();
      this.changeImageStatus(false);
      
      this.selectedCropRatioIndex = 1;
      this.updateCropAreaPos();
      this.updateRectClipPos();

      this.detectChanges();
    });
  }

  changeCropRatio() {
    this.updateOriginImageSize();
  }

  changeCropMode(isCropMode: boolean) {
    this.isCropMode = isCropMode;
    this.detectChanges();

    if (!this.isCropMode) {
      // this.updateOriginImageSize();
      return;
    }

    // this.setImagePosition(width, height);
    this.updateCropAreaPos();
    this.updateRectClipPos();
  }

  openResizePopup() {
    this.isResizeShow = true;
    this.resizeData.ratio = 100;
    this.resizeData.width = this.originWidth;
    this.resizeData.height = this.originHeight;
    this.detectChanges();
  }

  saveResize() {
    this.image.src = this.imgSrcList[this.imgSrcList.length - 1];
    this.image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = this.resizeData.width;
      canvas.height = this.resizeData.height;
      canvas.getContext('2d').drawImage(this.image, 0, 0, canvas.width, canvas.height);
      const dataUrl = this.getDataUrl(canvas);

      const currWidth = parseInt(this.imageOrigin.nativeElement.offsetWidth);
      const currHeight = parseInt(this.imageOrigin.nativeElement.offsetHeight);
      const currTop = parseInt(this.imageOrigin.nativeElement.style.top);
      const currLeft = parseInt(this.imageOrigin.nativeElement.style.left);

      const ratio = currWidth / currHeight ;
      let newWidth = Math.min(this.resizeData.width, CONTAINER_WIDTH);
      let newHeight = newWidth / ratio ;
      newHeight = Math.min(this.resizeData.height, CONTAINER_HEIGHT);
      newWidth = newHeight * ratio;
      
      Math.min(this.resizeData.height, CONTAINER_HEIGHT);


      const top = currTop + (currHeight - newHeight) / 2;
      const left = currLeft + (currWidth - newWidth) / 2;
      
      const movementY = currTop - top;
      const movementX = currLeft - left;

      this.rectClip.top = this.rectClip.top + movementY ;
      this.rectClip.left = this.rectClip.left + movementX;
      this.rectClip.right = this.rectClip.left + newWidth;
      this.rectClip.bottom = this.rectClip.top + newHeight;

      this.imageOrigin.nativeElement.src = dataUrl;
      this.imageOrigin.nativeElement.style.top = `${top}px`;
      this.imageOrigin.nativeElement.style.left = `${left}px`;
      this.imageOrigin.nativeElement.style.width = `${newWidth}px`;
      this.imageOrigin.nativeElement.style.height = `${newHeight}px`;

      this.imageClip.nativeElement.src = dataUrl;
      this.imageClip.nativeElement.style.top = `${top}px`;
      this.imageClip.nativeElement.style.left = `${left}px`;
      this.imageClip.nativeElement.style.width = `${newWidth}px`;
      this.imageClip.nativeElement.style.height = `${newHeight}px`;

      this.imageClip.nativeElement.style.clip =  `rect(${this.rectClip.top}px, ${this.rectClip.right}px, ${this.rectClip.bottom}px, ${this.rectClip.left}px)`;

      this.imgSrcList = [dataUrl];
      this.originWidth = this.resizeData.width;
      this.originHeight = this.resizeData.height;

      // this.changeCropMode(false);
      this.updateCropAreaPos();
      this.updateRectClipPos();

      this.changeImageStatus(true);
    }
  }

  changeImageStatus(status: boolean) {
    // if (this.isImageChanged) {
    //   this.selectedCropRatioIndex = 1;
    //   this.updateCropAreaPos();
    //   this.updateRectClipPos();
    // }
    this.isImageChanged = status;
    this.detectChanges();
  }

  resizeCropWidth(value: any) {
    let val = parseInt(value);
    this.ratioValue = this.getCropRatioValue();
    
    const currImgWidth = this.imageOrigin.nativeElement.offsetWidth;
    const currImgLeft = parseInt(this.imageOrigin.nativeElement.style.left);
    const currImgHeight = this.imageOrigin.nativeElement.offsetHeight;
    const currImgTop = parseInt(this.imageOrigin.nativeElement.style.top);
    
    const cropLeft =  parseInt(this.cropArea.nativeElement.style.left);
    const cropTop =  parseInt(this.cropArea.nativeElement.style.top);
    let cropWidth = parseInt(this.cropArea.nativeElement.offsetWidth);
    let cropHeight = parseInt(this.cropArea.nativeElement.offsetHeight);
    
    const maxCropWidth = currImgLeft + currImgWidth - cropLeft;
    const maxCropHeight = currImgHeight + currImgTop - cropTop;
    const ratio = this.originWidth / currImgWidth ;
    
    cropWidth = Math.min(this.cropSize.width / ratio, maxCropWidth);
    cropWidth = Math.max(1, cropWidth);
    cropWidth = val / ratio;

    
    if (this.ratioValue) {
      cropHeight = cropWidth / this.ratioValue;
      cropHeight = Math.min(cropHeight, maxCropHeight);
      // cropHeight = Math.max(cropHeight, minHeight);
      cropWidth = cropHeight * this.ratioValue;
      this.cropSize.height = parseInt(`${cropHeight * ratio}`);
      this.cropArea.nativeElement.style.height = `${cropHeight}px`;
    }
    
    this.cropSize.width = parseInt(`${cropWidth * ratio}`);
    this.detectChanges();
    
    // this.cropArea.nativeElement.style.top = `${top}px`;
    // this.cropArea.nativeElement.style.left = `${left}px`;
    this.cropArea.nativeElement.style.width = `${cropWidth}px`;
    
    if(val > this.originWidth){
      val = this.originWidth
      this.cropSize.height = this.originHeight;
    }
    if(!val){
      val = 1;
    }
    // this.updateRectClipPos();
    
    const imageRect = this.imageClip.nativeElement.getBoundingClientRect();
    const cropRect = this.cropArea.nativeElement.getBoundingClientRect();
    const width = cropRect.width;
    const height = cropRect.height;
    const left = cropRect.left - imageRect.left;
    const top = cropRect.top - imageRect.top;
    const right = left + width;
    const bottom = top + height;

    this.rectClip.height = parseInt(this.cropArea.nativeElement.style.height);
    this.imageClip.nativeElement.style.clip = `rect(${top}px, ${right}px, ${bottom}px, ${left}px)`;
    this.detectChanges();
  }

  resizeCropHeight(value: any) {
    let val = parseInt(value)
    this.ratioValue = this.getCropRatioValue();

    const currImgWidth = this.imageOrigin.nativeElement.offsetWidth;
    const currImgLeft = parseInt(this.imageOrigin.nativeElement.style.left);
    const currImgHeight = this.imageOrigin.nativeElement.offsetHeight;
    const currImgTop = parseInt(this.imageOrigin.nativeElement.style.top);

    const cropLeft =  parseInt(this.cropArea.nativeElement.style.left);
    const cropTop =  parseInt(this.cropArea.nativeElement.style.top);
    let cropWidth = parseInt(this.cropArea.nativeElement.offsetWidth);
    let cropHeight = parseInt(this.cropArea.nativeElement.offsetHeight);

    const maxCropWidth = currImgLeft + currImgWidth - cropLeft;
    const maxCropHeight = currImgHeight + currImgTop - cropTop;
    const ratio = this.originWidth / currImgWidth ;
    
    cropHeight = Math.min(this.cropSize.height / ratio, maxCropHeight);
    cropHeight = Math.max(1, cropHeight);
    cropHeight = val / ratio;

    
    if (this.ratioValue) {
      cropWidth = cropHeight * this.ratioValue;
      cropWidth = Math.min(cropWidth, maxCropWidth);
      cropHeight = cropWidth / this.ratioValue;
      this.cropSize.width = parseInt(`${cropWidth * ratio}`);
      this.cropArea.nativeElement.style.width = `${cropWidth}px`;
    }
    
    
    this.cropSize.height = parseInt(`${cropHeight * ratio}`);
    this.detectChanges();
    this.cropArea.nativeElement.style.height = `${cropHeight}px`;
    
    if(val > this.originHeight){
      val = this.originHeight;
    }
    if(!val){
      val = 1;
    }
    // this.updateRectClipPos();
    
    const imageRect = this.imageClip.nativeElement.getBoundingClientRect();
    const cropRect = this.cropArea.nativeElement.getBoundingClientRect();
    const width = cropRect.width;
    const height = cropRect.height;
    const left = cropRect.left - imageRect.left;
    const top = cropRect.top - imageRect.top;
    const right = left + width;
    const bottom = top + height;

    this.rectClip.width = parseInt(this.cropArea.nativeElement.style.width);
    this.imageClip.nativeElement.style.clip = `rect(${top}px, ${right}px, ${bottom}px, ${left}px)`;
    this.detectChanges();
  }

  getCropRatioValue() { 
    const cropRatio = this.cropRatioList[this.selectedCropRatioIndex];
    let value: number = cropRatio.value;
    if (cropRatio.key === 'Origin') {
      value = this.imageOrigin.nativeElement.offsetWidth / this.imageOrigin.nativeElement.offsetHeight;
    }

    return value;
  }

  getOriginalImageSize(callback?: () => void) {
    this.image.src = this.imgSrcList[this.imgSrcList.length - 1];
    this.image.onload = () => {
      this.originWidth = this.image.width;
      this.originHeight = this.image.height;

      if (callback) {
        callback();
      }
    }
  }

  getDataUrl(canvas: any) {
    // if (this.mimetype) {
    //   return canvas.toDataURL(this.mimetype);
    // }
    const url = canvas.toDataURL('image/jpeg', this.quality / 100);
    // console.log('getDataUrl url=', url);
    return url;
  }
  
  dataURLToBlob(dataURL: string) {
    // console.log('dataURL=', dataURL, this.imgSrcList);
		var BASE64_MARKER = ';base64,';
		if (dataURL.indexOf(BASE64_MARKER) == -1) {
			const parts = dataURL.split(',');
			const contentType = parts[0].split(':')[1];
			const raw = parts[1];
			const blob = new Blob([raw], { type: contentType });
      return blob;
		}

		const parts = dataURL.split(BASE64_MARKER);
		const contentType = parts[0].split(':')[1];
		const raw = window.atob(parts[1]);
		const rawLength = raw.length;
    
		var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
			uInt8Array[i] = raw.charCodeAt(i);
		}
		const blob = new Blob([uInt8Array], { type: contentType });
    // console.log('dataURLToBlob contentType=',contentType);
    return blob;
	}

  async saveFile(dataUrl: string) {
    if (this.loading || !this.imgSrcList || !this.imgSrcList.length) {
      return;
    }
    // fix url media, case url need timestamp to update image.
    const url = this.originUrl && this.originUrl.split('?').length && this.originUrl.split('?')[0];
    if (!url) {
      return; 
    }
    this.loading = true;
    this.detectChanges();
    const file = this.dataURLToBlob(dataUrl);
    // const response = await this._fileApiService.saveFile(file, url);
    // this.loading = false;
    // if (response) {
    //   this.isImageChanged = false;
    //   this.hideModal();
    //   this.onSaveFileOk.emit(response);
    //   this._toast.show('success', 'i18n_notification_manipulation_success');//'Lưu ảnh thành công.');
    // }
    this.detectChanges();
  }

  async saveNewFile(folderId: string, dataUrl: string) {
    this.loading = true;
    this.detectChanges();
    const file = this.dataURLToBlob(dataUrl);
    let ext;
    switch(file.type) {
      case 'image/png':
        ext = 'png';
        break;
      case 'image/gif':
        ext = 'gif';
        break;
      case 'image/jpeg':
        ext = 'jpeg';
        break;
      default: 
        ext = 'png';
    }
    const fileName = `${Date.now()}.${ext}`;
    // console.log('fileName=',fileName);
    // const response = await  this._fileApiService.uploadFile(file, folderId, fileName);
    // this.loading = false;
    // if (response) {
    //   this.isImageChanged = false;
    //     this.hideModal();
    //     this.onSaveFileOk.emit(response);
    //     this._toast.show('success', 'i18n_notification_manipulation_success');//'Lưu ảnh mới thành công.');
    // }
    this.detectChanges();
  }

  showSelectFolder(dataUrl: string) {
    if (this.loading || !this.imgSrcList || !this.imgSrcList.length) {
      return;
    }
    console.log('showSelectFolder level=', 5)
    const modalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreEditAddNewFileComponent).create(this.injector);
    modalRef.instance.folderId = this.folderId;
    modalRef.instance.level = 25;
     
    modalRef.instance.onClose.subscribe((event: any) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });

    modalRef.instance.onSelectFolder.subscribe((folderId: string) => {
      this.saveNewFile(folderId, dataUrl);
    });

    this._domService.addDomToBody(modalRef);
  }

  selectFile(dataUrl: string) {
    if (!dataUrl) {
      return;
    }
    const file = this.dataURLToBlob(dataUrl);
    this.hideModal();
    this.onFileSelected.emit({file:file, url: dataUrl});
  }

  override ngOnDestroy() {
    document.removeEventListener('mousemove', this.handleOnMousemove);
    document.removeEventListener('mouseup', this.handleOnMouseup);
    document.removeEventListener('wheel', this.handleOnMousewheel);
    window.removeEventListener('resize', this.handleOnWindowResize);
    window.removeEventListener('resize', this.handleOnWindowResize, false);

    this.imageContainer.nativeElement.removeEventListener('mousedown', this.handleOnImageContainerMousedown);
    this.cropTL.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeTL);
    this.cropBL.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeBL);
    this.cropBR.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeBR);
    this.cropTR.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeTR);
    this.cropLineVL.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeVL);
    this.cropLineVR.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeVR);
    this.cropLineHT.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeHT);
    this.cropLineHB.nativeElement.removeEventListener('mousedown', this.handleOnCropResizeHB);
    this.cropArea.nativeElement.removeEventListener('mousedown', this.handleOnMousedownCropArea);
  }

  handleOnImageQualityChange(value: number) {
    this.quality = value;
    this.detectChanges();
  }
}
