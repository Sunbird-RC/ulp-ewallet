import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, InjectionToken } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { APP_INITIALIZER } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { DeviceDetectorModule } from 'ngx-device-detector';
// formly
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { ArrayTypeComponent } from '../app/forms/types/array.type';
import { ObjectTypeComponent } from '../app/forms/types/object.type';
import { MultiSchemaTypeComponent } from '../app/forms/types/multischema.type';
import { NullTypeComponent } from '../app/forms/types/null.type';
import { AutocompleteTypeComponent } from '../app/forms/types/autocomplete.type';
import { FormlyColorInput } from '../app/forms/types/color.type';
import { initializeKeycloak } from './utility/app.init';
import { initLang } from './multilingual.init';


//Local imports
import { FormsComponent } from './forms/forms.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { ModalRouterEditLinkDirective } from '../app/layouts/modal/modal.directive';
import { ModalRouterAddLinkDirective } from '../app/layouts/modal/modal.directive';
import { PanelsComponent } from './layouts/modal/panels/panels.component';
import { EditPanelComponent } from './layouts/modal/panels/edit-panel/edit-panel.component';
import { AddPanelComponent } from './layouts/modal/panels/add-panel/add-panel.component';
import { TablesComponent } from './tables/tables.component';
import { HeaderComponent } from './header/header.component';
import { FormlyFieldFile } from './forms/types/file.type';
import { FileValueAccessor } from './forms/types/file-value-accessor';
import { DocViewComponent } from './layouts/doc-view/doc-view.component';
import { FormlyFieldNgSelect } from './forms/types/multiselect.type';
import { Bootstrap4FrameworkModule } from 'angular6-json-schema-form';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AttestationComponent } from './tables/attestation/attestation.component';
import { InstallComponent } from './install/install.component';
import { HomeComponent } from './home/home.component';
import { FormlyHorizontalWrapper } from './forms/types/horizontal.wrapper';
import { AppConfig } from './app.config';
import { PanelWrapperComponent } from './forms/types/group.type';
import { LogoutComponent } from './authentication/logout/logout.component';
import { SearchComponent } from '../app/discovery/search/search.component';
import { AuthConfigService } from './authentication/auth-config.service';
import { DocumentsComponent } from './documents/documents.component';
import { AddDocumentComponent } from './documents/add-document/add-document.component';
import { WebcamModule } from 'ngx-webcam';
import { ScanDocumentComponent } from './documents/scan-document/scan-document.component';
import { ScanQrCodeComponent } from './documents/scan-qr-code/scan-qr-code.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QuarModule } from '@altack/quar';
import { BrowseDocumentsComponent } from './documents/browse-documents/browse-documents.component';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { config } from 'process';
import { ColorPickerModule } from 'ngx-color-picker';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';


//form validations
export function minItemsValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT have fewer than ${field.templateOptions.minItems} items`;
}

export function maxItemsValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT have more than ${field.templateOptions.maxItems} items`;
}

export function minlengthValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT be shorter than ${field.templateOptions.minLength} characters`;
}

export function maxlengthValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT be longer than ${field.templateOptions.maxLength} characters`;
}

