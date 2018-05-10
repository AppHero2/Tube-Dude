import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class VideoService implements Resolve<any>{

    routeParams: any;
    video: any;
    onVideoChanged: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(
        private http: HttpClient,
        private afs: AngularFirestore
    )
    {
    }

    /**
     * Resolve
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {

        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getVideo()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getVideo(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                this.onVideoChanged.next(false);
                resolve(false);
            }
            else
            {
              this.afs.collection('VideoList').snapshotChanges().map(changes => {
                return changes.map(c => ({id: c.payload.doc.id, ...c.payload.doc.data()}));
              }).subscribe(data => {
                this.video = data;
                this.onVideoChanged.next(this.video);
                resolve(data);
              }, reject);
            }
        });
    }

    saveVideo(video)
    {
        const id = video.id;
        return this.afs.doc(`VideoList/${id}`).update(video);
    }

    addVideo(video)
    {
        const id = this.afs.createId();
        video.id = id;
        return this.afs.doc(`VideoList/${id}`).set(video);

    }
}
