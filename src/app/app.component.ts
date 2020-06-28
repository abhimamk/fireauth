import { Component, OnInit } from '@angular/core';
import { AuthApiService } from './service/auth-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'auth';
  constructor(private authService: AuthApiService) { }
  ngOnInit() {
    // auto login if screen is refreshed
    this.authService.autoLogin();
  }
}
