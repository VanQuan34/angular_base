import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MoWbTogglePanelComponent } from './toggle-panel.component';
import { MoWbTogglePanelSectionComponent } from './section/section.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
  ],
  exports: [
    MoWbTogglePanelComponent,
    MoWbTogglePanelSectionComponent
  ],
  declarations: [
    MoWbTogglePanelComponent,
    MoWbTogglePanelSectionComponent
  ],
  providers: [
  ]
})
export class MoWbTogglePanelModule {

}
