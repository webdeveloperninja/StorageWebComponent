import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @Output() dataSaved = new EventEmitter<string>();

  @Input() containerName: string;
  @Input() contentType: string;
  title = 'azure-blob-storage';

  onDataSaved(data) {
    this.dataSaved.next(data);
  }
}
