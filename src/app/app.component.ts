import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import QRCode from 'qrcode';
import { ReasonAr, ReasonEn, ReasonFr } from './shared/static/reasons';
import { PdfUtil } from './shared/utils/pdf-util';

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


  constructor(public translate: TranslateService,
    private readonly _formBuilder: FormBuilder) {
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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthday: ['', Validators.required],
      birthplace: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      reasonList: this._formBuilder.array(this.reasons.map(item => !item)),
      exitDate: [new Date().toISOString().substring(0, 10), Validators.required],
      exitTime: [new Date().toTimeString().substring(0, 5), Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get formControls() { return this.form.controls; }

  /**
   * Submit the form values
   */
  public async onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      // this.signatureImage = '';
      // return;
    }

    this.submitted = false;
    // this.form.reset();
    const qrCode = await this.generateQR(this.form.value);
    PdfUtil.generatePdf(this.form.value, this.reasons, this.signatureImage, qrCode);

  }

  /**
   * Generate the QR Code with the given information
   * @param profile
   */
  async generateQR(profile) {
    const creationDate = new Date().toLocaleDateString('fr-FR');
    const creationHour = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
    const data = [
      `Cree le: ${creationDate} a ${creationHour}`,
      `Je soussigné(e),`,
      `Mme/M.: ${profile.firstName} ${profile.lastName}`,
      `Né(e) le: ${profile.birthday}`,
      `À ${profile.birthplace} `,
      `Demeurant: ${profile.address} ${profile.zip} ${profile.city}`,
      `Motifs: ${profile.reasonList}`,
      `Fait à: ${profile.city}`,
      `Le: ${profile.exitDate} à ${profile.exitTime}h`,
    ];

    try {
      const opts = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
      };
      return await QRCode.toDataURL(data, opts);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Set the sugnature
   * @param data
   */
  public setSignature(data) {
    this.signatureImage = data;
  }

}
