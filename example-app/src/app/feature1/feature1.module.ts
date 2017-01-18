import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonBlockComponent } from './person-block.component';
import { RouterModule } from '@angular/router';
import { PersonDetailsComponent } from './person-details.component';
import { PersonBioComponent } from './person-bio.component';

const routes = [
  {
    path: ':viewperson',
    component: PersonBlockComponent,
    outlet: 'display'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    PersonBlockComponent,
    PersonDetailsComponent,
    PersonBioComponent
  ],
  exports: [
    RouterModule
  ]
})
export class Feature1Module {
}
