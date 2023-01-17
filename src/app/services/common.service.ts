import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrderSummaryModel } from '../model/order-summary.model';
import { Observable } from 'rxjs';
import { ResponseModel } from '../model/response.model';
import { AuthModel } from '../model/auth.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {


  constructor(private http: HttpClient, private authService: AuthService) { }

  private baseUrl = 'https://trapezeicecreamapi.azurewebsites.net/';

  getHeader(userName: string) { //generating auth header based on user selected
    return this.authService.getAuthHeader(userName);
  }

  saveOrder(payload: any, userName: string): Observable<ResponseModel> {  //post order api call 
    return this.http.post<ResponseModel>(`${this.baseUrl}ice-cream-shop/transaction`, payload, { headers: this.getHeader(userName) });
  }
}
