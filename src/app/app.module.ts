// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AppRoutingModule } from './app-routing.modules';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component'; // Replace 'FeatureComponent' with your actual feature component
import { CommonModule } from '@angular/common';
import { MoWbComponentsModule } from './components/components.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { LANGUAGE } from './common/language.define';
import { ToastTranslateService } from './api/common/toast-translate.service';
import { MoWbCommonServiceModule } from './api/common/common-service.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestComponent } from './test/test.component';
import { StartComponent } from './start/start.component';
import { ChatComponent } from './chat/chat.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { LoginComponent } from './login/login.component';
import { FileManagerAuthApiServiceModule } from './api/auth/authApi.module';
import { FileManagerSettingsAccountPipeModule } from './account.pipe';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MoWbClickOutsideModule } from './directives/click-outside.directive';
import { FileManagerChatApiServiceModule } from './api/chat/chatApi.module';
import { MoWbFileManagerTopbarModule } from './topbar/topbar.modules';
import { MoWbManagerModule } from './manager/manager.modules';
import { ResetPasswordComponent } from './login/reset-password/reset.component';
import { NewPasswordComponent } from './login/new-password/new-password.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const config: SocketIoConfig = { url: 'https://socket-chat-zw5t.onrender.com', options: {} };
//https://socket-chat-production-7b54.up.railway.app
@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    TestComponent,
    StartComponent,
    ChatComponent,
    LoginComponent,
    ResetPasswordComponent,
    NewPasswordComponent,
  ],
  imports: [
    BrowserModule,
    PickerComponent,
    FormsModule,
    MoWbClickOutsideModule,
    AppRoutingModule,
    CommonModule,
    MoWbComponentsModule,
    HttpClientModule,
    MoWbCommonServiceModule,
    FileManagerAuthApiServiceModule,
    MoWbManagerModule,
    BrowserAnimationsModule,
    FileManagerChatApiServiceModule,
    SocketIoModule.forRoot(config),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    FileManagerSettingsAccountPipeModule,
    MoWbFileManagerTopbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private _translate: TranslateService, private _router: Router) {
    this._translate.addLangs([LANGUAGE.VI, LANGUAGE.EN]);
    let lang: string | null = localStorage.getItem(
      LANGUAGE.KEY_LANGUAGE_STORAGE
    );
    if (!lang) {
      const urlParams = new URLSearchParams(window.location.search);
      lang = urlParams.get('lang') ? urlParams.get('lang') : LANGUAGE.DEFAULT;
    }
    lang = lang || LANGUAGE.DEFAULT;
    console.log('lang=', lang);
    localStorage.setItem(LANGUAGE.KEY_LANGUAGE_STORAGE, lang);
    this._translate.setDefaultLang(lang);
  }
}