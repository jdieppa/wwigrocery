import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  public msg;
  public submitted;

  constructor() { }

  ngOnInit() {
    this.msg = {};
    this.msg.name = '';
    this.msg.email = '';
    this.msg.subject = '';
    this.msg.message = '';
    this.submitted = false;
  }

  public preSubmit() {
    this.submitted = true;
  }

  public onSubmit() {
    document.getElementById('messageConfirmButton').click();
  }

}
