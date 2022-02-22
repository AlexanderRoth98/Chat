import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";


@Injectable({ providedIn: "root" })
export class UserService {

  private token: string;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getUser(id: string) {
    return this.http.get<{
      _id: string;
      username: string;
      password: string;
      userIp: string;
      avatar: string;
    }>("http://localhost:3000/api/users/" + id);
  }

  login(username: string, password: string) {
    this.http.post<{ token: string, userId: string }>("http://localhost:3000/api/users/login", { username: username, password: password })
      .subscribe(response => {
        const token = response.token;
        const userId = response.userId;
        this.token = token;
        if (token) {
          localStorage.setItem("loggedUser", userId);
          this.router.navigate(["/chat"]);
        }

      })
  }

  logOut(){
    this.token= null;
  }

}
