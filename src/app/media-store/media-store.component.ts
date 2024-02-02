//import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ViewChild, ComponentFactoryResolver, Injector, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MoWbMediaStoreModalComponent } from './store-modal/media-store-modal.component';
import { MoWbMediaStoreEditModalComponent } from './edit/media-store-edit.component';
import { MoWbMediaStoreFileComponent } from './file/media-store-file.component';
import { MoWbMediaStoreFolderComponent } from './folder/media-store-folder.component';
// import { AuthenticateService } from '../api/common/authenticate.service';
import { AddComponentToBodyService } from '../api/common/add-component-to-body.service';

@Component({
  selector: 'mo-wb-media_store',
  templateUrl: './media-store.component.html',
  styleUrls: ['./media-store.component.scss']
})
export class MoWbMediaStoreComponent implements OnInit {

  @Input() maxTotalFileSize: number = 0; // MB unit
  @Input() maxSelected: number = 10;
  @Input() multiple: boolean = true;
  @Input() mode: 'FILE' | 'IMAGE' | 'ALL' = 'ALL';
  @Input() maxImageSize: number = 5000; // KB unit
  @Input() maxFileSize: number = 10000; // KB unit
  @Input() selectedFileUrls: string[] = [];

  @Output() onClose = new EventEmitter<any>();
  @Output() onSelectedFiles = new EventEmitter<string[]>();

  @ViewChild('fileStore') fileStoreRef: MoWbMediaStoreFileComponent;
  @ViewChild('folder') folderRef: MoWbMediaStoreFolderComponent;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private _domService: AddComponentToBodyService,
    private injector: Injector,
    // private _authService: AuthenticateService 
  ) { 

  }

  ngOnInit() {
    setTimeout(() => {
      // this.editModal();
      // this.openEditModal();
    }, 0);
  }

  handleOnFolderSelect(groupId: string) {
    this.fileStoreRef.folderList = this.folderRef.getFolderListItems();
    this.fileStoreRef.loadFileList(groupId);
  }

  handleOnFileChanged(event: any) {
    // console.log('handleOnFileChanged');
    // upload file count
    this.folderRef.fetchFolderList();
  }

  handleOnSelectedFiles(event: any) {
  }

  editModal() {
    const modalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreModalComponent).create(this.injector);
    modalRef.instance.mode = 'ALL';
    modalRef.instance.maxImageSize = 1000;
    modalRef.instance.maxTotalFileSize = 2;
    modalRef.instance.selectedFileUrls = [];
    modalRef.instance.onClose.subscribe((event) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });

    modalRef.instance.onSelectedFiles.subscribe((urls: string[]) => {
      //console.log('onSelectedFiles=', urls);
    });

    this._domService.addDomToBody(modalRef);
  }

  handleOpenMediaModal = () => {
    // const merchantId = this._authService.jwtDecode().merchantID;
    //console.log('handleOpenMediaModal merchantId=', merchantId);
    // this.testData();
    this.editModal();
  }

  openEditModal() {
    const editModalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreEditModalComponent).create(this.injector);
    // close modal
    editModalRef.instance.onClose.subscribe((event) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(editModalRef);
      }, 500);
    });

    this._domService.addDomToBody(editModalRef);
    editModalRef.instance.showModal();
  }

}
