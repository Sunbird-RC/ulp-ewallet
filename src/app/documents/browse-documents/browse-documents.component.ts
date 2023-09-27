import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { first, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClaimGrievanceService } from 'src/app/services/claim-grievance.service';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { DataService } from 'src/app/services/data/data-request.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { IImpressionEventInput, IInteractEventInput } from 'src/app/services/telemetry/telemetry-interface';
import { TelemetryService } from 'src/app/services/telemetry/telemetry.service';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';

@Component({
  selector: 'app-browse-documents',
  templateUrl: './browse-documents.component.html',
  styleUrls: ['./browse-documents.component.scss']
})
export class BrowseDocumentsComponent implements OnInit, AfterViewInit {
  categories = [];
  isLoading = false;
  isClaimRejected = false;
  allCredentials: any;
  showCredCategories = false;
  showCredentialList = false;
  selectedCategory: string = '';
  showAadhaarKYC = false;
  showMenuList = true;
  claimStatus: string;

  constructor(
    private router: Router,
    public generalService: GeneralService,
    public authService: AuthService,
    private toastMessage: ToastMessageService,
    private activatedRoute: ActivatedRoute,
    private readonly modalService: NgbModal,
    private telemetryService: TelemetryService,
    private readonly credentialService: CredentialService,
    private readonly claimGrievanceService: ClaimGrievanceService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isKYCCompleted()) {
      this.showAadhaarKYC = true;
      this.router.navigate(['/aadhaar-kyc']);
      return;
    }
    if (this.credentialService.selectedCategory) {
      this.selectedCategory = this.credentialService.selectedCategory;
      // this.showCredentialList = true;
      this.allCredentials = [...this.credentialService.credentialList];
    } else {
      this.fetchCredentialCategories();
    }

    this.getClaimStatus();
  }

  getClaimStatus() {
    this.claimGrievanceService.getClaimStatus().subscribe((res: any) => {
      console.log("res", res);
      if (Array.isArray(res) && res.length) {
        this.claimStatus = res[0].claim_status;
      } else {
        this.claimStatus = res?.claim_status ? res.claim_status : '';
      }
    }, error => {
      console.error("error", error);
    });
  }

  fetchCredentialCategories() {
    if (this.authService?.currentUser?.did) {
      console.log("DID", this.authService.currentUser.did);
      this.isLoading = true;
      this.credentialService.getAllCredentials().pipe(
        first(),
        map((res: any) => {
          console.log("result", res);
          this.allCredentials = res;
          res.map((item: any) => {
            const schema = Array.isArray(item.credential_schema) && item.credential_schema.length ? item.credential_schema[0]?.schema : item.credential_schema?.schema;
            this.updateCategoryList(schema?.name, schema?.id);
          });
          console.log("this.categories", this.categories);
          return res;
        })).subscribe(res => {
          this.isLoading = false;
        }, error => {
          this.isLoading = false;
        });
    }
  }


  showCredentialTypes() {
    this.showMenuList = false;
    this.showCredCategories = true;
  }

  showCredentials(category) {
    this.selectedCategory = category?.name;
    this.showCredentialList = true;
    this.showCredCategories = false;
    this.raiseInteractEvent('credential-type-select')
    // const navigationExtras: NavigationExtras = {
    //   // state: category
    //   queryParams: {

    //   }
    // }
    this.router.navigate(['/search-certificates', category.id]);
  }

  updateCategoryList(name: string, id: string) {
    if (name) {
      const category = this.categories.find((item: any) => item.name === name);
      if (category) {
        category.count++;
      } else {
        let image: string = '';
        switch (name) {
          case 'Assessment Credentials':
            image = 'assets/images/academic.svg';
            break;
          case 'Enrollment Credentials':
            image = 'assets/images/enroll.svg';
            break;
          case 'Benefits Credentials':
            image = 'assets/images/benefit.svg';
            break;
          default:
            image = 'assets/images/enroll.svg';
        }

        this.categories.push({ name, count: 1, image, id: id });
      }
    }
  }

  onBack() {
    this.allCredentials = [];
    this.selectedCategory = '';
    this.categories = [];
    this.showCredentialList = false;
    this.fetchCredentialCategories();
  }

  ngAfterViewInit() {
    if (!this.authService.currentUser?.did) {
      // const options: NgbModalOptions = {
      //   // backdrop: 'static',
      //   animation: true,
      //   centered: true,
      // };
      // this.approvalModalRef = this.modalService.open(this.approvalModal, options);
      // this.isLoading = true;
      // this.authService.getUserProfile().subscribe((res) => {
      //   this.isClaimRejected = res.detail.claim_status === 'rejected';
      //   this.showApproval = res.detail.claim_status !== 'approved';
      //   this.isLoading = false;
      //   this.fetchCredentialCategories();
      // }, error => {
      //   this.showApproval = true;
      //   this.isLoading = false;
      // });
    }
    this.raiseImpressionEvent();
  }

  raiseImpressionEvent() {
    this.telemetryService.uid = this.authService.currentUser?.did || "anonymous";
    const telemetryImpression: IImpressionEventInput = {
      context: {
        env: this.activatedRoute.snapshot?.data?.telemetry?.env,
        cdata: []
      },
      edata: {
        type: this.activatedRoute.snapshot?.data?.telemetry?.type,
        pageid: this.activatedRoute.snapshot?.data?.telemetry?.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot?.data?.telemetry?.subtype,
        // duration: this.navigationhelperService.getPageLoadTime()
      }
    };
    this.telemetryService.impression(telemetryImpression);
  }

  raiseInteractEvent(id: string, type: string = 'CLICK', subtype?: string) {
    const telemetryInteract: IInteractEventInput = {
      context: {
        env: this.activatedRoute.snapshot?.data?.telemetry?.env,
        cdata: []
      },
      edata: {
        id,
        type,
        subtype,
        pageid: this.activatedRoute.snapshot?.data?.telemetry?.pageid,
      }
    };
    this.telemetryService.interact(telemetryInteract);
  }

}
