import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { Video } from './video.model';
import { VideoService } from './video.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class VideoComponent implements OnInit, OnDestroy {

  product = new Video();
    onProductChanged: Subscription;
    pageType: string;
    productForm: FormGroup;

    constructor(
        private productService: VideoService,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private location: Location
    )
    {
    }

    ngOnInit()
    {
        // Subscribe to update product on changes
        this.onProductChanged =
            this.productService.onProductChanged
                .subscribe(product => {

                    if ( product )
                    {
                        this.product = new Video(product);
                        this.pageType = 'edit';
                    }
                    else
                    {
                        this.pageType = 'new';
                        this.product = new Video();
                    }

                    this.productForm = this.createProductForm();
                });
    }

    ngOnDestroy()
    {
        this.onProductChanged.unsubscribe();
    }

    createProductForm()
    {
        return this.formBuilder.group({
            id              : [this.product.id],
            name            : [this.product.name],
            handle          : [this.product.handle],
            description     : [this.product.description],
            categories      : [this.product.categories],
            tags            : [this.product.tags],
            images          : [this.product.images],
            priceTaxExcl    : [this.product.priceTaxExcl],
            priceTaxIncl    : [this.product.priceTaxIncl],
            taxRate         : [this.product.taxRate],
            comparedPrice   : [this.product.comparedPrice],
            quantity        : [this.product.quantity],
            sku             : [this.product.sku],
            width           : [this.product.width],
            height          : [this.product.height],
            depth           : [this.product.depth],
            weight          : [this.product.weight],
            extraShippingFee: [this.product.extraShippingFee],
            active          : [this.product.active]
        });
    }

    saveProduct()
    {
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        this.productService.saveProduct(data)
            .then(() => {

                // Trigger the subscription with new data
                this.productService.onProductChanged.next(data);

                // Show the success message
                this.snackBar.open('Product saved', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
            });
    }

    addProduct()
    {
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        this.productService.addProduct(data)
            .then(() => {

                // Trigger the subscription with new data
                this.productService.onProductChanged.next(data);

                // Show the success message
                this.snackBar.open('Product added', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                this.location.go('apps/e-commerce/products/' + this.product.id + '/' + this.product.handle);
            });
    }
}