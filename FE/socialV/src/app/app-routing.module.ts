import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegistrationComponent} from "./Registration/registration.component";
import {LoginComponent} from "./Login/login.component";
import {NewFeedComponent} from "./NewFeed/new-feed.component";
import {ProfileComponent} from "./Profile/profile.component";
import {EditProfileComponent} from "./edit-profile/edit-profile.component";
import {FriendProfileComponent} from "./Friend-Profile/friend-profile.component";
import {PostDetailComponent} from "./post-detail/post-detail.component";

const routes: Routes = [
  {
    path: 'Registration', component: RegistrationComponent
  },
  {
    path: '', component: LoginComponent
  },
  {
    path: 'NewFeed', component: NewFeedComponent
  },
  {
    path: 'Profile', component: ProfileComponent
  },
  {
    path: 'EditProfile', component: EditProfileComponent
  },
  {
    path: 'friendProfile/:id', component: FriendProfileComponent
  },
  {
    path: 'postDetail/:id', component: PostDetailComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
