import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegistrationComponent} from "./Registration/registration.component";
import {LoginComponent} from "./Login/login.component";
import {NewFeedComponent} from "./NewFeed/new-feed.component";
import {ProfileComponent} from "./Profile/profile.component";

const routes: Routes = [
  {
    path: 'Registration', component: RegistrationComponent
  },
  {
    path: 'Login', component: LoginComponent
  },
  {
    path: 'NewFeed', component: NewFeedComponent
  },
  {
    path: 'Profile', component: ProfileComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
