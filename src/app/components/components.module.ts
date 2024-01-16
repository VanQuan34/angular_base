
import { MoWbRadioModule } from './radio/radio.module';
import { MoWbCheckboxModule } from './checkbox/checkbox.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoWbButtonModule } from './button/button.module';
// import { MoWbInputModule } from './input/input.module';
// import { MoWbDropDownModule } from './dropdown/dropdown.module';
import { MoWbToggleModule } from './button/toggle-button/toggle.module';
import { MoWbSpinnerModule } from './spinner/spinner.module';
import { MoWbColorModule } from './color/color.module';
import { MoWbTogglePanelModule } from './toggle-panel/toggle-panel.module';
import { MoWbSliderModule } from './slider/slider.module';
// import { MoWbPopupModule } from './popup/popup.module';
// import { MoWbSectionModule } from './section/section.module';
import { MoWbMenuModule } from './menu/menu.module';
// import { MoWbCategoryModule } from './category/category.module';
// import { MoWbMenuDropDownModule } from './menu-dropdown/menu-dropdown.module';
import { MoWbModalModule } from './modal/modal.module';
// import { MoWbTabModule } from './tab/tab.module';
import { MoWbUploadModule } from './upload/upload.module';
// // import { MoWbUploadFontModule } from './upload/upload-file/upload-font.module';
// import { MoWbTooltipModule } from './tooltip/tooltip.module';
// // import { MoWbAnimationModule } from './animation/animation.module';
import { MoWbSelectModule } from './select/select.module';
import { MoWbHoverActionModule } from './hover-action/hover-action.module';
import { MoWbTableModule } from './table/table.module';
// import { MoWbProgressBarModule } from './progressBar/progressBar.module';
// import { MoWbScrollOverlayModule } from './scroll-overlay/scroll-overlay.module';
// import { MoWbTagsModule } from './tags/tags.module';
import { MoWbFileUploadV4Module } from './upload/file-upload-v4/file-upload.module';
// import { MoWbDatePickerModule } from './date-picker/date-picker.module';

// components
import { MoWbDetectionComponent } from './detection.component';
import { MoWbInputModule } from './input/input.module';
import { MoWbTestModalTest1Component } from './test/modal/test1/test1.component';
// import { MoWbLoginModule } from './login/login.module';
// import { MoWbTestComponent } from './test/test.component';
// import { MoWbTestModalTest1Component } from './test/modal/test1/test1.component';

@NgModule({
  imports: [
    CommonModule,
    MoWbButtonModule,
    // MoWbInputModule,
    // MoWbDropDownModule,
    MoWbToggleModule,
    MoWbSpinnerModule,
    MoWbCheckboxModule,
    // MoWbCategoryModule,
    // MoWbMenuDropDownModule,
    MoWbModalModule,
    MoWbColorModule,
    // MoWbTabModule,
    MoWbTogglePanelModule,
    MoWbUploadModule,
    // // MoWbUploadFontModule,
    // MoWbTooltipModule,
    // // MoWbColorModule,
    MoWbSliderModule,
    // MoWbPopupModule,
    MoWbRadioModule,
    // MoWbSectionModule,
    MoWbMenuModule,
    // // MoWbAnimationModule,
    // // MoWbDatePickerModule,
    MoWbSelectModule,
    MoWbHoverActionModule,
    MoWbFileUploadV4Module,
    MoWbTableModule,
    // MoWbProgressBarModule,
    // MoWbScrollOverlayModule,
    // MoWbTagsModule
    // MoWbLoginModule
  ],
  declarations: [
    MoWbDetectionComponent,
    // MoWbTestComponent,
    MoWbTestModalTest1Component
  ],
  exports: [
    MoWbDetectionComponent,
    MoWbButtonModule,
    MoWbInputModule,
    // MoWbDropDownModule,
    MoWbToggleModule,
    MoWbSpinnerModule,
    MoWbCheckboxModule,
    // MoWbCategoryModule,
    // MoWbMenuDropDownModule,
    MoWbModalModule,
    MoWbColorModule,
    // MoWbTabModule,
    MoWbTogglePanelModule,
    MoWbUploadModule,
    // // MoWbUploadFontModule,
    // MoWbTooltipModule,
    // // MoWbColorModule,
    MoWbSliderModule,
    // MoWbPopupModule,
    MoWbRadioModule,
    // // MoWbDatePickerModule,
    // MoWbSectionModule,
    MoWbMenuModule,
    // // MoWbAnimationModule,
    MoWbHoverActionModule,
    MoWbSelectModule,
    MoWbFileUploadV4Module,
    // // MoWbTestComponent,
    // // MoWbTestModalTest1Component,
    MoWbTableModule,
    // MoWbProgressBarModule,
    // MoWbScrollOverlayModule,
    // MoWbTagsModule
    // MoWbLoginModule
  ]
})
export class MoWbComponentsModule { }