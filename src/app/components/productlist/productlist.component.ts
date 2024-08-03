import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductListService } from 'src/app/services/productList.service';
import { ViewEncapsulation } from '@angular/core';
import { Category } from 'src/app/models/category';


@Component({
    selector: 'app-productlist',
    templateUrl: './productlist.component.html',
    encapsulation:ViewEncapsulation.None
})
export class ProductlistComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: string[] = [];
  title = 'Product List';
  //id: number | undefined;
  contactForm : any = FormGroup;
  selected: string= '';
  limit: number[] = [5,10,15,20];
  logStatus:boolean = false;
  opcionLimit: string  = '10'; 
  //content:any[] = [];
  product: Product = new Product(0,'','','','','');
  //public product: Product;
  private unsubscribe$ = new Subject<void>();
  
  constructor(
              private _productService: ProductListService,
              private fb: FormBuilder,
              public authService : AuthService,
              private router: Router,
              private modal: NgbModal
    ) { }

   ngOnInit(){
    this.initForm();
    this.getProductList();
    this.getCategoriesList();
    this.subscribeToAuthStatus();
    
    /*this.contactForm = this.fb.group({
      category: [null]
    });
    this.authS.isLoggedIn.subscribe((status) => {
      this.logStatus = status;
    });*/
  }
  ngOnDestroy():void{
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

  }
  private initForm(): void {
    this.contactForm = this.fb.group({
      category: [null]
    })
  }
  private subscribeToAuthStatus(): void{
    this.authService.isLoggedIn
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((status)=>{
        this.logStatus = status;
      })
  }
  
  logout() { 
    this.authService.logoutUser();
    this.router.navigate(['/login']);
  }
 
  getProductList(): void {
    this._productService.getProductList()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next:(data) =>this.products = data,
      error:(error) =>console.error('Error al recuperar los datos:', error)
      
    });
  }

  getCategoriesList(): void {
    this._productService.getCategories()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Error al seleccionar las catgorias:', error)
    });
  }

  onOptionsSelected() {
    if(this.selected == '0'){
      this.getProductList(); 
    }else if(this.selected){  
      this._productService.searchCategory(this.selected)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (data) => this.products = data,
          error: (error) => console.error('Error al seleccionar la categoria:', error)
        });
    }

  }
 
  onLimitSelected(): void {
    this._productService.limitProducts(this.opcionLimit)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => this.products = data,
        error: (error) => console.error('Error con el limite de los productos:', error)
      });
  }

  openMo(content: any, id: number): void {
    this._productService.productM(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.product = data;
          this.modal.open(content);
        },
        error: (error) => console.error('Error recuperar el detalle del producto:', error)
      });
  }

}
