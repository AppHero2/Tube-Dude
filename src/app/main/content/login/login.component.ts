import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { error } from 'selenium-webdriver';
import { log } from 'util';

@Component({
    selector   : 'app-login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss'],
    animations : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    loginFormErrors: any;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router
    )
    {
        this.fuseConfig.setConfig({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.loginFormErrors = {
            email   : {},
            password: {}
        };
    }

    ngOnInit()
    {
        this.loginForm = this.formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.loginForm.valueChanges.subscribe(() => {
            this.onLoginFormValuesChanged();
        });
    }

    onLoginFormValuesChanged()
    {
        for ( const field in this.loginFormErrors )
        {
            if ( !this.loginFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }

    signInWithEmailAndPassword() {
        this.authService.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).then(() => {
            this.goHome();
        }, (error) => {
            console.log('Email:', error);
        });
    }

    signInWithGoogleplus() {
        this.authService.signInWithGoogleplus().then(() => {
           this.goHome();
        }, (error) => {
            console.log("google:", error);
        });
    }

    private goHome(){
        this.authService.hasPermission.subscribe(hasPermission => {
            if (hasPermission) {
                this.router.navigate(['/']);
            } else {
                alert('You are not allowed as admin yet.');
            }
        })
    }
}
