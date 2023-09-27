import { Injectable } from '@angular/core';
import { forkJoin, from, Observable, of } from 'rxjs';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DataService } from '../data/data-request.service';
import { AuthConfigService } from 'src/app/authentication/auth-config.service';


@Injectable({
  providedIn: 'root'
})
export class CredentialService {
  baseUrl: string;
  private schemas: any[] = [];
  private schemaIds = {};
  selectedCategory: string = '';
  credentialList = [];

  constructor(
    private readonly dataService: DataService,
    private readonly authService: AuthService,
    private readonly authConfigService: AuthConfigService
  ) {
    // this.baseUrl = environment.baseUrl;
    this.baseUrl = this.authConfigService.config.bffUrl;
  }

  private findSchema(schemaId: string) {
    if (this.schemas.length) {
      return this.schemas.find((schema: any) => schema.id === schemaId);
    }
    return false;
  }

  private findSchemaId(credentialId: string) {
    if (Object.keys(this.schemaIds).length && this.schemaIds[credentialId]) {
      return this.schemaIds[credentialId];
    }
    return false;
  }

  getCredentialSchemaId(credentialId: string): Observable<any> {
    const schemaId = this.findSchemaId(credentialId);
    if (schemaId) {
      return of({ credential_schema: schemaId });
    }

    const payload = { url: `${this.baseUrl}/v1/credentials/schema/${credentialId}` };
    return this.dataService.get(payload).pipe(map((res: any) => {
      const schemaId = this.findSchemaId(res.result?.credential_schema);
      if (!schemaId) {
        this.schemaIds[credentialId] = res.result?.credential_schema;
      }
      return res.result;
    }));
  }

  getCredentials(): Observable<any> {
    const payload = {
      url: `${this.baseUrl}/v1/credentials/search`,
      data: {
        subject: { id: this.authService.currentUser?.did }
      }
    };

    return this.dataService.post(payload).pipe(map((res: any) => res.result));
  }

  getSchema(schemaId: string): Observable<any> {
    const schema = this.findSchema(schemaId);
    console.log("saved schemas", this.schemas);
    if (schema) {
      return of(schema);
    }

    const payload = { url: `${this.baseUrl}/v1/credentials/schema/json/${schemaId}` };
    return this.dataService.get(payload).pipe(map((res: any) => {
      if (Array.isArray(res.result)) {
        res.result = res.result[0];
      }
      const schema = this.findSchema(res.result.id);
      if (!schema) {
        this.schemas.push(res.result);
      }
      return res.result;
    }));
  }

  getAllCredentials(): Observable<any> {
    return this.getCredentials().pipe(
      // switchMap((credentials: any) => {
      //   if (credentials.length) {
      //     return forkJoin(
      //       credentials.map((cred: any) => {
      //         return this.getCredentialSchemaId(cred.id).pipe(
      //           concatMap((res: any) => {
      //             console.log("res", res);
      //             cred.schemaId = res.credential_schema;
      //             return of(cred);
      //           })
      //         );
      //       })
      //     );
      //   }
      //   return of([]);
      // }), 
      switchMap((res: any) => {
        console.log("res", res);
        const schemaIds = [...new Set(res.map((item: any) => item.credentialSchemaId))];
        return from(schemaIds).pipe(
          switchMap((schemaId: any) => {
            return this.getSchema(schemaId);
          }), switchMap((schema: any) => {
            return of(res);
          })
        );
        // return of(res);
      }),
      switchMap((creds: any) => {
        if (creds.length) {
          return forkJoin(creds.map((cred: any) => {
            return this.getSchema(cred.schemaId).pipe(
              map((schema: any) => {
                cred.credential_schema = { ...schema };
                return cred;
              })
            );
          }))
        }
        return of([]);
      })
    );
  }

  /**
   * Get Credential by credential Id
   * @param credentialId 
   * @returns 
   */
  getCredentialById(credentialId: string): Observable<any> {
    const payload = { url: `${this.baseUrl}/v1/credentials/get/${credentialId}` };
    return this.dataService.get(payload);
  }

  /**
   * Retrieves the list of schemas from the server.
   * @return {Observable<any>} An observable that emits the list of schemas.
   */
  getSchemaList(): Observable<any> {
    const payload = {
      url: `${this.baseUrl}/v1/credential/schema/list`,
      data: {
        taglist: "q2ulp" //TODO: need to remove this hard coded tag //ulpq2 tag1 q2ulp
      }
    }
    return this.dataService.post(payload).pipe(map((res: any) => res.result));
  }

  /**
   * Retrieves the schema fields for a given schema ID.
   *
   * @param {string} schemaId - The ID of the schema.
   * @return {Observable<any>} An observable that emits the schema fields.
   */
  getSchemaFields(schemaId: string): Observable<any> {
    const payload = {
      url: `${this.baseUrl}/v1/credential/schema/fields`,
      data: {
        schema_id: schemaId
      }
    }
    return this.dataService.post(payload).pipe(map((res: any) => res.result));
  }



}
