import { Component, OnInit } from '@angular/core';
import { AuthApiService } from '../service/auth-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthApiService) { }

  ngOnInit() {
  }
  onLogout() {
    this.authService.logout();
  }
}
