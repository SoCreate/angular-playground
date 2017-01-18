export { PlaygroundModule as AppModule } from 'angular-playground';
import { initializePlayground } from 'angular-playground';

export const environment = {
  production: false
};

initializePlayground('ng-app');
