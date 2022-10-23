import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../shared/common.service';
import { OCloudList } from '../o-cloud-management/o-cloud-management.component';
import { Nf } from '../nf-management/nf-management.component';

export interface FaultMessage {
  totalMessageNumber: number;
  faultMessages: FaultMessages[];
}

export interface FaultMessages {
  timestamp: string;
  cloudId: string;
  cloudName: string;
  nfId: string;
  nfName: string;
  severity: string;
  context: string;
  isCleared: boolean;
  processStatus: number;
  processComment: string;
}

@Component({
  selector: 'app-fault-management',
  templateUrl: './fault-management.component.html',
  styleUrls: ['./fault-management.component.scss']
})
export class FaultManagementComponent implements OnInit {
  ocloudList: OCloudList[] = [];
  nfList: Nf[] = [];
  faultMessage: FaultMessage = {} as FaultMessage;
  p: number = 1;            // 當前頁數
  pageSize: number = 10;    // 每頁幾筆
  totalItems: number = 0;   // 總筆數
  nullList: string[] = [];  // 給頁籤套件使用
  searchForm!: FormGroup;
  severitys: string[];

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private fb: FormBuilder,
  ) {
    const nowTime = this.commonService.getNowTime();
    // 格式驗證需要處理?
    this.searchForm = this.fb.group({
      'cloudId': new FormControl('All'),
      'nfId': new FormControl('All'),
      'severity': new FormControl('All'),
      'from': new FormControl(new Date(`${nowTime.year}-01-01`)),   // [Validators.pattern(/^\d{4}\/\d{2}\/\d{2}$/)]
      'to': new FormControl(new Date(`${nowTime.year}-${nowTime.month}-${nowTime.day}`))  // [Validators.pattern(/^\d{4}\/\d{2}\/\d{2}$/)]
    });
    this.severitys = this.commonService.severitys;
  }

  ngOnInit(): void {
    this.getOcloudList();
    //this.getNfList();
    this.getFaultMessage();
  }

  getOcloudList() {
    if (this.commonService.isLocal) {
      /* local file test */
      this.ocloudList = this.commonService.ocloudList;

    } else {
      const url = `${this.commonService.restPath}/queryOcloudList`;
      this.http.get(url).subscribe(
        res => {
          console.log('getOcloudList:');
          console.log(res);
          this.ocloudList = res as OCloudList[];
        }
      );
    }
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

  getFaultMessage() {
    if (this.commonService.isLocal) {
      /* local file test */
      this.faultMessage = this.commonService.faultMessage;
      this.faultMessageDeal();

    } else {
      // queryFaultMessage/?cloud={cloudId}&nf={nfId}&severity={severity}&start={From}&end={To}&offset={(page-1)*10}&limit=10
      const cloudId = this.searchForm.controls['cloudId'].value;
      const nfId = this.searchForm.controls['nfId'].value;
      const severity = this.searchForm.controls['severity'].value;
      const start = this.commonService.dealPostDate(this.searchForm.controls['from'].value);
      const end = this.commonService.dealPostDate(this.searchForm.controls['to'].value);
      const offset = (this.p - 1) * this.pageSize;
      const limit = 10;
      //const url = `${this.commonService.restPath}/queryFaultMessage/?cloud=${cloudId}&nf=${nfId}&severity=${severity}&start=${start}&end=${end}&offset=${offset}&limit=${limit}`;
      const url = `${this.commonService.restPath}/queryFaultMessage/&cloud=${cloudId}&nf=${nfId}&severity=${severity}&start=${start}&end=${end}&offset=${offset}&limit=${limit}`;
      this.http.get(url).subscribe(
        res => {
          console.log('getFaultMessage:');
          console.log(res);
          const str = JSON.stringify(res);//convert array to string
          this.faultMessage = JSON.parse(str);
          this.faultMessage = res as FaultMessage;
          this.faultMessageDeal();
        }
      );
    }
  }

  faultMessageDeal() {
    // this.p = 1;
    this.totalItems = this.faultMessage.totalMessageNumber;
    this.nullList = new Array(this.totalItems);
  }

  pageChanged(page: number) {
    this.p = page;
    this.search();
  }

  search() {
    this.getFaultMessage();
  }
}
