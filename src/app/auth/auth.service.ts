import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { AuthData } from './auth-model';

@Injectable({ providedIn: 'root' })

export class AuthService {

    private token : string;

    constructor(private http: HttpClient) {
    }

    getToken() {
        return this.token;
    }
    createUser(email: String, password: string) {
        const authData: AuthData = {email: email, password: password};

        this.http.post( 'http://localhost:5000/api/user/signup', authData)
        .subscribe( response =>{
            console.log(response);
        })
    }

    loginUser(email: string, password: string) {
        const authData: AuthData = {email: email, password: password};

        this.http.post<{token: string}>( 'http://localhost:5000/api/user/login', authData)
        .subscribe( response =>{
            const token = response.token;
            this.token = token;  
                
        })
    }


}
