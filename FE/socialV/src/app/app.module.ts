import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './Registration/registration.component';
import { LoginComponent } from './Login/login.component';
import { NewFeedComponent } from './NewFeed/new-feed.component';
import { PostModalComponent } from './Post-Modal/post-modal.component';
import { ProfileComponent } from './Profile/profile.component';
import { FriendProfileComponent } from './Friend-Profile/friend-profile.component';
import {ReactiveFormsModule} from "@angular/forms";
import { HttpClientModule} from "@angular/common/http";
import {NgImageSliderModule} from "ng-image-slider";
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
// import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
  @NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    NewFeedComponent,
    PostModalComponent,
    ProfileComponent,
    FriendProfileComponent,
    EditProfileComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgImageSliderModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireStorageModule,
      AngularFireDatabaseModule,
        NgImageSliderModule,
        InfiniteScrollModule,
      // MatProgressSpinnerModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
