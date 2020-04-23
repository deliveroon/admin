import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateArticlePageRoutingModule } from './update-article-routing.module';

import { UpdateArticlePage } from './update-article.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateArticlePageRoutingModule
  ],
  declarations: [UpdateArticlePage]
})
export class UpdateArticlePageModule {}
