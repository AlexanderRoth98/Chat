import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/messages/message.model'
import { MessagesService } from 'src/app/messages/messages.service';
import { User } from 'src/app/users/login/user.model';
import { UserService } from 'src/app/users/login/user.service';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css']
})
export class ChatAreaComponent implements OnInit, OnDestroy {


  loggedUser : string;
  messages: Message[] = [];

  private messagesSub: Subscription;



  constructor(public messagesService: MessagesService, public userService: UserService) {
    this.messagesSub = new Subscription}



  ngOnInit(): void {
    this.messagesService.getMessages();
    this.messagesSub = this.messagesService.getMessageUpdateListener().subscribe((messages: Message[]) => {

      this.messages = messages;
      if(this.messages.length > 10){

        const id = messages[3].id;
        this.messagesService.deleteMessage(id);

      }

    });

    this.loggedUser = localStorage.getItem('loggedUser');



  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }





}
