
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import * as $ from 'jquery';

const MSG_APPROVE = "Congratulations, your application has been approved.  We will be contacting you shortly."
const MSG_REJECT = "We regret to inform you that we cannot proceed with your application right now."
const endPoint = "https://lenderfriend-node.herokuapp.com/notification/fcm"

export enum LoanStatus {
    APPLYING = 0, APPLIED, APPROVED, REJECTED, LOANED
}

@Injectable()
export class UserService implements Resolve<any> {

    coreUsers: any[];
    onUsersChanged: BehaviorSubject<any> = new BehaviorSubject({});

    constructor( private afs: AngularFirestore, private http: HttpClient ) {
        
    }

    /**
     * Resolve
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return this.getCoreUsers();
    }

    getCoreUsers(): Promise<any> {
        return new Promise((resolve, reject) => {
          this.afs.collection('coreUsers').snapshotChanges().map(changes => {
            return changes.map(c => ({id: c.payload.doc.id, ...c.payload.doc.data()}));
          }).subscribe(users => {
            this.coreUsers = users;
            this.onUsersChanged.next(this.coreUsers);
            resolve(users);
          }, reject);
        });
    }

    deleteUser(user: any) {
        return this.afs.doc(`coreUsers/${user.id}`).delete();
    }

    approveApplication(userId) {
        this.updateLoanStatus(userId, LoanStatus.APPROVED)
    }

    rejectApplication(userId) {
        this.updateLoanStatus(userId, LoanStatus.REJECTED)
    }

    updateLoanStatus(userId, status){
        this.afs.doc(`coreUsers/${userId}`).update({
            loanStatus: status
        }).then(response => {
            this.sendNotification(userId, status)
        })
    }

    sendNotification(userId, status){
        firebase.database().ref('fcmTokens').child(userId).once('value', (snapshot) => {
            var token = snapshot.val()
            if (token) {
                var notification = {
                    title: 'Lender Friend',
                    body : '',
                    fcmToken: token,
                    sound: 'default' 
                }
                if (status == LoanStatus.APPROVED) {
                    notification.body = MSG_APPROVE
                } else if (status == LoanStatus.REJECTED){
                    notification.body = MSG_REJECT
                }

                var body = JSON.stringify(notification);
                
                $.ajax({
                    url: `${endPoint}`,
                    method: 'POST',
                    data: {data: body},
                    success: (Response) => {
                        console.log(Response)
                    }
                });
            } else {
                console.log('no token')
            }
        })
    }
}
