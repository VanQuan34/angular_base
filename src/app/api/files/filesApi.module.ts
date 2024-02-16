import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoWbBaseApiService } from '../base';
import { MoWbManagerImagesApiService } from './filesApi';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
  ],
  providers: [
    MoWbBaseApiService,
    MoWbManagerImagesApiService,
    
  ],
  exports: [
  ],
})
export class FileManagerFilesApiServiceModule { }
