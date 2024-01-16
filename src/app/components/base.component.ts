import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef, ViewRef, Injector } from '@angular/core';
import { AddComponentToBodyService } from '../api/common/add-component-to-body.service';
// import { CacheService } from '../api/common/cache.service';
import { ToastTranslateService } from '../api/common/toast-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  template: "<div></div>",
})
export class MoWbBaseComponent implements OnInit {
  constructor(
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    public _toast: ToastTranslateService,
    public _changeDetection: ChangeDetectorRef,
    // public _cacheService: CacheService,
    public _translate: TranslateService,
    public _componentFactoryResolver: ComponentFactoryResolver,
    public _sanitizer: DomSanitizer,
    public _location: Location,
  ) {
    this.extendConstructor();
    // window.addEventListener('popstate', ()=>{
    //   this._location.back()
    // })
  }

  extendConstructor() {}

  ngOnInit() {
    this.onInit();
  }

  onInit() {

  }

  ngAfterViewInit() {
    this.onAfterInit();
  }

  onAfterInit() {

  };

  detectChanges() {
    try{
      if (this._changeDetection && !(this._changeDetection as ViewRef).destroyed) {
        this._changeDetection.detectChanges();
      }
    } catch(ex) {
      console.log('detectChanges ex=',ex);
    }
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  onDestroy() {

  }

  validate() : boolean {
    return true;
  }

  /**
   * handle on confirm remove 
   */
  handleOnConfirmClose() {
    this.detectChanges();
  }

  /**
   * update docking pos
   */
  updateDockingPosInfo() {
  }

}
