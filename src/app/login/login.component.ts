import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../shared/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userId: string = '';
  password: string = '';
  errMsg: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
  }

  onLoggedin() {
    this.errMsg = '';
    if (this.userId === '' || this.password === '') {
      this.errMsg = '請輸入帳號、密碼';
      return;
    }

    if (this.commonService.isLocal) {

      if (this.userId.toLowerCase() === 'admin' && this.password.toLowerCase() === 'admin') {
        this.router.navigate(['/main/dashboard']);
      } else {
        this.errMsg = '帳號、密碼輸入錯誤';
      }
    } else {
      const url = `${this.commonService.restPath}/loginpage`;   // wait api
      const body = {
        userId: this.userId,
        password: this.password
      };
      this.http.post(url, JSON.stringify(body)).subscribe(
        res => {
          if (res !== 'userID or password invalid') {
            this.router.navigate(['/main/dashboard']);
          } else { this.errMsg = '帳號、密碼輸入錯誤'; }
          //this.router.navigate(['/main/dashboard']);
        }
      );
    }
  }

  keypressHandler(event: any) {
    if (event.keyCode === 13) {
      this.onLoggedin();
    }
  }

}
