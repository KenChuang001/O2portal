import { Injectable } from '@angular/core';
import { OCloudList } from './../o-cloud-management/o-cloud-management.component';
import { SystemSummary } from '../dashboard/dashboard.component';
import { OcloudSummary } from '../dashboard/dashboard.component';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OcloudInfo, OcloudPerformance } from '../o-cloud-management/o-cloud-info/o-cloud-info.component';
import { FaultMessage, FaultMessages } from '../fault-management/fault-management.component';
import * as _ from 'lodash';
import { SoftwareList } from '../software-management/software-management.component';
import { MainComponent } from '../main/main.component';
import { Nf } from '../nf-management/nf-management.component';

export interface NowTime {
  year: string;
  month: string;
  day: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isLocal!: boolean;
  restPath!: string;
  options = { headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }) };
  severitys: string[] = ['CRITICAL', 'MAJOR', 'MINOR', 'WARNING'];
  scaleFontSize: number = 20;
  rangeWidth: number = 10;

  constructor(private http: HttpClient) { }

  loadConfig(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get('./assets/config/connection.json').subscribe(
        (res: any) => {
          // this.isLocal = true;
          //this.restPath = 'http://192.168.137.128:8080/restapi/webresources/ocloud';
          // this.restPath = 'http://140.96.102.141:8080/restapi/webresources/ocloud';
          this.isLocal = res['local'];
          this.restPath = res['url'] + ':' + res['port'] + res['root'];
          resolve(true);
        });
    });
  }

  colorOne(): string {
    const styleType = window.sessionStorage.getItem('styleType');
    if (styleType === 'black') {
      return '#4FFF4F';
    } else {
      return '#27a327';
    }
  }

  colorTwo(): string {
    const styleType = window.sessionStorage.getItem('styleType');
    if (styleType === 'black') {
      return '#FFC14F';
    } else {
      return '#fc8f2a';
    }
  }

  colorThree(): string {
    const styleType = window.sessionStorage.getItem('styleType');
    if (styleType === 'black') {
      return '#FF3B3B';
    } else {
      return '#e90000';
    }
  }

  getNowTime(): NowTime {
    const d = new Date();
    const year = _.toString(d.getFullYear());
    const month = this.addZero(d.getMonth() + 1);
    const day = this.addZero(d.getDate());
    return {
      year: year,
      month: month,
      day: day
    }
  }

  addZero(t: number): string {
    const tStr = _.toString(t);
    if (tStr.length === 1) {
      return '0' + tStr;
    } else {
      return tStr;
    }
  }

  dealPostDate(time: any): string {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = this.addZero(date.getMonth() + 1);
    const day = this.addZero(date.getDate());
    return `${year}-${month}-${day}`;
  }

  severityText(severity: string): string {
    if (severity.toUpperCase() === 'CRITICAL') {
      return 'Critical';
    } else if (severity.toUpperCase() === 'MAJOR') {
      return 'Major';
    } else if (severity.toUpperCase() === 'MINOR') {
      return 'Minor';
    } else if (severity.toUpperCase() === 'WARNING') {
      return 'Warning';
    } else {
      return '';
    }
  }

  systemSummary: SystemSummary = {
    "totalNodes": 20,
    "usedNodes": 18,
    "ocloudCount": 2,
    "nfCount": 10,
    "cpuUtilized": 30,
    "interfaceUtilized": 18
  };

  ocloudSummary: OcloudSummary[] = [
    {
      id: "cloud000-0000-0000-0000-000000000000",
      name: "cloud0",
      dmsCount: 1,
      nfCount: 2,
      faultCount: 20
    },
    {
      id: "cloud000-0000-0000-0000-000000000001",
      name: "cloud1",
      dmsCount: 1,
      nfCount: 0,
      faultCount: 0
    },
    {
      id: "cloud000-0000-0000-0000-000000000002",
      name: "cloud2",
      dmsCount: 2,
      nfCount: 0,
      faultCount: 0
    },
    {
      id: "cloud000-0000-0000-0000-000000000003",
      name: "cloud3",
      dmsCount: 1,
      nfCount: 0,
      faultCount: 0
    },
    {
      id: "cloud000-0000-0000-0000-000000000004",
      name: "cloud4",
      dmsCount: 2,
      nfCount: 0,
      faultCount: 0
    },
    {
      id: "cloud000-0000-0000-0000-000000000005",
      name: "cloud5",
      dmsCount: 1,
      nfCount: 0,
      faultCount: 0
    },
    {
      id: "cloud000-0000-0000-0000-000000000006",
      name: "cloud6",
      dmsCount: 2,
      nfCount: 0,
      faultCount: 0
    }
    ,
    {
      id: "cloud000-0000-0000-0000-000000000007",
      name: "cloud7",
      dmsCount: 1,
      nfCount: 0,
      faultCount: 0
    },
    {
      id: "cloud000-0000-0000-0000-000000000008",
      name: "cloud8",
      dmsCount: 2,
      nfCount: 0,
      faultCount: 0
    },
    {
      id: "cloud000-0000-0000-0000-000000000009",
      name: "cloud9",
      dmsCount: 2,
      nfCount: 0,
      faultCount: 0
    }
  ];

  ocloudList: OCloudList[] = [
    {
      id: "cloud000-0000-0000-0000-000000000000",
      name: "cloud0",
      imsEndpoint: "http://10.172.61.30:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 1,
      nfCount: 2,
      deployStatus: "Deploy Finished"
    },
    {
      id: "cloud000-0000-0000-0000-000000000001",
      name: "cloud1",
      imsEndpoint: "http://10.172.61.31:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 1,
      nfCount: 0,
      deployStatus: "Deploy MaaS"
    },
    {
      id: "cloud000-0000-0000-0000-000000000002",
      name: "cloud2",
      imsEndpoint: "http://10.172.61.32:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 2,
      nfCount: 0,
      deployStatus: "Register VM on MaaS"
    },
    {
      id: "cloud000-0000-0000-0000-000000000003",
      name: "cloud3",
      imsEndpoint: "http://10.172.61.33:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 1,
      nfCount: 0,
      deployStatus: "Commission VM"
    },
    {
      id: "cloud000-0000-0000-0000-000000000004",
      name: "cloud4",
      imsEndpoint: "http://10.172.61.34:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 2,
      nfCount: 0,
      deployStatus: "Deploy Machines"
    },
    {
      id: "cloud000-0000-0000-0000-000000000005",
      name: "cloud5",
      imsEndpoint: "http://10.172.61.35:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 1,
      nfCount: 0,
      deployStatus: "Set Environment for k8s"
    },
    {
      id: "cloud000-0000-0000-0000-000000000006",
      name: "cloud6",
      imsEndpoint: "http://10.172.61.36:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 2,
      nfCount: 0,
      deployStatus: "Create k8s clusters"
    }
    ,
    {
      id: "cloud000-0000-0000-0000-000000000007",
      name: "cloud7",
      imsEndpoint: "http://10.172.61.37:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 1,
      nfCount: 0,
      deployStatus: "Deploy Node-Agent on each node"
    },
    {
      id: "cloud000-0000-0000-0000-000000000008",
      name: "cloud8",
      imsEndpoint: "http://10.172.61.38:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 2,
      nfCount: 0,
      deployStatus: "Deploy IMS"
    },
    {
      id: "cloud000-0000-0000-0000-000000000009",
      name: "cloud9",
      imsEndpoint: "http://10.172.61.39:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 2,
      nfCount: 0,
      deployStatus: "Deploy Finished"
    },
    {
      id: "cloud000-0000-0000-0000-000000000009",
      name: "cloud9",
      imsEndpoint: "http://10.172.61.39:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 2,
      nfCount: 0,
      deployStatus: "Deploy Finished"
    },
    {
      id: "cloud000-0000-0000-0000-000000000009",
      name: "cloud9",
      imsEndpoint: "http://10.172.61.39:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 2,
      nfCount: 0,
      deployStatus: "Deploy Finished"
    }

  ];

  ocloudInfo: OcloudInfo = {
    id: "33ebda65-f3aa-457a-9f7b-f587cd0efcc7",
    name: "cloud1",
    imsEndpoint: "http://10.172.61.30:5005/o2ims_infrastructureInventory/v1/",
    callbackUri: "https://10.0.2.16/callback/33ebda65",
    softwareVersion: "1.1.0",
    dms: [
      {
        id: "98cd5e2a-e9d5-3aa5-afdd-2c05d2be8e46",
        name: "k8s-cluster0",
        dmsEndpoint: "http://10.172.61.30:5005/o2dms/v1/98cd5e2a-e9d5-3aa5-afdd-2c05d2be8e46/"
      },
    ],
    nf: [
      {
        id: "47574686-3503-49c4-82ea-1d3312323df5",
        name: "nf1",
        dmsName: "k8s-cluster0",
        status: 1
      },
      {
        id: "47574686-3503-49c4-82ea-1d3312324c86",
        name: "nf2",
        dmsName: "k8s-cluster0",
        status: 1
      }
    ],
    fault: {
      critical: 10,
      major: 10,
      minor: 10,
      warning: 10
    },
    resourcepool: [
      {
        poolId: "pool0000-0000-0000-0000-000000000000",
        poolName: "pool_0",
        node: [
          {
            nodeId: "n0000001",
            nodeName: "node_0-0-0_name",
            cpu: [
              {
                id: "c0000001",
                name: "CPU1",
                cores: 4
              },
              {
                id: "c0000002",
                name: "CPU2",
                cores: 8
              }
            ],
            nic: [
              {
                id: "i000001",
                name: "NIC1",
                description: "10GbE"
              }
            ],
            memory: {
              name: "memory",
              frequency: "xGhz",
              size: "40GB"
            },
            storage: {
              name: "SanDisk",
              size: "80GB",
              type: "SSD / HDD"
            }
          },
          {
            nodeId: "n0000001",
            nodeName: "node_0-0-0_name",
            cpu: [
              {
                id: "c0000001",
                name: "CPU1",
                cores: 4
              },
              {
                id: "c0000002",
                name: "CPU2",
                cores: 8
              }
            ],
            nic: [
              {
                id: "i000001",
                name: "NIC1",
                description: "10GbE"
              }
            ],
            memory: {
              name: "memory",
              frequency: "xGhz",
              size: "40GB"
            },
            storage: {
              name: "SanDisk",
              size: "80GB",
              type: "SSD / HDD"
            }
          },
          {
            nodeId: "n0000001",
            nodeName: "node_0-0-0_name",
            cpu: [
              {
                id: "c0000001",
                name: "CPU1",
                cores: 4
              },
              {
                id: "c0000002",
                name: "CPU2",
                cores: 8
              }
            ],
            nic: [
              {
                id: "i000001",
                name: "NIC1",
                description: "10GbE"
              }
            ],
            memory: {
              name: "memory",
              frequency: "xGhz",
              size: "40GB"
            },
            storage: {
              name: "SanDisk",
              size: "80GB",
              type: "SSD / HDD"
            }
          }
        ]
      },
      {
        poolId: "pool0000-0000-0000-0000-000000000000",
        poolName: "pool_1",
        node: [
          {
            nodeId: "n0000001",
            nodeName: "node_0-1-0_name",
            cpu: [
              {
                id: "c0000001",
                name: "CPU1",
                cores: 4
              }
            ],
            nic: [
              {
                id: "i000001",
                name: "NIC1",
                description: "10GbE"
              },
              {
                id: "i000001",
                name: "NIC2",
                description: "10GbE"
              }
            ],
            memory: {
              name: "memory",
              frequency: "xGhz",
              size: "40GB"
            },
            storage: {
              name: "SanDisk",
              size: "80GB",
              type: "SSD / HDD"
            }
          },
          {
            nodeId: "n0000001",
            nodeName: "node_0-1-0_name",
            cpu: [
              {
                id: "c0000001",
                name: "CPU1",
                cores: 4
              }
            ],
            nic: [
              {
                id: "i000001",
                name: "NIC1",
                description: "10GbE"
              },
              {
                id: "i000001",
                name: "NIC2",
                description: "10GbE"
              }
            ],
            memory: {
              name: "memory",
              frequency: "xGhz",
              size: "40GB"
            },
            storage: {
              name: "SanDisk",
              size: "80GB",
              type: "SSD / HDD"
            }
          },
          {
            nodeId: "n0000001",
            nodeName: "node_0-1-0_name",
            cpu: [
              {
                id: "c0000001",
                name: "CPU1",
                cores: 4
              }
            ],
            nic: [
              {
                id: "i000001",
                name: "NIC1",
                description: "10GbE"
              },
              {
                id: "i000001",
                name: "NIC2",
                description: "10GbE"
              }
            ],
            memory: {
              name: "memory",
              frequency: "xGhz",
              size: "40GB"
            },
            storage: {
              name: "SanDisk",
              size: "80GB",
              type: "SSD / HDD"
            }
          }
        ]
      }
    ]
  };

  ocloudPerformance: OcloudPerformance = {
    totalCpu: 20,
    usedCpu: 18
  }

  faultMessage: FaultMessage = {
    totalMessageNumber: 1000,
    faultMessages: [
      {
        timestamp: "2022/07/01 20: 00: 00",
        cloudId: "cloud00000000",
        nfId: "nf000000001",
        severity: "Critical",
        context: "Network route failed",
        isCleared: false,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud1",
        nfName: "nf1"
      },
      {
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Major",
        context: "IO Error",
        isCleared: true,
        processStatus: 1,
        processComment: "By sswu",
        cloudName: "cloud2",
        nfName: "nf2"
      },
      {
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Minor",
        context: "IO Error",
        isCleared: true,
        processStatus: 1,
        processComment: "IO Changed",
        cloudName: "cloud2",
        nfName: "nf2"
      },
      {
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Warning",
        context: "IO Error",
        isCleared: true,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud2",
        nfName: "nf2"
      },
      {
        timestamp: "2022/07/01 20: 00: 00",
        cloudId: "cloud00000000",
        nfId: "nf000000001",
        severity: "Critical",
        context: "Network route failed",
        isCleared: false,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud2",
        nfName: "nf2"
      },
      {
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Major",
        context: "IO Error",
        isCleared: true,
        processStatus: 1,
        processComment: "By sswu",
        cloudName: "cloud2",
        nfName: "nf2"
      },
      {
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Minor",
        context: "IO Error",
        isCleared: true,
        processStatus: 1,
        processComment: "IO Changed",
        cloudName: "cloud2",
        nfName: "nf2"
      },
      {
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Warning",
        context: "IO Error",
        isCleared: true,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud2",
        nfName: "nf2"
      },
      {
        timestamp: "2022/07/01 20: 00: 00",
        cloudId: "cloud00000000",
        nfId: "nf000000001",
        severity: "Critical",
        context: "Network route failed",
        isCleared: false,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud2",
        nfName: "nf2"
      },
      {
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Major",
        context: "IO Error",
        isCleared: true,
        processStatus: 1,
        processComment: "By sswu",
        cloudName: "cloud2",
        nfName: "nf2"
      }
    ]
  };

  softwareList: SoftwareList[] = [
    {
      id: "s0011001",
      fileName: "Os_image_2.tar",
      version: "1.1.0",
      type: 0,
      description: "Test"
    },
    {
      id: "s0011002",
      fileName: "Os_image_3.tar",
      version: "1.1.1",
      type: 0,
      description: "Test2"
    },
    {
      id: "s0011003",
      fileName: "Os_image_4.tar",
      version: "1.1.3",
      type: 1,
      description: "Test3"
    },
    {
      id: "s0011004",
      fileName: "NF_image_5.tar",
      version: "1.2.0",
      type: 1,
      description: "Test4"
    },
    {
      id: "s0011005",
      fileName: "NF_image_7.tar",
      version: "1.2.0",
      type: 2,
      description: "Test6"
    }
  ];

  nfList: Nf[] = [
    {
      id: "47574686-3503 - 49c4- 82ea - 1d3312323df5",
      name: "nf1",
      ocloudName: "cloud1",
      status: 1,
    },
    {
      id: "47574686 - 3503 - 49c4 - 82ea - 1d3312323df6",
      name: "nf2",
      ocloudName: "cloud1",
      status: 0,
    },
    {
      id: "47574686 - 3503 - 49c4 - 82ea - 1d3312323df7",
      name: "nf3",
      ocloudName: "cloud2",
      status: 1,
    }
  ];

}
