import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateArticlePage } from './update-article.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateArticlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateArticlePageRoutingModule {}
