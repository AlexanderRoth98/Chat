import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from 'src/app/users/login/user.service';

@Component({
  selector: 'app-chat-parent',
  templateUrl: './chat-parent.component.html',
  styleUrls: ['./chat-parent.component.css']
})
export class ChatParentComponent implements OnInit {

  constructor(private router: Router, public userService: UserService) { }

  ngOnInit(): void {

    const token = this.userService.getToken();

    // if(!token){
    //   this.router.navigate(["/"]);
    // }

  }

}
