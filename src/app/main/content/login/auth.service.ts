import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  
  constructor( private afAuth: AngularFireAuth, private afs: AngularFirestore ) { }

  /**
   * firebase auth state
   */
  get authState() {
    return this.afAuth.authState;
  }

  /**
   * firebase current user
   */
  get currentUser() {
    return this.afAuth.auth.currentUser;
  }

  /** 
   * Googleplus Authentication
  */
  signInWithGoogleplus(): Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  /**
   * Email Authentication
   * 
   * @param email 
   * @param password 
   */
  signInWithEmailAndPassword(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  get hasPermission(): Observable<boolean> {
    return this.authState.switchMap(auth => {
      if (!auth) {
        return Observable.of(false);
      }
      
      // return Observable.of(!!auth);
      return this.afs.doc(`Admin/${auth.uid}`).valueChanges().map(res => !!res);
    });
  }

  /**
   * Sign out
   */
  signOut(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

}
