//import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ViewChild, ComponentFactoryResolver, Injector, OnDestroy, Input} from '@angular/core';

@Component({
  selector: 'mo-wb-media_store_loader',
  templateUrl: './media-store-loader.component.html',
  styleUrls: ['./media-store-loader.component.scss']
})
export class MoWbMediaStoreLoaderComponent implements OnInit {

  @Input() loading: boolean = false; 

  constructor() { 
  }

  ngOnInit() {
    setTimeout(() => {
    }, 0);
  }

}
