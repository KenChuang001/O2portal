import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonService } from '../shared/common.service';

export interface style {
  displayName: string;
  value: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  title = 'Dashboard';
  page: 'dashboard' | 'o-cloud-management' | 'nf-management' | 'fault-management' | 'performance-management' | 'software-management' = 'dashboard';
  styles: style[] = [
    { displayName: 'Dark Style', value: 'black' },
    { displayName: 'Light Style', value: 'bright' }
  ]
  styleType: string = this.styles[0].value;

  pageRourter = {
    'dashboard': '/main/dashboard',
    'o-cloud-management': '/main/o-cloud-mgr',
    'nf-management': '/main/nf-mgr',
    'fault-management': '/main/fault-mgr',
    'performance-management': '/main/performance-mgr',
    'software-management': '/main/software-mgr'
  }

  constructor(private router: Router, private commonService: CommonService) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // router更新menu foucs
        this.reloadTitle(event.url);
      }
    });
    // init menu foucs
    this.reloadTitle(this.router.url);
    // init style
    this.initStyle();
  }

  initStyle() {
    const styleType = window.sessionStorage.getItem('styleType');
    if (styleType) {
      this.styleType = styleType;
    }
    this.renderStyle();
  }

  changePage(url: string) {
    this.router.navigate([url]);
  }

  reloadTitle(routerUrl: string) {
    if (routerUrl.indexOf(this.pageRourter['dashboard']) >= 0) {
      this.title = 'Dashboard';
      this.page = 'dashboard';
    } else if (routerUrl.indexOf(this.pageRourter['o-cloud-management']) >= 0) {
      this.title = 'O-Cloud List';
      this.page = 'o-cloud-management';
    } else if (routerUrl.indexOf(this.pageRourter['nf-management']) >= 0) {
      this.title = 'NF List';
      this.page = 'nf-management';
    } else if (routerUrl.indexOf(this.pageRourter['fault-management']) >= 0) {
      this.title = 'Fault Management';
      this.page = 'fault-management';
    } else if (routerUrl.indexOf(this.pageRourter['performance-management']) >= 0) {
      this.title = 'Performance Management';
      this.page = 'performance-management';
    } else if (routerUrl.indexOf(this.pageRourter['software-management']) >= 0) {
      this.title = 'Software Management';
      this.page = 'software-management';
    }
  }

  logout() {
    this.router.navigate(['/login']);
    window.sessionStorage.removeItem('styleType');
  }

  changeStyle(opt: style) {
    this.styleType = opt.value;
    this.renderStyle();
  }

  renderStyle() {
    // 儲存在sessionStorage
    window.sessionStorage.setItem('styleType', this.styleType);
    /**
     * 1.clear css
     * 2.id='__[value]'
     */
    this.styles.forEach((row) => {
      const id = `__${row.value}`;
      if (document.getElementById(id)) {
        document.head.removeChild(document.getElementById(id) as any);
      }
    });
    // add css
    var head: any = document.getElementsByTagName('head')[0];
    var style = document.createElement('link');
    style.id = `__${this.styleType}`;
    style.href = `assets/css/${this.styleType}.css`;
    style.type = 'text/css';
    style.rel = 'stylesheet';
    head.appendChild(style);
  }
}
