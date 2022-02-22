import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/users/login/user.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.css']
})
export class ChatHeaderComponent implements OnInit {
  username: string;

  constructor(public userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUser(localStorage.getItem('loggedUser')).subscribe((user) => {
      this.username = user.username;
    });
  }

  logOut() {
    this.userService.logOut();
    localStorage.setItem('loggedUser', ' ');
    this.router.navigate(["/"]);

  }

}
