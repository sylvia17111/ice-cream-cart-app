import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel } from '../model/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  authUserList = [{
    name: "Alanna Mosvani",
    userName: "amosvani",
    pwd: "TW9zdmFuaXh4"
  },
  {
    name: "Mat Cauthon",
    userName: "mcauthon",
    pwd: "Q2F1dGhvbnh4"
  },
  {
    name: "Moiraine Damodred",
    userName: "mdamodred",
    pwd: "RGFtb2RyZWR4"
  }
  ] as const;

  getAuthHeader(userName: string) {
    let userObject: AuthModel = this.authUserList?.filter((user: AuthModel) => user?.name === userName)[0];

    return new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${userObject?.userName}` + ':' + `${userObject?.pwd}`)}`
      }
    );


  }
}
