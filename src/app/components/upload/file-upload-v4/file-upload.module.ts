import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import {MoWbFileUploadV4Component} from "./file-upload.component";
import { MoWbButtonModule } from "../../button/button.module";
import { MoWbRadioModule } from "../../radio/radio.module";
import { MoWbSpinnerModule } from "../../spinner/spinner.module";
import { MoWbTooltipModule } from "../../tooltip/tooltip.module";
// import { MoWbProgressBarModule } from '../../progressBar/progressBar.module'

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbButtonModule,
    MoWbRadioModule,
    MoWbSpinnerModule,
    MoWbTooltipModule,
    // MoWbProgressBarModule
  ],
  exports: [
    MoWbFileUploadV4Component,
  ],
  declarations: [
    MoWbFileUploadV4Component,
  ],
  providers: [
  ]
})
export class MoWbFileUploadV4Module {

}
