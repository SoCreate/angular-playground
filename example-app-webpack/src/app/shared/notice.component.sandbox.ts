import { sandboxOf } from 'angular-playground';
import { CounterService } from './counter.service';
import { NoticeComponent } from './notice.component';

class MockCounterService {
  increment() {
    return 100;
  }
}

export default sandboxOf(NoticeComponent, {providers: [CounterService], })
  .add('short text', {
    template: '<ex-notice>Notification</ex-notice>'
  })
  .add('long text', {
    template: '<ex-notice>This is a really super long notice!</ex-notice>'
  })
  .add('with emoji', {
    template: '<ex-notice>👻</ex-notice>'
  })
  .add('with custom provider', {
    template: '<ex-notice>Notice one hundred</ex-notice>',
    providers: [{provide: CounterService, useClass: MockCounterService}]
  })
  .add('with inner html', {
    template: `<ex-notice><h1>A heading in a notice</h1></ex-notice>`
  });
