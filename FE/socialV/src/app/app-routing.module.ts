import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegistrationComponent} from "./Registration/registration.component";
import {LoginComponent} from "./Login/login.component";
import {NewFeedComponent} from "./NewFeed/new-feed.component";
import {ProfileComponent} from "./Profile/profile.component";
import {EditProfileComponent} from "./edit-profile/edit-profile.component";
import {FriendProfileComponent} from "./Friend-Profile/friend-profile.component";
import {PostDetailComponent} from "./post-detail/post-detail.component";
import {AdminLoginComponent} from "./admin-login/admin-login.component";
import {AdminManagementComponent} from "./admin-management/admin-management.component";
import {SearchFriendComponent} from "./search-friend/search-friend.component";
import {PrivacySettingComponent} from "./privacy-setting/privacy-setting.component";
import {MessageComponent} from "./message/message.component";
import {ErrorComponent} from "./error/error.component";

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
    path: 'Admin', component: AdminLoginComponent
  },
  {
    path: 'AdminManagement', component: AdminManagementComponent
  },
  {
    path: 'SearchFriend', component: SearchFriendComponent
  },
  {
    path: 'postDetail/:id', component: PostDetailComponent
  },
  {
    path: 'privacy', component: PrivacySettingComponent
  },
  {
    path: 'message', component: MessageComponent
  },
  {
    path: 'error', component: ErrorComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
