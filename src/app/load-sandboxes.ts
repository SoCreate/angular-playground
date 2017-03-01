import {Sandbox, Scenario} from './shared/app-state';

export function loadSandboxes() {
  let sandboxes = require('sandboxes').default;
  sandboxes = sandboxes.reduce((acc: Sandbox[], val: Sandbox) => {
    let existingSandbox = acc.find((i: Sandbox) => i.key.toLowerCase() === val.key.toLowerCase() && i.type === val.type);
    if (existingSandbox) {
      val.scenarios.forEach((scenario: Scenario) => {
        existingSandbox.scenarios.push(Object.assign({}, scenario, {key: existingSandbox.scenarios.length+1}));
      });
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
  return sandboxes;
}
