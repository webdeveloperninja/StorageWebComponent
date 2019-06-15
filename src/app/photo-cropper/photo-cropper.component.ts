import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { empty } from 'rxjs';

export interface Data {
  image: string;
  name: string;
  // Todo make cropper dumb pull out logic for storing data
  containerName: string;
  contentType: string;
}

@Component({
  selector: 'app-photo-cropper',
  templateUrl: './photo-cropper.component.html',
  styleUrls: ['./photo-cropper.component.scss']
})
export class PhotoCropperComponent implements OnInit {
  @Input() containerName: string;

  isLoading = false;
  croppedImage: any;
  @Output() imagesChange = new EventEmitter<string[]>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private readonly _httpClient: HttpClient,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {}

  save() {
    this.isLoading = true;
    const Base64Data = this.croppedImage.base64.split(',')[1];
    // Todo pull from inputs
    this._httpClient
      .post('https://ninjawebstorage.azurewebsites.net/api/Storage?code=U0ijSLnySRppyW4j62PaaNRSTEaFMyoRbP7aH9YN0LaldI4QRDXzig==', {
        ContentType: this.data.contentType,
        ContainerName: this.data.containerName,
        Base64Data: Base64Data
      })
      .pipe(
        catchError(err => {
          console.log(err);
          return empty();
        })
      )
      .subscribe(response => {
        const existingImages = !!this._activatedRoute.snapshot.queryParamMap.get('images')
          ? JSON.parse(this._activatedRoute.snapshot.queryParamMap.get('images'))
          : [];

        const images: string[] = existingImages;
        images.push(response['resourceUri']);

        this._router.navigate(['.'], {
          queryParams: {
            images: JSON.stringify(images)
          },
          queryParamsHandling: 'merge'
        });

        this.imagesChange.emit([response['resourceUri']]);
        this.isLoading = false;
      });
  }

  imageCropped(event: any) {
    this.croppedImage = event;
  }

  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
