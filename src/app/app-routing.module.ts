import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlaylistComponent} from "./components/playlist/playlist.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/playlist' },
  { path: 'playlist', component: PlaylistComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
