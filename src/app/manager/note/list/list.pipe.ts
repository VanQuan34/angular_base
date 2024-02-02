import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';

@Pipe({ name: 'getNameFolderById' })
export class MoWbManagerNoteListPipe implements PipeTransform {
   async transform(id: string, categoryList: any[]) {
    if(!categoryList){
      return '';
    }
    for (let i = 0; i < categoryList.length; i++){
      if(categoryList[i].category_id === id){
        return `${categoryList[i].cate_name}`;
      }
    }
    return '';
  
   }
}

@NgModule({
  imports: [CommonModule],
  declarations: [MoWbManagerNoteListPipe],
  exports: [MoWbManagerNoteListPipe]
})

export class MoWbManagerNoteListPipeModule { }
