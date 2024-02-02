import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { MoWbInputComponent } from '../components/input/input.component';
import { Socket } from 'ngx-socket-io';
import { GLOBAL } from '../common/types/global/global';
import { FileManagerChatApiService, ICreateChat } from '../api/chat/chatApi';
import { ToastTranslateService } from '../api/common/toast-translate.service';
import { AddComponentToBodyService } from '../api/common/add-component-to-body.service';
import { TranslateService } from '@ngx-translate/core';
import { CacheKeys } from '../common/define/cache-keys.define';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{

  messages: Array<any> = [];
  isDisable: boolean = true;
  currentUser: any;
  valueMess: string = '';
  typingList: Array<any> = [];
  textTyping: string = '';
  isLoadedHistory: boolean = true;
  page: number = 1;
  per_page: number = 15;
  roomId: string =  '123456789';
  showEmojiPicker = false;
  onScroll: boolean = false;
  loadedMessage: boolean;
  isLoading = true;
  isLoadMore: boolean = true;
  scrollHeight: number;

  @ViewChild('input') _input: MoWbInputComponent;
  @ViewChild('chat') chatEl: ElementRef;
  @ViewChild('colorSelect') _colorSelect: ElementRef;

  constructor(
    private socket: Socket,
    private chatApi:  FileManagerChatApiService,
    private _toast: ToastTranslateService,
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    public _changeDetection: ChangeDetectorRef,
    public _translate: TranslateService,
    public _componentFactoryResolver: ComponentFactoryResolver
    ){}

  ngOnInit(): void{
    this.currentUser = GLOBAL.userInfo;
    this.initHistory();
    // this.messages = [];
    // this.socket.on('disconnect', (user: any) => {
    //   console.log('Disconnectctt', user);
    //   this._toast.show('info', `${user.lastName} is left.`)
    // });

    this.socket.on('message', (event: any) => {
      this.messages.push(event);
      this.chatEl.nativeElement.scrollTop = this.chatEl.nativeElement.scrollHeight;
      localStorage.setItem('history', JSON.stringify(this.messages));
      this.typingList = this.typingList.filter(item => item.id !== event.user.user_id);
      this.convertTyping();
      console.log('event=', event)
    });

    this.socket.on('typing', (data: any)=>{
      console.log('data typing', data);
      if(!data.message){
        this.typingList = this.typingList.filter(item => item.id !== data.id);
        return;
      }
      const exist = this.typingList.filter((item: any) => item.id === data.id);
      if(exist.length){
        return;
      }
      if(data.id === this.currentUser.user_id){
        return;
      }
      this.typingList.push(data);
      this.convertTyping();
      console.log('this.isTyping===', this.typingList);
    });

  }

  initHistory(){
    if(!this.isLoadedHistory){
      return;
    }
    // const historyLocal = localStorage.getItem('history');
    // const history = historyLocal && JSON.parse(historyLocal) || [];
    // const arrHistory = this.divideArray(history, this.per_page);
    // console.log('arr==', arrHistory);
    // this.messages = arrHistory[0] || [];
    // this.isLoadedHistory = false;
    this.fetchChatList();
  }

  ngOnDestroy(){
    // this.socket.emit('disconnect', {user: this.currentUser});
  }

  ngAfterViewInit(){
    this.scrollHeight = this.chatEl.nativeElement.scrollHeight;
    this.chatEl.nativeElement.scrollTop = this.chatEl.nativeElement.scrollHeight;
    this.onScroll  = this.chatEl.nativeElement.scrollTop < ( this.chatEl.nativeElement.scrollHeight -  this.chatEl.nativeElement.clientHeight) ? true : false;
  }

  async fetchChatList(isFirst: boolean = true){
    const response = await this.chatApi.fetchListChat(this.roomId, this.page);
    if (!response || response.code !== 200){
      this.isLoading = false;
      this._toast.show('error', response.code);
      return;
    }
    // this.messages = response.data;
    this.isLoading = false;
    if(response.data.length < 15 || !response.data.length){
      this.isLoadMore = false;
    }
    this.messages = [...response.data.reverse(), ...this.messages];
    setTimeout(()=>{
      if(!isFirst){
        this.chatEl.nativeElement.scrollTop = this.scrollHeight;
        return;
      }
      this.chatEl.nativeElement.scrollTop = this.chatEl.nativeElement.scrollHeight;
    })
  }

  async fetchChatCreate(){
    const body: ICreateChat = {
      room_id: this.roomId,
      user_id: this.currentUser.user_id,
      message: this.valueMess
    }
    const response = await this.chatApi.fetchCreateChat(body);
    if (!response || response.code !== 200){
      this._toast.show('error', response.code);
      return;
    }
    this.loadedMessage = false;
    this.socket.emit('message', {user: GLOBAL.userInfo, message: this.valueMess, createdAt: new Date().getTime()});
    this._input.setValue('');
    this._input.focus();
    this.showEmojiPicker = false;
  }

  convertTyping(){
    if(!this.typingList.length){
      this.textTyping = '';
    }

    if(this.typingList.length === 1){
      console.log('oke 1');
      const mess = `${this.typingList[0].name} is typing...`;
      console.log('mess==', mess)
      this.textTyping =  mess;
    }

    if(this.typingList.length === 2){
      this.textTyping = `${this.typingList[0].name} and ${this.typingList[1].name} is typing...`;
    } 

    if(this.typingList.length > 2){
      this.textTyping = `${this.typingList[0].name}, ${this.typingList[1].name} and ${this.typingList.length - 2} user is typing...`;
    }
  }
  

  handleSendMessage(e: MouseEvent){
    const val = this._input.getValue();
    this.loadedMessage = true;
    // this.messages.push(val);
    this.fetchChatCreate();
  }

  handleChangeText(value: string){
    this.valueMess = value;
    const data = {
      id: this.currentUser.user_id,
      name: this.currentUser.firstName + ' ' + this.currentUser.lastName,
      message: value
    }
    console.log('data typing', data);
    this.socket.emit('typing', data);
    if(!value){
      this.isDisable = true;
      this.typingList = this.typingList.filter(item => item.id !== this.currentUser.user_id);
      console.log('list=', this.typingList);
      return;
    }
    this.isDisable = false;
  }

  handleEventEnter = (event: any) =>{
    if (event.keyCode === 13) {
      this.handleSendMessage(event);
    }
  }

  divideArray(array: Array<any>, chunkSize: number) {
    const result = [];
    let index = array.length;

    while (index > 0) {
        result.push(array.slice(Math.max(0, index - chunkSize), index));
        index -= chunkSize;
    }

    return result;
  }

  /**
   * scroll top to load more message
   * @param e 
   */
  handleOnScroll(e: any){
    const scrollTop = this.chatEl.nativeElement.scrollTop;
    this.onScroll  = this.chatEl.nativeElement.scrollTop < ( this.chatEl.nativeElement.scrollHeight -  this.chatEl.nativeElement.clientHeight) ? true : false;
    if(scrollTop === 0){
      // const historyLocal = localStorage.getItem('history');
      // const history = historyLocal && JSON.parse(historyLocal) || [];
      // const arrChat = this.divideArray(history, this.per_page);
      // const maxPage = arrChat.length;
      // this.page = this.page + 1;
      // if(this.page - 1 >= maxPage){
      //   return;
      // }
      // console.log('arrChat[this.page]=', arrChat[1]);
      // this.messages = [...arrChat[this.page - 1], ...this.messages];
      // this.chatEl.nativeElement.scrollTop = 10;
      // console.log('load more item')
      if(!this.isLoadMore){
        return;
      }
      this.page = this.page + 1;
      this.isLoading = true;
      this.fetchChatList(false).then(()=>{
        // this.chatEl.nativeElement.scrollTop = 10;
      });
    }
  }

  addEmoji(event: any) {
    console.log(event);
    // const { message } = this;
    // console.log(message);
    // console.log(`${event.emoji.native}`)
    // const text = `${message}${event.emoji.native}`;

    // this.message = text;
    // this.showEmojiPicker = false;
    this.valueMess = this.valueMess + event.emoji.native;
    this._input.focus();
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  scrollToBottom(){
    this.chatEl.nativeElement.scrollTo({
      top:  this.chatEl.nativeElement.scrollHeight,
      behavior: 'smooth'
    });
  }

  handleOnClickOutSide(e: MouseEvent){
    this.showEmojiPicker = false;
  }

}
