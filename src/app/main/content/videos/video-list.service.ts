
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import * as $ from 'jquery';

const ThumbURL = 'https://img.youtube.com/vi/<insert-youtube-video-id-here>/default.jpg'

@Injectable()
export class VideoListService implements Resolve<any> {

    videos: any[];

    onVideoListChanged: BehaviorSubject<any> = new BehaviorSubject({});

    constructor( private afs: AngularFirestore, private http: HttpClient ) {
        
    }

    /**
     * Resolve
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
      return this.getVideoList();
    }

    getVideoList(): Promise<any> {
        return new Promise((resolve, reject) => {
          this.afs.collection('VideoList').snapshotChanges().map(changes => {
            return changes.map(c => ({id: c.payload.doc.id, ...c.payload.doc.data()}));
          }).subscribe(data => {
            this.videos = data;
            console.log('videoList: ' , data);
            this.onVideoListChanged.next(this.videos);
            resolve(data);
          }, reject);
        });
    }

    
}
