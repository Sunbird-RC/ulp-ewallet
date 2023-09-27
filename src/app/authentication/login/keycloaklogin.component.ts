import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, RouterStateSnapshot } from '@angular/router';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakLoginOptions } from 'keycloak-js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data/data-request.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';
import { AppConfig } from '../../app.config';
import { AuthConfigService } from '../auth-config.service';

dayjs.extend(customParseFormat);

@Component({
  selector: 'app-keycloaklogin',
  templateUrl: './keycloaklogin.component.html',
  styleUrls: ['./keycloaklogin.component.css']
})
export class KeycloakloginComponent implements OnInit {
  user: any;
  entity: string;
  profileUrl: string = '';
  isDigilockerUser = false;
  digiLockerUser: any;
  constructor(
    public keycloakService: KeycloakService,
    public router: Router,
    private config: AppConfig,
    private readonly generalService: GeneralService,
    private readonly dataService: DataService,
    private readonly authConfigService: AuthConfigService,
    private readonly toastMessage: ToastMessageService
  ) { }

  async ngOnInit() {
    const isLoggedIn = await this.keycloakService.isLoggedIn();
    if (isLoggedIn) {
      const accountRes: any = await this.keycloakService.loadUserProfile();
      console.log("accountRes", accountRes);
      if (accountRes?.attributes?.entity?.[0]) {
        console.log(accountRes['attributes'].entity[0]);
        this.entity = accountRes.attributes.entity[0];
      }
      if (accountRes?.attributes?.locale?.length) {
        localStorage.setItem('ELOCKER_LANGUAGE', accountRes['attributes'].locale[0]);
      }
      if (accountRes?.attributes?.name?.length) {
        this.isDigilockerUser = true;
        localStorage.setItem('isDigilockerUser', 'true');
        localStorage.setItem('currentUser', JSON.stringify({ name: accountRes.attributes.name[0] }));
        this.digiLockerUser = {
          name: accountRes.attributes.name[0],
          dob: dayjs(accountRes.attributes.dob[0], 'DD/MM/YYYY').format('DD/MM/YYYY'),
          gender: accountRes.attributes.gender[0]
        }

        if (!accountRes?.attributes?.phone_number) {
          this.toastMessage.error('', this.generalService.translateString('UNABLE_TO_FETCH_PHONE_NUMBER_FROM_MERI_PEHCHAAN'));
          this.router.navigate(['/logout']);
          return;
        }
      }

      this.user = this.keycloakService.getUsername();
      const token = await this.keycloakService.getToken();
      console.log('keyCloak teacher token - ', token);
      localStorage.setItem('token', token);
      localStorage.setItem('loggedInUser', this.user);
      console.log('---------', this.config.getEnv('appType'))

      if (this.isDigilockerUser) {
        const payload = {
          url: `${this.authConfigService.config.bffUrl}/v1/learner/digi/getdetail`,
          data: this.digiLockerUser,
          header: new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
          })
        }
        this.dataService.post(payload).subscribe((res: any) => {
          console.log(res);
          if (res.result) {
            localStorage.setItem('currentUser', JSON.stringify(res.result));
          }

          if (!res.result?.kyc_aadhaar_token) { // Check if Aadhaar KYC is completed or not
            this.router.navigate(['/aadhaar-kyc']);
          } else {
            this.router.navigate(['/home']);
          }
        }, error => {
          if (error?.error?.success === false) {
            this.router.navigate(['/register'], {
              queryParams: {
                ...this.digiLockerUser,
                username: accountRes.attributes.phone_number[0]
              }
            })
          } else {
            this.router.navigate(['/logout']);
          }
        });
      } else {
        localStorage.setItem('isDigilockerUser', 'false');
        this.getDetails().subscribe((res: any) => {
          const navigationExtras: NavigationExtras = {
            state: {
              name: res.result?.name,
              dob: res.result?.dob,
              gender: res.result?.gender,
            }
          }

          if (!res?.result?.kyc_aadhaar_token) { // Aadhar KYC is pending
            this.router.navigate(['/aadhaar-kyc'], navigationExtras);
          } else if (res?.result?.aadhaar_token && res?.result?.kyc_aadhaar_token !== res?.result?.aadhaar_token) { // Institute given Aadhaar and Aadhaar KYC not matched
            navigationExtras.state.aadhaarMatchError = true;
            this.router.navigate(['/aadhaar-kyc'], navigationExtras); // re-kyc
          } else {
            this.router.navigate(['/home']);
          }
        }, (err) => {
          // this.router.navigate(['/home']);
          console.log(err);
          this.router.navigate(['/logout']);
        });
      }
    } else {
      const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
      this.keycloakService
        .getKeycloakInstance()
        .login(<KeycloakLoginOptions>{
          locale: localStorage.getItem('setLanguage'),
          redirectUri: window.location.origin + snapshot.url
        })
        .then((res) => {
          console.log({ res });
        });
    }
  }

  getDetails(): Observable<any> {
    let headerOptions = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')
    });
    return this.dataService.get({ url: `${this.authConfigService.config.bffUrl}/v1/learner/getdetail`, header: headerOptions }).pipe(map((res: any) => {
      console.log(res);

      localStorage.setItem('currentUser', JSON.stringify(res.result));
      return res;
    }));
  }
}
