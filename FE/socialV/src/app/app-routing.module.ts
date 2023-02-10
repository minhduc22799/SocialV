import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegistrationComponent} from "./Registration/registration.component";
import {LoginComponent} from "./Login/login.component";
import {NewfeedComponent} from "./Newfeed/newfeed.component";

const routes: Routes = [
  {
    path: 'Registration', component: RegistrationComponent
  },
  {
    path: 'Login', component: LoginComponent
  },
  {
    path: 'NewFeed', component: NewfeedComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
