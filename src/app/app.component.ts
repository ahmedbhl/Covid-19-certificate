import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  public form: FormGroup;

  public submitted = false;

  public signatureImage;


  constructor(public translate: TranslateService, private readonly _formBuilder: FormBuilder) {
    this._initI18n();
    this._initFormGroupe();
  }

  /**
   * Init the list of languages and detect the browser lang
   */
  private _initI18n() {
    this.translate.addLangs(['tn', 'fr', 'us']);
    this.selectedCountryCode = this.translate.getBrowserLang() ? this.translate.getBrowserLang() : 'tn';
    this.translate.use(this.selectedCountryCode);
    this._initReasonList();
  }

  /**
   * Switch the language
   * @param lang
   */
  public switchLang(lang: string) {
    this.translate.use(lang);
    this.selectedCountryCode = lang;
    this._initReasonList();
  }

  /**
   * Init the reasons list by the selected Language
   */
  private _initReasonList() {
    switch (this.selectedCountryCode) {
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

  /**
   * init all the fields of the form Group and add the validation
   */
  private _initFormGroupe() {
    this.form = this._formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      birthday: [null, Validators.required],
      birthplace: [null, Validators.required],
      address: [null, Validators.required],
      city: [null, Validators.required],
      zip: [null, Validators.required],
      reasonList: this._formBuilder.array(this.reasons),
      exitDate: [null, Validators.required],
      exitTime: [null, Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get formControls() { return this.form.controls; }

  /**
   * Submit the form values
   */
  public onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      this.signatureImage = '';
      return;
    }

    this.submitted = false;
    // this.form.reset();

  }

  /**
   * Set the sugnature
   * @param data 
   */
  setSignature(data) {
    this.signatureImage = data;
  }

}
