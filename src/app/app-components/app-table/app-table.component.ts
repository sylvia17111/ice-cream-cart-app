import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.css']
})
export class AppTableComponent implements OnInit {
@Input () finalBaseObj;
@Input () orderedScoopList;
@Input () scoopTotalCost;
@Input () totalCost;


  constructor() { }

  ngOnInit(): void {
  }

}
