import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthService } from '../services/auth.service';
import { EmployeeService } from '../services/employee.service';
import { GraphQLService } from './services/graphql.service';
import { UtilService } from './services/util.service';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { AuthGuard } from '../guards/auth.guard';

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: 'http://localhost:4000/graphql' }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ApolloModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthService,
    EmployeeService,
    GraphQLService,
    UtilService,
    AuthGuard
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
} 