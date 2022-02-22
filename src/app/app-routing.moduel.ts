import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChatParentComponent } from "./chat/chat-parent/chat-parent.component";
import { LoginComponent } from "./users/login/login.component";


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'chat', component: ChatParentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
