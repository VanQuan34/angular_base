import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoWbBaseApiService } from '../base';
import { FileManagerChatApiService } from './chatApi';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
  ],
  providers: [
    MoWbBaseApiService,
    FileManagerChatApiService,
    
  ],
  exports: [
  ],
})
export class FileManagerChatApiServiceModule { }
