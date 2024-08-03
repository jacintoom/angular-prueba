import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError,throwError } from 'rxjs';
import { Product } from 'src/app/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductListService {
  private readonly API_URL = 'https://fakestoreapi.com';
 
  constructor(private http: HttpClient) { }
  getProductList(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products`)
      .pipe(catchError(this.handleError));
    
  }

  getCategories(): Observable<string[]> {
    return  this.http.get<string[]>(`${this.API_URL}/products/categories`)
      .pipe(catchError(this.handleError));
    
  }

  searchCategory( category: string ):Observable<Product[]> {
    return this.http.get<Product[]>(`https://fakestoreapi.com/products/category/${ category }`)
      .pipe(catchError(this.handleError));

  }
  limitProducts( limit: string ):Observable<any> {
    return this.http.get(`https://fakestoreapi.com/products?limit=${ limit }`); 

  }

  productM( id: number ):Observable<any> {
    return this.http.get(`https://fakestoreapi.com/products/${ id }`); 

  }

  private handleError(error:HttpErrorResponse){
    let errorMessage = 'Ocurrio un error desconocido!';
    if(error.error instanceof ErrorEvent){
      errorMessage = `Error: ${error.error.message}`;
    }else{
      errorMessage = `Error Code:${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(()=> new Error(errorMessage));
  }

}
