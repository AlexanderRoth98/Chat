import { Component, OnInit, Input, AfterViewInit, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/users/login/user.service';
import { Message } from '../message.model';
import { MessagesService } from '../messages.service';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';


@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit, AfterViewInit {

  loggedUser: string;
  displayLink = false;
  author = { _id: 'placeholderId', username: 'placeholder', password: 'placeholder', avatar: 'placeholder', userIp: 'placeholder' };
  avatar: string;
  myDiv: any;
  @Input() message: Message;



  private messagesSub: Subscription;

  constructor(public messagesService: MessagesService, public userService: UserService, private router: Router, public dialog: MatDialog) { this.messagesSub = new Subscription }

  ngOnInit(): void {
    this.loggedUser = localStorage.getItem('loggedUser');
    this.userService.getUser(this.message.userId).subscribe((user) => {
      this.author = user;
      this.avatar = " url('" + this.author.avatar + "')";


      this.userService.getUser(this.loggedUser).subscribe((response) => {
        if ((!this.message.read.includes(response.username)) && this.author._id != this.loggedUser) {
          this.message.read.push(response.username);
          this.messagesService.updateMessage(this.message);
        }
      });


    });

    let match;
    if (this.message.content) {
      match = this.message.content.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
    }
    if (match != null) {
      this.displayLink = true;
    }



  }

  ngAfterViewInit() {
    this.myDiv = document.getElementById("tableBody");
    this.myDiv.scrollTop = this.myDiv.scrollHeight;
  }

  onDelete(messageId: string) {
    this.messagesService.deleteMessage(messageId);
  }


  openDialog() {
    this.dialog.open(DialogBoxComponent, {
      data: {
        read: this.message.read,
      }
    });
  }

  copyContent(content: string) {

    if (content) {
      const selBox = document.createElement('textarea');
      content = this.checkIfUrl(content);

      selBox.value = content;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    }
  }

  checkIfUrl(str: string) {
    let match = str.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
    let final = str;

    if (match != null) {
      let startRemove = final.indexOf('<a href=');
      let endRemove = final.indexOf('</a>');
      let stringToRemove = final.substr(startRemove, endRemove - startRemove + 4);

      match.map(url => {
        final = final.replace(stringToRemove, url);
      })

    }
    return final;

  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }

}
