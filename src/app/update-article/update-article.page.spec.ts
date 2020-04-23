import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateArticlePage } from './update-article.page';

describe('UpdateArticlePage', () => {
  let component: UpdateArticlePage;
  let fixture: ComponentFixture<UpdateArticlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateArticlePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateArticlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
