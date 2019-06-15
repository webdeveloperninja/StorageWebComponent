import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @Input() containerName: string;
  @Input() contentType: string;
  title = 'azure-blob-storage';
}
