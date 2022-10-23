import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../shared/common.service';
import * as _ from 'lodash';
import { Router } from '@angular/router';

export interface SystemSummary {
  totalNodes: number;
  usedNodes: number;
  ocloudCount: number;
  nfCount: number;
  cpuUtilized: number;
  interfaceUtilized: number;
}

export interface OcloudSummary {
  id: string;
  name: string;
  dmsCount: number,
  nfCount: number,
  faultCount: number,
  ocloudSummary?: OcloudSummary
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  systemSummary: SystemSummary = {} as SystemSummary;
  ocloudSummary: OcloudSummary[] = [];
  utilizationPercent: number = 0;
  resizeTime: any;
  time: number = 0;
  circularHeight!: number;
  @HostListener('window:resize') onResize() {
    this.resize();
  }

  constructor(private http: HttpClient, public commonService: CommonService, private router: Router,) { }

  ngOnInit(): void {
    // System Summary
    this.getSystemSummary();
    // Ocloud Summary
    this.getOcloudSummary();

    this.resize();
  }

  getSystemSummary() {
    if (this.commonService.isLocal) {
      /* local file test */
      this.systemSummary = this.commonService.systemSummary;
      this.systemSummaryDeal();

    } else {
      const url = `${this.commonService.restPath}/querySystemSummary`;
      this.http.get(url).subscribe(
        res => {
          console.log('getSystemSummary:');
          console.log(res);
          this.systemSummary = res as SystemSummary;
          this.systemSummaryDeal();
        }
      );
    }
  }

  systemSummaryDeal() {
    this.utilizationPercent = Math.floor((Number(this.systemSummary.usedNodes) / Number(this.systemSummary.totalNodes)) * 100);
  }

  getOcloudSummary() {
    if (this.commonService.isLocal) {
      /* local file test */
      this.ocloudSummary = this.commonService.ocloudSummary;
      this.ocloudSummaryDeal();
    } else {
      const url = `${this.commonService.restPath}/queryOcloudSummary`;
      this.http.get(url).subscribe(
        res => {
          console.log('getOcloudSummary:');
          console.log(res);
	  const str = JSON.stringify(res);//convert array to string
	  this.ocloudSummary = JSON.parse(str);
          this.ocloudSummaryDeal();
        }
      );
    }
  }

  ocloudSummaryDeal() {
    this.ocloudSummary.forEach((row) => {
      row.ocloudSummary = row;
    });
  }

  veiw(ocloudSummary: OcloudSummary) {
    //console.log(ocloudSummary);
    this.router.navigate(['/main/o-cloud-mgr/info', ocloudSummary.id]);
  }

  resize() {
    clearTimeout(this.resizeTime);
    this.resizeTime = window.setTimeout(() => {
      const nodeElement = document.querySelector('.nodes') as HTMLDivElement;
      const chartElement = document.querySelector('.chart')as HTMLDivElement;
      this.circularHeight = nodeElement.getBoundingClientRect().top + nodeElement.offsetHeight - chartElement.getBoundingClientRect().top;
    }, this.time);
  }

}
