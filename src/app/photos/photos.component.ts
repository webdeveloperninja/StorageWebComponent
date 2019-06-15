import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Subject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { PhotoCropperComponent } from '../photo-cropper/photo-cropper.component';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {
  @Input() containerName: string;
  @Input() contentType: string;
  @Output() dataSaved = new EventEmitter<string>();

  refresh$ = new Subject();

  images$ = merge(this.refresh$, this.route.queryParams).pipe(
    map(_ => {
      const params = this.route.snapshot.queryParams;
      const images = !!params['images'] ? JSON.parse(params['images']) : [];

      return images;
    })
  );

  fileToUpload;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  dialogRef: MatDialogRef<PhotoCropperComponent>;
  constructor(
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly mediaObserver: MediaObserver
  ) {}

  imageColumns$ = this.mediaObserver.media$.pipe(map(m => (m.mqAlias === 'sm' || m.mqAlias === 'xs' ? 1 : 3)));

  ngOnInit() {}

  fileUploadEvent(image) {
    this.fileToUpload = image;
    this.dialogRef = this.dialog.open(PhotoCropperComponent, {
      data: { image, containerName: this.containerName, contentType: this.contentType }
    });

    this.dialogRef.componentInstance.imagesChange.pipe(first()).subscribe(d => {
      this.dataSaved.next(d[0]);
      this.dialogRef.close();
    });
  }

  deleteImage(imageToDelete: string) {
    const images: string[] = (!!this.route.snapshot.queryParamMap.get('images')
      ? JSON.parse(this.route.snapshot.queryParamMap.get('images'))
      : []
    ).filter(image => image !== imageToDelete);

    this.router.navigate(['.'], {
      queryParams: {
        images: JSON.stringify(images)
      },
      queryParamsHandling: 'merge'
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
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
