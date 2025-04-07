import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    Apollo,
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const authLink = setContext((_, { headers }) => {
          const token = localStorage.getItem('auth_token');
          return {
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : '',
            }
          };
        });

        const http = httpLink.create({
          uri: 'http://localhost:4000/graphql',
        });

        return {
          cache: new InMemoryCache({
            typePolicies: {
              Query: {
                fields: {
                  // Disable caching for all queries
                  employees: {
                    merge: false
                  },
                  employee: {
                    merge: false
                  }
                }
              }
            }
          }),
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'no-cache',
              errorPolicy: 'all'
            },
            query: {
              fetchPolicy: 'no-cache',
              errorPolicy: 'all'
            },
            mutate: {
              fetchPolicy: 'no-cache',
              errorPolicy: 'all'
            }
          },
          link: authLink.concat(http)
        };
      },
      deps: [HttpLink],
    }
  ]
};
