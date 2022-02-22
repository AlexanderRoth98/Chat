import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { Message } from "./message.model";


@Injectable({ providedIn: "root" })
export class MessagesService {
  private messages: Message[] = [];
  private messagesUpdated = new Subject<Message[]>();


  constructor(private http: HttpClient, private router: Router) { }

  getMessages() {
    this.http
      .get<{ alert: string; messages: any }>(
        "http://localhost:3000/api/messages"
      )
      .pipe(map((messageData) => {
        return messageData.messages.map(message => {
          return {
            userId: message.userId,
            content: message.content,
            time: message.time,
            read: message.read,
            id: message._id,
            imagePath: message.imagePath,
          };
        });
      })
      )
      .subscribe(transformedMessages => {
        this.messages = transformedMessages
        this.messagesUpdated.next([...this.messages]);
      });
  }

  getMessageUpdateListener() {
    return this.messagesUpdated.asObservable();
  }

  addMessage(userId: string, content: string, time: string, read: string[], image: File) {
    const messageData = new FormData();
    messageData.append("id", '');
    messageData.append("userId", userId);
    messageData.append("content", content);
    messageData.append("time", time);
    messageData.append("read", JSON.stringify(read));
    if (image)
      messageData.append("image", image, userId);
    this.http
      .post<{ alert: string, message: Message }>("http://localhost:3000/api/messages", messageData)
      .subscribe(responseData => {
        const message: Message = { id: responseData.message.id, userId: userId, content: content, time: time, read: read, imagePath: responseData.message.imagePath };
        this.messages.push(message);
        this.messagesUpdated.next([...this.messages]);
      });
  }

  updateMessage(message: Message) {
    this.http
      .put("http://localhost:3000/api/messages/" + message.id, message)
      .subscribe(response => {

      });
  }

  deleteMessage(messageId: string) {
    this.http
      .delete("http://localhost:3000/api/messages/" + messageId)
      .subscribe(() => {
        const updatedMessages = this.messages.filter(message => message.id !== messageId);
        this.messages = updatedMessages;
        this.messagesUpdated.next([...this.messages]);
      });
  }
}
