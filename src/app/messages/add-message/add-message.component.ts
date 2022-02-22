import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/messages/message.model'
import { MessagesService } from 'src/app/messages/messages.service';
import { User } from 'src/app/users/login/user.model';
import { UserService } from 'src/app/users/login/user.service';
import { mimeType } from './mime-type.validator';


@Component({
  selector: 'app-add-message',
  templateUrl: './add-message.component.html',
  styleUrls: ['./add-message.component.css']
})
export class AddMessageComponent implements OnInit, OnDestroy {
  imagePreview: string;
  form: FormGroup;
  day = '';
  month = '';
  hours = '';
  minutes = '';
  time = '';
  date = new Date;
  messages: Message[] = [];
  private messagesSub: Subscription;
  enteredMessage = '';
  loggedUserId : string;
  readPlaceholder : string[] = ['You'];



  constructor(public messagesService: MessagesService) { this.messagesSub = new Subscription }

  ngOnInit(): void {
    this.form = new FormGroup({
      'content': new FormControl(null),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.loggedUserId = localStorage.getItem('loggedUser');


  }

  onAddMessage() {
    this.enteredMessage = this.form.value.content;
    if (this.enteredMessage)
      this.enteredMessage = this.checkIfUrl(this.enteredMessage);
    this.date = new Date();


    if (this.date.getMinutes() < 10) {
      this.minutes = '0' + this.date.getMinutes().toString();
    }
    else {
      this.minutes = this.date.getMinutes().toString();
    }

    if (this.date.getHours() < 10) {
      this.hours = '0' + this.date.getHours().toString();
    }
    else {
      this.hours = this.date.getHours().toString();
    }

    this.day = this.date.getUTCDate().toString();

    const monthVal = this.date.getUTCMonth() +1 ;
    this.month = monthVal.toString();

    this.time =this.day + '/' + this.month +' ' + this.hours + ':' + this.minutes;

    this.messagesService.addMessage(this.loggedUserId, this.enteredMessage, this.time, this.readPlaceholder, this.form.value.image);

    this.form.patchValue({
      content: ''
    });

    this.enteredMessage = '';
    this.form.reset();
  }

  checkIfUrl(str: string) {
    let match = str.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
    let final = str;
    if (match != null)
      match.map(url => {
        final = final.replace(url, "<a href=\"" + url + "\" target=\"_BLANK\">" + url + "</a>")
      })
    return final;

  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }

}
