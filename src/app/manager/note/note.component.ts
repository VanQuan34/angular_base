import { Component, ViewChild } from '@angular/core';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { Router } from '@angular/router';
import { FileManagerAuthApiService } from 'src/app/api/auth/authApi';
import { ICategoryItem, MoWbManagerNoteCategoryComponent } from './category/category.component';
import { INoteInfo, MoWbManagerNoteListComponent } from './list/list.component';

@Component({
  selector: 'mo-wb-manager-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class MoWbManagerNoteComponent {

  contentEditor: string;
  categoryList: ICategoryItem[];
  valueSearch: string;

  @ViewChild('list') listRef: MoWbManagerNoteListComponent;
  @ViewChild('category') categoryRef: MoWbManagerNoteCategoryComponent;

  constructor(
    private _router: Router,
    private authService: FileManagerAuthApiService,
    private _toast: ToastTranslateService
    ){
  }

  ngOnInit(){
    this.contentEditor = '';
  }

  handleOnClickCategory(category: ICategoryItem){
    console.log('category===', category);
    if(this.listRef){
      this.listRef.updateParam('CATE', category);
    }
  }

  handleOnClickAll(e: MouseEvent){
    this.listRef.updateParam('ALL');
  }

  handleOnLoadCategory(cateItems: any){
    this.listRef.categoryList = cateItems;
    this.categoryList = cateItems;
  }

  handleOnChangeSearch(value: string){
    console.log('value Search=', value);
    this.valueSearch = value;
    this.listRef.paramsFetch['search'] = this.valueSearch;
    this.listRef.paramsFetch['page'] = 1;
    this.listRef.tableRef.reLoadData();
  }

  handleOnChangeNote(categoryId: string, type: 'DUPLICATE' | 'REMOVE'){
    switch(type){
      case 'DUPLICATE':
        this.categoryRef.cateItems.forEach(cate => {
          if(cate.category_id === categoryId){
            cate.note_amount = cate.note_amount + 1;
          }
          return cate;
        });
        break;
      case 'REMOVE':
        this.categoryRef.cateItems.forEach(cate => {
          if(cate.category_id === categoryId){
            cate.note_amount = cate.note_amount - 1;
          }
          return cate;
        });
        break;
    }
    this.categoryRef.detectChanges();
  }

  handleOnAddNewNote(note: INoteInfo){
    this.listRef.tableRef.items.unshift(note);
    this.listRef.tableRef.detectChanges();
  }

}
