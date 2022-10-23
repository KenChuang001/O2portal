import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CommonService } from './../../shared/common.service';
import { FaultMessage } from './../../fault-management/fault-management.component';
import { SoftwareList } from './../../software-management/software-management.component';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

export interface OcloudInfo {
  id: string;
  name: string;
  imsEndpoint: string;
  softwareVersion: string;
  callbackUri: string;
  dms: Dms[];
  nf: Nf[];
  fault: Fault;
  resourcepool: Resourcepool[];
}

export interface Dms {
  id: string;
  name: string;
  dmsEndpoint: string;
}

export interface Nf {
  id: string;
  name: string;
  dmsName: string;
  status: number;
}

export interface Fault {
  critical: number;
  major: number;
  minor: number;
  warning: number;
}

export interface Resourcepool {
  poolId: string;
  poolName: string;
  active?: boolean;
  node: Node[];
}

export interface Node {
  nodeId: string;
  nodeName: string;
  cpu: Cpu[];
  nic: Nic[];
  memory: Memory;
  storage: Storage;
}

export interface Cpu {
  id: string;
  name: string;
  cores: number;
}

export interface Nic {
  id: string;
  name: string;
  description: string;
}

export interface Memory {
  name: string;
  frequency: string;
  size: string;
}

export interface Storage {
  name: string;
  size: string;
  type: string;
}

export interface OcloudPerformance {
  totalCpu: number;
  usedCpu: number;
}

@Component({
  selector: 'app-o-cloud-info',
  templateUrl: './o-cloud-info.component.html',
  styleUrls: ['./o-cloud-info.component.scss']
})

export class OCloudInfoComponent implements OnInit {
  cloudId: string = '';
  utilizationPercent: number = 0;
  ocloudInfo: OcloudInfo = {} as OcloudInfo;
  ocloudPerformance: OcloudPerformance = {} as OcloudPerformance;
  softwareList: SoftwareList[] = [];
  faultColors: string[] = ['#FF0000', '#FFA042', '	#FFFF37', '#00FFFF'];
  showTooltipCpu: any = {};
  showTooltipNic: any = {};
  @ViewChild('updateModal') updateModal: any;
  updateModalRef!: MatDialogRef<any>;
  updateForm!: FormGroup;
  formValidated = false;
  /* CRITICAL,MAJOR,MINOR,WARNING */
  severitys: string[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private http: HttpClient,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.severitys = this.commonService.severitys;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.cloudId = params['cloudId'];
      this.getOcloudInfo();
      this.getOcloudPerformance();
      this.getSoftwareList();
    });
  }

  getOcloudInfo() {
    if (this.commonService.isLocal) {
      /* local file test */
      this.ocloudInfo = this.commonService.ocloudInfo;
      this.ocloudInfoDeal();
    } else {
      const url = `${this.commonService.restPath}/queryOcloudInfo/${this.cloudId}`;
      this.http.get(url).subscribe(
        res => {
          console.log('getOcloudInfo:');
          console.log(res);
	  const str = JSON.stringify(res);//convert array to string
	  this.ocloudInfo = JSON.parse(str);
          this.ocloudInfo = res as OcloudInfo;
          this.ocloudInfoDeal();
        }
      );
    }
  }

  getOcloudPerformance() {
    if (this.commonService.isLocal) {
      /* local file test */
      this.ocloudPerformance = this.commonService.ocloudPerformance;
      this.ocloudPerformanceDeal();
    } else {
      const url = `${this.commonService.restPath}/queryOcloudPerformance/${this.cloudId}`;
      this.http.get(url).subscribe(
        res => {
          console.log('getOcloudPerformance:');
          console.log(res);
          this.ocloudPerformance = res as OcloudPerformance;
          this.ocloudPerformanceDeal();
        }
      );
    }
  }

  getSoftwareList() {
    if (this.commonService.isLocal) {
      /* local file test */
      this.softwareList = this.commonService.softwareList;

    } else {
      const url = `${this.commonService.restPath}/querySoftwareList`;
      this.http.get(url).subscribe(
        res => {
          console.log('getSoftwareList:');
          console.log(res);
          this.softwareList = res as SoftwareList[];
        }
      );
    }
  }

  ocloudInfoDeal() {
    if (this.ocloudInfo.resourcepool && this.ocloudInfo.resourcepool.length > 0) {
      this.ocloudInfo.resourcepool[0].active = true;
    }
  }

  ocloudPerformanceDeal() {
    this.utilizationPercent = Math.floor((Number(this.ocloudPerformance.usedCpu) / Number(this.ocloudPerformance.totalCpu)) * 100);
  }

  severityText(severity: string): string {
    return this.commonService.severityText(severity);
  }

  severityCount(severity: string): number {
    if (severity.toUpperCase() === this.severitys[0]) {
      return this.ocloudInfo.fault.critical;
    } else if (severity.toUpperCase() === this.severitys[1]) {
      return this.ocloudInfo.fault.major;
    } else if (severity.toUpperCase() === this.severitys[2]) {
      return this.ocloudInfo.fault.minor;
    } else if (severity.toUpperCase() === this.severitys[3]) {
      return this.ocloudInfo.fault.warning;
    } else {
      return 0;
    }
  }

  back() {
    this.router.navigate(['/main/o-cloud-mgr']);
  }


  viewMore() {
    this.router.navigate(['/main/fault-mgr']);
  }

  openUpdateModel() {
    this.formValidated = false;
    this.updateForm = this.fb.group({
      'type': new FormControl('imageUrl'),
      'imageUrl': new FormControl('', [Validators.required]),
      'fileName': new FormControl('')
    });
    this.updateModalRef = this.dialog.open(this.updateModal, { id: 'updateModal' });
    this.updateModalRef.afterClosed().subscribe(() => {
      this.formValidated = false;
    });
  }

  changeType(e: MatButtonToggleChange) {
    this.formValidated = false;
    if (e.value === 'imageUrl') {
      this.updateForm.controls['imageUrl'].setValidators([Validators.required]);
      this.updateForm.controls['fileName'].setValidators(null);
      this.updateForm.controls['fileName'].setValue('');
    } else {
      this.updateForm.controls['imageUrl'].setValidators(null);
      this.updateForm.controls['imageUrl'].setValue('');
      this.updateForm.controls['fileName'].setValidators([Validators.required]);
    }
    this.updateForm.controls['imageUrl'].updateValueAndValidity();
    this.updateForm.controls['fileName'].updateValueAndValidity();
  }

  update() {
    this.formValidated = true;
    if (!this.updateForm.valid) {
      return;
    }
    if (this.commonService.isLocal) {
      /* local file test */
      this.updateModalRef.close();
    } else {
      const url = `${this.commonService.restPath}/applyOcloudSoftware`;
      const body: any = {
        ocloud: this.ocloudInfo.id
      };
      if (this.updateForm.controls['type'].value === 'imageUrl') {
        const imageUrlSplit = this.updateForm.controls['imageUrl'].value.split('/');
        body['fileName'] = imageUrlSplit[imageUrlSplit.length - 1];
      } else {
        body['fileName'] = this.updateForm.controls['fileName'].value;
      }
      this.http.post(url, JSON.stringify(body)).subscribe(
        () => console.log('Update Successful.')
      );
    }
  }

  veiw(opt: Nf) {
    const url = '/main/nf-mgr';
    this.router.navigate([url]);
  }

}
