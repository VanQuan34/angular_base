// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { StartComponent } from './start/start.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { MoWbManagerComponent } from './manager/manager.component';
import { MoWbManagerNoteComponent } from './manager/note/note.component';
import { ResetPasswordComponent } from './login/reset-password/reset.component';
import { NewPasswordComponent } from './login/new-password/new-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, //TestComponent
  { path: 'start', component: StartComponent },
  { path: 'register', component: StartComponent },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'manager', component: MoWbManagerComponent, canActivate: [AuthGuard]},
  { path: 'manager/note', component: MoWbManagerNoteComponent, canActivate: [AuthGuard]},
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'new-password', component: NewPasswordComponent},
  { path: '**', component: NotFoundComponent }, // Wildcard route for 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
