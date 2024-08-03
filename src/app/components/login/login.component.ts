import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import { User } from 'src/app/models/user';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
 // styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  title = 'Login From';
  desc = 'Angular Demo';
  user : User; 
  status: 'success' | 'error' | null = null;
  logStatus : boolean = false;
  myForm: FormGroup;
  private readonly DEMO_EMAIL = "user@demo.com";
  private readonly DEMO_PASSWORD = "123456";
  private unsubscribe$ = new Subject<void>();
  
  constructor(
    private router: Router,
    public authService:AuthService,
    private fb: FormBuilder
  ){
   this.user = new User(0,'','');
   this.myForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
  
    });
  }
  
  ngOnInit(): void{
    this.authService.isLoggedIn
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((status) => {
      this.logStatus = status;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
 
  login(): void{
    if (this.myForm.invalid) { 
        this.status = 'error'; 
        return;
    } 

    const {email, password}= this.myForm.value;

    if(email === this.DEMO_EMAIL && password === this.DEMO_PASSWORD){
      const demoToken = 'demo-token-' + Date.now();
      console.log(demoToken);
      this.authService.loginUser(demoToken);
      localStorage.setItem('identity', email);
      this.router.navigate(['/products']);
    } else {
      this.status = 'error';
    }
   
  }
}
