import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SignaturePadModule } from '@ng-plus/signature-pad';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxFlagPickerModule } from 'ngx-flag-picker';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';


export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    FormsModule,
    BrowserModule,
    NgxQRCodeModule,
    HttpClientModule,
    SignaturePadModule,
    ReactiveFormsModule,
    NgxFlagPickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

