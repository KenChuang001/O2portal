import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../shared/common.service';

export interface Nf {
  id: string;
  name: string;
  ocloudName: string;
  status: number;
}

@Component({
  selector: 'app-nf-management',
  templateUrl: './nf-management.component.html',
  styleUrls: ['./nf-management.component.scss']
})
export class NfManagementComponent implements OnInit {
  nfList: Nf[] = [];

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.getNfList();
  }

  getNfList() {
    if (this.commonService.isLocal) {
      /* local file test */
      this.nfList = this.commonService.nfList;

    } else {
      const url = `${this.commonService.restPath}/queryNfList`;
      this.http.get(url).subscribe(
        res => {
          console.log('getNfList:');
          console.log(res);
          this.nfList = res as Nf[];
        }
      );
    }
  }

}
