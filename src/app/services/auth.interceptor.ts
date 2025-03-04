import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clona la solicitud y agrega el encabezado x-user con valor 1
    const authReq = req.clone({
      setHeaders: {
        'x-user': '1' // Establece el valor predeterminado del encabezado
      }
    });

    // Envía la solicitud clonada con el encabezado agregado
    return next.handle(authReq);
  }
}