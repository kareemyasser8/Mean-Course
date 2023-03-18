import { ErrorComponent } from './error/error/error.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError,pipe, throwError } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

  constructor(private dialog: MatDialog){}

  intercept(req: HttpRequest<any>,next:HttpHandler){
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse)=>{
        this.dialog.open(ErrorComponent)
        return throwError(()=>console.log(error))
      })
    )
  }
}