export function minValidationMessage(err, field: FormlyFieldConfig) {
  return `should be >= ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field: FormlyFieldConfig) {
  return `should be <= ${field.templateOptions.max}`;
}

export function multipleOfValidationMessage(err, field: FormlyFieldConfig) {
  return `should be multiple of ${field.templateOptions.step}`;
}

export function exclusiveMinimumValidationMessage(err, field: FormlyFieldConfig) {
  return `should be > ${field.templateOptions.step}`;
}

export function exclusiveMaximumValidationMessage(err, field: FormlyFieldConfig) {
  return `should be < ${field.templateOptions.step}`;
}

export function constValidationMessage(err, field: FormlyFieldConfig) {
  return `should be equal to constant "${field.templateOptions.const}"`;
}


// Create custom Injection Token
const ConfigDeps = new InjectionToken<(() => Function)[]>('configDeps');

function initConfig(config: AppConfig) {
  return () => config.load().then((res) => { console.log(res) })
}

import ISO6391 from 'iso-639-1';
import { PagesComponent } from './pages/pages.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DocDetailViewComponent } from './documents/doc-detail-view/doc-detail-view.component';
import { FaqComponent } from './custom-components/faq/faq.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { CreateCertificateComponent } from './create-certificate/create-certificate.component';
import { OnBoardingComponent } from './on-boarding/on-boarding.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ManageEnrollmentConflictComponent } from './manage-enrollment-conflict/manage-enrollment-conflict.component';
import { SetUsernameComponent } from './set-username/set-username.component';
import { RegistrationComponent } from './registration/registration.component';
import { GlobalHeaderComponent } from './global-header/global-header.component';
import { AuthInterceptor } from './authentication/auth.interceptor';
import { SearchCertificatesComponent } from './search-certificates/search-certificates.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { OauthCallbackComponent } from './oauth-callback/oauth-callback.component';
import { FilterCertificatePipe } from './pipes/filter-certificate/filter-certificate.pipe';
import { EkycComponent } from './ekyc/ekyc.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MonthYearPickerComponent } from './month-year-picker/month-year-picker.component';
import { SettingsComponent } from './settings/settings.component';
import { RegisterComponent } from './register/register.component';
import { ReplacePlaceholderPipe } from './replace-placeholder.pipe';
import { OpportuntiesComponent } from './opportunties_dynamic/opportunties.component';
import { OpportunitieComponent } from './opportunitie/opportunitie.component';
import { configurationFactory } from './configuration.factory';
import { AadharKycComponent } from './aadhar-kyc/aadhar-kyc.component';
import { AadhaarKycStatusComponent } from './aadhaar-kyc-status/aadhaar-kyc-status.component';
import { AccountComponent } from './account/account.component';
import { WalletWorkerComponent } from './wallet-worker/wallet-worker.component';
import { WalletUiGetComponent } from './wallet-ui-get/wallet-ui-get.component';
import { RaiseClaimsComponent } from './raise-claims/raise-claims.component';
import { RequestCorrectionComponent } from './request-correction/request-correction.component';

@NgModule({
  declarations: [
    AppComponent,
    FormsComponent,
    SearchComponent,
    ArrayTypeComponent,
    ObjectTypeComponent,
    MultiSchemaTypeComponent,
    NullTypeComponent,
    LayoutsComponent,
    ModalRouterEditLinkDirective,
    ModalRouterAddLinkDirective,
    PanelsComponent, EditPanelComponent, AddPanelComponent, TablesComponent,
    AutocompleteTypeComponent,
    FormlyColorInput,
    HeaderComponent,
    AttestationComponent,
    FileValueAccessor,
    FormlyFieldFile,
    DocViewComponent,
    FormlyFieldNgSelect,
    InstallComponent,
    HomeComponent,
    LogoutComponent,
    DocumentsComponent,
    AddDocumentComponent,
    ScanDocumentComponent,
    ScanQrCodeComponent,
    BrowseDocumentsComponent,
    CreateCertificateComponent,
    FaqComponent,
    SafeHtmlPipe,
    PagesComponent,
    DocDetailViewComponent,
    OnBoardingComponent,
    LoginComponent,
    MenuComponent,
    ToolbarComponent,
    ManageEnrollmentConflictComponent,
    SetUsernameComponent,
    RegistrationComponent,
    GlobalHeaderComponent,
    SearchCertificatesComponent,
    ChangePasswordComponent,
    OauthCallbackComponent,
    FilterCertificatePipe,
    EkycComponent,
    PageNotFoundComponent,
    MonthYearPickerComponent,
    SettingsComponent,
    RegisterComponent,
    ReplacePlaceholderPipe,
    OpportuntiesComponent,
    OpportunitieComponent,
    AadharKycComponent,
    AadhaarKycStatusComponent,
    AccountComponent,
    WalletWorkerComponent,
    WalletUiGetComponent,
    RaiseClaimsComponent,
    RequestCorrectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    FormlyBootstrapModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    KeycloakAngularModule,
    Bootstrap4FrameworkModule,
    AngularMultiSelectModule,
    NgSelectModule,
    DeviceDetectorModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot(),
    WebcamModule,
    ColorPickerModule,
    QuarModule,
    ZXingScannerModule,
    NgxExtendedPdfViewerModule,
    FormlyModule.forRoot({
      extras: { resetFieldOnHide: true },
      wrappers: [{ name: 'form-field-horizontal', component: FormlyHorizontalWrapper },
      { name: 'panel', component: PanelWrapperComponent }],
      validationMessages: [
        { name: 'required', message: '' },

      ],
      types: [
        { name: 'string', extends: 'input' },
        {
          name: 'number',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number',
            },
          },
        },
        {
          name: 'integer',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number',
            },
          },
        },
        { name: 'boolean', extends: 'checkbox' },
        { name: 'enum', extends: 'select' },
        { name: 'null', component: NullTypeComponent, wrappers: ['form-field'] },
        { name: 'array', component: ArrayTypeComponent },
        { name: 'object', component: ObjectTypeComponent },
        { name: 'multischema', component: MultiSchemaTypeComponent },
        {
          name: 'autocomplete',
          component: AutocompleteTypeComponent
        },
        { name: 'file', component: FormlyFieldFile, wrappers: ['form-field'] },
        { name: 'multiselect', component: FormlyFieldNgSelect },
        { name: 'color', component: FormlyColorInput },
      ],
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-full-width',
      preventDuplicates: true,
    }),
    NgxPaginationModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  exports: [TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [],
  bootstrap: [AppComponent],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: configurationFactory,
      multi: true,
      // ConfigDeps is now a dependency for configurationFactory
      deps: [AppConfig, ConfigDeps]
    },
    {
      provide: ConfigDeps,
      // Use a factory that return an array of dependant functions to be executed
      useFactory: (
        http: HttpClient,
        config: AuthConfigService,
        keycloackService: KeycloakService,
        translateService: TranslateService
      ) => {
        // Easy to add or remove dependencies
        return [
          initializeKeycloak(keycloackService, config),
          initLang(http, translateService, config)
        ];
      },
      deps: [HttpClient, AuthConfigService, KeycloakService, TranslateService]
    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})


export class AppModule {
}
