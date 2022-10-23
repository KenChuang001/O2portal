import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../shared/common.service';

export interface SoftwareList {
  id: string;
  fileName: string;
  version: string;
  type: number;
  description: string;
}

@Component({
  selector: 'app-software-management',
  templateUrl: './software-management.component.html',
  styleUrls: ['./software-management.component.scss']
})
export class SoftwareManagementComponent implements OnInit {
  softwareList: SoftwareList[] = [];
  @ViewChild('createModal') createModal: any;
  @ViewChild('deleteModal') deleteModal: any;
  createModalRef!: MatDialogRef<any>;
  deleteModalRef!: MatDialogRef<any>;
  createForm!: FormGroup;
  selectSoftware!: SoftwareList;
  nfTypeList: string[] = ['CU', 'DU'];
  file: any;
  typeMap: Map<number, string> = new Map();
  p: number = 1;            // 當前頁數
  pageSize: number = 10;    // 每頁幾筆
  totalItems: number = 0;   // 總筆數
  fileMsg: string = '';
  formValidated = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private commonService: CommonService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.typeMap.set(0, 'O-Cloud');
    this.typeMap.set(1, `NF(${this.nfTypeList[0]})`);
    this.typeMap.set(2, `NF(${this.nfTypeList[1]})`);
  }

  ngOnInit(): void {
    this.getSoftwareList();
  }

  getSoftwareList() {
    if (this.commonService.isLocal) {
      /* local file test */
      this.softwareList = this.commonService.softwareList;
      this.softwareListDeal();
    } else {
      const url = `${this.commonService.restPath}/querySoftwareList`;
      this.http.get(url).subscribe(
        res => {
          console.log('getSoftwareList:');
          console.log(res);
          this.softwareList = res as SoftwareList[];
          this.softwareListDeal();
        }
      );
    }
  }

  softwareListDeal() {
    this.totalItems = this.softwareList.length;
  }

  openCreateModal() {
    this.formValidated = false;
    this.createForm = this.fb.group({
      'fileName': new FormControl('', [Validators.required]),
      'description': new FormControl(''),
      'version': new FormControl('', [Validators.required]),
      'type': new FormControl('0'),
      'nfType': new FormControl('CU')
    });
    this.createModalRef = this.dialog.open(this.createModal, { id: 'createModal' });
    this.createModalRef.afterClosed().subscribe(() => {
      this.fileMsg = '';
      this.formValidated = false;
    });
  }

  fileChange(e: any) {
    // console.log(e);
    this.fileMsg = '';
    let passFile = null;
    const files = e.target.files;
    if ('0' in files) {
      if (files[0].name.indexOf('.tar') >= 0) {
        passFile = files[0];
      } else {
        this.fileMsg = '格式只允許[file].tar';
      }
    }
    if (passFile === null) {
      this.file = null;
      this.createForm.controls['fileName'].setValue('');
    } else {
      this.file = files[0];
      this.createForm.controls['fileName'].setValue(files[0].name);
    }
    // console.log(files);
  }

  create() {
    // 先呼叫createSoftware、然後利用return softwareId呼叫uploadSoftwar
    this.formValidated = true;
    if (!this.createForm.valid) {
      return;
    }
    if (this.commonService.isLocal) {
      /* local file test */
      this.commonService.softwareList.push(
        {
          id: "s0011009",
          fileName: "Os_image_2.tar",
          version: "1.1.0",
          type: 0,
          description: "Test"
        }
      );
      this.createModalRef.close();
      this.getSoftwareList();

    } else {
      const createUrl = `${this.commonService.restPath}/createSoftware`;
      const body = this.createForm.value;
      if (this.createForm.controls['type'].value === '1' && this.createForm.controls['nfType'].value === 'DU') {
        body['type'] = '2';
      }
      body['type'] = Number(body['type']);
      this.http.post(createUrl, JSON.stringify(body)).subscribe(
        (res: any) => {
          console.log('createSoftware:');
          console.log(res);
          const softwareId = res['softwareId'];
          const uploadUrl = `${this.commonService.restPath}/uploadSoftware/${softwareId}`;
          const options = this.commonService.options;
          const formData = new FormData();
          formData.append('file', this.file);
          this.http.post(uploadUrl, formData, options).subscribe(
            () => {
              this.createModalRef.close();
              this.getSoftwareList();
            }
          );
        }
      );
    }
  }

  openDelectModal(softwareList: SoftwareList) {
    this.selectSoftware = softwareList;
    this.deleteModalRef = this.dialog.open(this.deleteModal, { id: 'deleteModal' });
  }

  delete() {
    if (this.commonService.isLocal) {
      /* local file test */
      for (let i = 0; i < this.commonService.softwareList.length; i++) {
        if (this.selectSoftware.id === this.commonService.softwareList[i].id) {
          this.commonService.softwareList.splice(i, 1);
          break;
        }
      }
      this.deleteModalRef.close();
      this.getSoftwareList();
    } else {
      const url = `${this.commonService.restPath}/deleteSoftware`;
      const body = {
        softwareId: this.selectSoftware.id
      }
      this.http.post(url, JSON.stringify(body)).subscribe(
        res => {
          this.deleteModalRef.close();
          this.getSoftwareList();
        }
      );
    }
  }

  typeText(type: number): string {
    return this.typeMap.get(type) as string;
  }

  pageChanged(page: number) {
    this.p = page;
  }
}
