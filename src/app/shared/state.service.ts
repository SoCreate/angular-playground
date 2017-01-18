import { SelectedSandboxAndScenarioKeys } from './app-state';

export class StateService {
  filter;
  selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys;

  constructor() {
    this.filter = sessionStorage.getItem('angularPlayground.filter');
    this.selectedSandboxAndScenarioKeys = {
      sandboxKey: sessionStorage.getItem('angularPlayground.sandboxKey'),
      scenarioKey: sessionStorage.getItem('angularPlayground.scenarioKey')
    };

    const beforeUnload = () => {
      this.saveState();
      return 'unload';
    };
    window.addEventListener('beforeunload', beforeUnload);
  }

  getFilter() {
    return this.filter;
  }

  setFilter(value) {
    this.filter = value;
  }

  getSelectedSandboxAndScenarioKeys() {
    return this.selectedSandboxAndScenarioKeys;
  }

  setSandboxAndScenarioKeys(value: SelectedSandboxAndScenarioKeys) {
    this.selectedSandboxAndScenarioKeys = value;
  }

  saveState() {
    sessionStorage.setItem('angularPlayground.filter', emptyStringIfNull(this.filter));
    sessionStorage.setItem('angularPlayground.sandboxKey', emptyStringIfNull(this.selectedSandboxAndScenarioKeys.sandboxKey));
    sessionStorage.setItem('angularPlayground.scenarioKey', emptyStringIfNull(this.selectedSandboxAndScenarioKeys.scenarioKey));
  }
}

function emptyStringIfNull(value) {
  return value ? value : '';
}
