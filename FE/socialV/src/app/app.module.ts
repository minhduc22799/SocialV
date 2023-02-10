import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './Registration/registration.component';
import { LoginComponent } from './Login/login.component';
import { NewfeedComponent } from './Newfeed/newfeed.component';
import { PostModalComponent } from './Post-Modal/post-modal.component';
import { ProfileComponent } from './Profile/profile.component';
import { FriendProfileComponent } from './Friend-Profile/friend-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    NewfeedComponent,
    PostModalComponent,
    ProfileComponent,
    FriendProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
