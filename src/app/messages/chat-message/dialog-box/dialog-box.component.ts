import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/users/login/user.service';


export interface DialogData {
  read: any;
}


@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }



  ngOnInit(): void {
    console.log(this.data.read);

    this.data.read.forEach((element, index) => {
      if (element == '[\"You\"]' || element == 'You')
        this.data.read.splice(index, 1);
    });

  }

}
