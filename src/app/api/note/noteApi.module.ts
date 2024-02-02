import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoWbBaseApiService } from '../base';
import { ManagerNoteApiService } from './noteApi';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
  ],
  providers: [
    MoWbBaseApiService,
    ManagerNoteApiService
    
  ],
  exports: [
  ],
})
export class ManagerNoteApiServiceModule { }
