import { RouterModule, Routes } from '@angular/router';

//componentes
import { LoginComponent } from './components/login/login.component';
import { ProductlistComponent } from './components/productlist/productlist.component';


const APP_ROUTES: Routes = [
  {path:'login',component:LoginComponent},
  {path:'products',component:ProductlistComponent},
  {path:'logout',component:LoginComponent},
  {path:'**', pathMatch:'full', redirectTo:'login'}
];
export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES,{useHash:true});

