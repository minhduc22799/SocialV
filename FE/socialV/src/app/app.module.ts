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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HttpClientModule} from "@angular/common/http";
import {NgImageSliderModule} from "ng-image-slider";
import { EditProfileComponent } from './edit-profile/edit-profile.component';

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
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
