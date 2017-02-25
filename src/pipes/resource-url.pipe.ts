import {Pipe, PipeTransform, OnDestroy} from "@angular/core";
import {SafeResourceUrl, DomSanitizer} from "@angular/platform-browser";
import {isString} from "util";

@Pipe({
  name: 'resourceUrl'
})
export class ResourceUrlPipe implements PipeTransform, OnDestroy {
  private blobUrls: string[] = [];

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: string|File): SafeResourceUrl {
    let url;
    if (isString(value)) {
      url = value as string;
    } else {
      url = URL.createObjectURL(value);
      this.blobUrls.push(url);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnDestroy(): void {
    this.blobUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
  }
}
