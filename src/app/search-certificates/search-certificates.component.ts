import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { CredentialService } from '../services/credential/credential.service';
import {
  IImpressionEventInput,
  IInteractEventInput,
} from '../services/telemetry/telemetry-interface';
import { TelemetryService } from '../services/telemetry/telemetry.service';

@Component({
  selector: 'app-search-certificates',
  templateUrl: './search-certificates.component.html',
  styleUrls: ['./search-certificates.component.scss'],
})
export class SearchCertificatesComponent implements OnInit {
  credentials$: Observable<any>;
  searchKey: string = '';
  schema: any;

  credentialList = [];

  @Input() credentials: any;
  @Input() category: string;
  @Output() back = new EventEmitter();
  constructor(
    private readonly credentialService: CredentialService,
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly telemetryService: TelemetryService
  ) {
    // const navigation = this.router.getCurrentNavigation();
    // this.schema = navigation.extras.state;
  }

  ngOnInit(): void {
    this.fetchCredentials();
  }

  fetchCredentials() {
    // this.credentials$ = this.credentialService.getAllCredentials().pipe(
    //   map((res: any) => {
    //     if (this.schema?.name) {
    //       return res.filter(
    //         (item: any) => item.credential_schema.name === this.schema.name
    //       );
    //     }
    //     return res;
    //   }),
    //   catchError((error) => of([]))
    // );

    // if (this.category) {
    //   this.credentials$ = of(this.credentials.map((item: any) => item.credential_schema.name === this.category));
    // }
    // else {
    //   this.credentials$ = of(this.credentials);
    // }

    const list = this.category ? this.credentials.filter((item: any) => item.credential_schema.name === this.category) : this.credentials;
    console.log("list", list);
    this.credentialList = list.map((item: any) => {
      const placeholderList = item.credential_schema.schema.description.match(/(?<=<).*?(?=>)/g) || [];
      let details = {};
      placeholderList.map((ph: any) => {
        if (item?.credentialSubject?.[ph]) {
          details = { ...details, [ph]: item.credentialSubject[ph] };
        }
      });

      item.credential_schema.schema.description = item.credential_schema.schema.description.replace(/\<(.*?)\>/g, function (placeholder, capturedText, matchingIndex, inputString) {
        // console.log(placeholder + " - " + capturedText + " - " + matchingIndex);
        return details[placeholder.substring(1, placeholder.length - 1)] || item.credential_schema.schema.description;
      });
      return item;
    });

    this.credentialService.credentialList = [...this.credentialList];
    this.credentialService.selectedCategory = this.category;
    console.log("v", this.credentialList);
  }

  renderCertificate(credential: any) {
    const navigationExtras: NavigationExtras = {
      state: credential,
    };
    this.router.navigate(['/doc-view'], navigationExtras);
  }

  ngAfterViewInit(): void {
    this.raiseImpressionEvent();
  }

  goBack() {
    this.credentialService.selectedCategory = '';
    this.credentialService.credentialList = [];
    this.back.emit();
  }

  raiseInteractEvent(id: string, type: string = 'CLICK', subtype?: string) {
    const telemetryInteract: IInteractEventInput = {
      context: {
        env: this.activatedRoute.snapshot?.data?.telemetry?.env,
        cdata: [],
      },
      edata: {
        id,
        type,
        subtype,
        pageid: this.activatedRoute.snapshot?.data?.telemetry?.pageid,
      },
    };
    this.telemetryService.interact(telemetryInteract);
  }

  raiseImpressionEvent() {
    const telemetryImpression: IImpressionEventInput = {
      context: {
        env: this.activatedRoute.snapshot?.data?.telemetry?.env,
        cdata: [],
      },
      edata: {
        type: this.activatedRoute.snapshot?.data?.telemetry?.type,
        pageid: this.activatedRoute.snapshot?.data?.telemetry?.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot?.data?.telemetry?.subtype,
      },
    };
    this.telemetryService.impression(telemetryImpression);
  }
}
