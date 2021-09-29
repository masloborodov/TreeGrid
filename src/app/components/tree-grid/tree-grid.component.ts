import { Component, OnInit } from '@angular/core';
import { SoursDataService } from '../../services/sours-data.service';
import { map } from 'rxjs/operators';
import { SoursData } from '../../interfaces/sours-data-interfase';


@Component({
  selector: 'app-tree-grid',
  templateUrl: './tree-grid.component.html',
  styleUrls: ['./tree-grid.component.css']
})
export class TreeGridComponent implements OnInit {

  public data: SoursData[] = [];
  constructor(private soursData: SoursDataService) {
    soursData.getData().subscribe(res =>{
      this.data = res
      console.log(this.data)
    })

   // fetch('../../../assets/SoursData.json')
   //   .then(response => response.json())
   //   .then(console.log)
   //   .catch()

    // import('../../../assets/SoursData.json')
    //   .then(e => console.log(e)).catch()
  }

  ngOnInit(): void {
  }

}
