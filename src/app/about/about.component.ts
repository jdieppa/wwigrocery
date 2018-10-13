import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  public parallaxRatio = 1;
  public initialTop  = 0;
  public eleRef;


  constructor() { }

  ngOnInit() {
  }

}
