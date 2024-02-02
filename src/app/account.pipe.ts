import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'getFirstCharacter' })
export class MoWbSitesListReportSidebarPipe implements PipeTransform {
   transform(string: string) {
    return string.slice(0,1).normalize("NFD").replace(/[\u0300-\u036f]/g, '').charAt(0).toUpperCase();;
   }
}

@Pipe({ name: 'getRandomColor' })
export class MoWbSitesListReportSidebar2Pipe implements PipeTransform {
   transform(string: string) {
      const arrayColor = ["#226FF5", "#E62222", "#F97316", "#FFB700", "#84CC16", "#00BC32", "#06B6D4", "#0EA5E9", "#6366F1", "#5B04B3", "#D946EF", "#EC4899", "#F43F5E", "#757380", "#202020"]
      return getRandomElement(arrayColor);
   }
}

@Pipe({ name: 'convertTimeUTC' })
export class MoWbSitesListReportSidebar3Pipe implements PipeTransform {
   transform(time: string) {
    const timeStamp = new Date(time);
    return timeStamp.getTime();
   }
}

@Pipe({ name: 'convertSize' })
export class MoWbSitesListReportSidebar4Pipe implements PipeTransform {
   transform(size: number) {
    const kb = Math.round(size / 1024);
    if(kb < 1024){
      return kb+ ' KB';
    }
    return (kb / 1024).toFixed(2) + ' MB';
   }
}

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Pipe({ name: 'convertImage' })
export class MoWbSitesListReportSidebar5Pipe implements PipeTransform {
  url = '';
  transform(mimetype: string) {
    switch (mimetype){
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        this.url = './assets/images/upload-file/excel.png';
        break;
      case 'text/plain':
        this.url = './assets/images/upload-file/excel.png';
        break;
      case 'application/x-zip-compressed':
        this.url = './assets/images/upload-file/excel.png';
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        this.url = './assets/images/upload-file/word.png';
        break;
      default:
        this.url = './assets/images/upload-file/file.png';
        break;
    }
    return this.url;
  }
}

function getRandomElement(array: Array<any>) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

@NgModule({
  imports: [CommonModule],
  declarations: [
    MoWbSitesListReportSidebarPipe,
    MoWbSitesListReportSidebar2Pipe,
    MoWbSitesListReportSidebar3Pipe,
    MoWbSitesListReportSidebar4Pipe,
    MoWbSitesListReportSidebar5Pipe,
    SafePipe
  ],
  exports: [
    MoWbSitesListReportSidebarPipe,
    MoWbSitesListReportSidebar2Pipe,
    MoWbSitesListReportSidebar3Pipe,
    MoWbSitesListReportSidebar4Pipe,
    MoWbSitesListReportSidebar5Pipe,
    SafePipe
  ]
})

export class FileManagerSettingsAccountPipeModule { }
