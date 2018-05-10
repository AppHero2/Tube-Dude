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

    video = new Video();
    onProductChanged: Subscription;
    pageType: string;
    videoForm: FormGroup;

    constructor(
        private videoService: VideoService,
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
            this.videoService.onVideoChanged
                .subscribe(video => {

                    if ( video )
                    {
                        this.video = new Video(video);
                        this.pageType = 'edit';
                    }
                    else
                    {
                        this.pageType = 'new';
                        this.video = new Video();
                    }

                    this.videoForm = this.createVideoForm();
                });
    }

    ngOnDestroy()
    {
        this.onProductChanged.unsubscribe();
    }

    createVideoForm()
    {
        return this.formBuilder.group({
            id              : [this.video.id],
            tube_id         : [this.video.tube_id],
            unique_code     : [this.video.unique_code],
            description     : [this.video.description],
            playback        : [this.video.playback],
            createdAt       : [this.video.createdAt],
            active          : [this.video.active]
        });
    }

    saveVideo()
    {
        const data = this.videoForm.getRawValue();
        data.handle = FuseUtils.handleize(data.tube_id);
        this.videoService.saveVideo(data)
            .then(() => {

                // Trigger the subscription with new data
                this.videoService.onVideoChanged.next(data);

                // Show the success message
                this.snackBar.open('Video saved', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
            });
    }

    addVideo()
    {
        const data = this.videoForm.getRawValue();
        data.handle = FuseUtils.handleize(data.tube_id);
        
        this.videoService.addVideo(data)
            .then(() => {

                // Trigger the subscription with new data
                this.videoService.onVideoChanged.next(data);

                // Show the success message
                this.snackBar.open('Video added', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                // this.location.go('/products/' + this.product.id + '/' + this.product.handle);
            });
    }
}
