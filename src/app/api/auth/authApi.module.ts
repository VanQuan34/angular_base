import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoWbBaseApiService } from '../base';
import { FileManagerAuthApiService } from './authApi';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
  ],
  providers: [
    MoWbBaseApiService,
    FileManagerAuthApiService,
    
  ],
  exports: [
  ],
})
export class FileManagerAuthApiServiceModule { }
