import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatMenuModule} from '@angular/material/menu';



import { AppComponent } from './app.component';
import { AddMessageComponent } from './messages/add-message/add-message.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatAreaComponent } from './chat/chat-area/chat-area.component';
import { ChatHeaderComponent } from './chat/chat-header/chat-header.component';
import { ChatMessageComponent } from './messages/chat-message/chat-message.component';
import { LoginComponent } from './users/login/login.component';
import { ChatParentComponent } from './chat/chat-parent/chat-parent.component';
import { AppRoutingModule } from './app-routing.moduel';
import { AuthInterceptor } from './users/login/auth-interceptor';
import { DialogBoxComponent } from './messages/chat-message/dialog-box/dialog-box.component';
import {MatDialogModule} from '@angular/material/dialog';




@NgModule({
  declarations: [
    AppComponent,
    AddMessageComponent,
    ChatAreaComponent,
    ChatHeaderComponent,
    ChatMessageComponent,
    LoginComponent,
    ChatParentComponent,
    DialogBoxComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    HttpClientModule,
    MatMenuModule,
    FormsModule,
    MatDialogModule,
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
