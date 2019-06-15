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

  fileToUpload;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  dialogRef: MatDialogRef<PhotoCropperComponent>;
  constructor(private readonly dialog: MatDialog, private readonly mediaObserver: MediaObserver) {}

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
