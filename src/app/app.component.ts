import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ReasonAr, ReasonEn, ReasonFr } from './shared/static/reasons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public reasons: string[];

  public selectedCountryCode;


  constructor(public translate: TranslateService) {
    this.initI18n();
  }

  /**
   * Init the list of languages and detect the browser lang
   */
  initI18n() {
    this.translate.addLangs(['tn', 'fr', 'us']);
    this.selectedCountryCode = this.translate.getBrowserLang() ? this.translate.getBrowserLang() : 'tn';
    this.translate.use(this.selectedCountryCode);
    this.initReasonList();
  }

  /**
   * Switch the language
   * @param lang
   */
  switchLang(lang: string) {
    this.translate.use(lang);
    this.selectedCountryCode = lang;
    this.initReasonList();
  }

  /**
   * Init the reasons list by the selected Language
   */
  initReasonList() {
    switch (this.translate.currentLang) {
      case 'tn':
        this.reasons = ReasonAr;
        break;
      case 'fr':
        this.reasons = ReasonFr;
        break;
      case 'us':
        this.reasons = ReasonEn;
        break;
      default:
        this.reasons = ReasonAr;
    }
  }
}
