import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, DoBootstrap } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { PhotosComponent } from './photos/photos.component';
import { PhotoCropperComponent } from './photo-cropper/photo-cropper.component';
import { ThemeModule } from './theme.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes = [];

@NgModule({
  declarations: [PhotosComponent, PhotoCropperComponent],
  imports: [
    BrowserModule,
    ThemeModule,
    ImageCropperModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
  entryComponents: [PhotosComponent, PhotoCropperComponent]
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const element = createCustomElement(PhotosComponent, { injector: this.injector });

    customElements.define('blob-storage', element);
  }
}
