import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoWbBaseApiService } from '../base';
import { FileManagerFilesApiService } from './filesApi';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
  ],
  providers: [
    MoWbBaseApiService,
    FileManagerFilesApiService,
    
  ],
  exports: [
  ],
})
export class FileManagerFilesApiServiceModule { }
