export interface Schema {
  /**
   * The name of the component.
   */
  name: string;

  /**
   * The path to create the sandbox.
   */
  path?: string;

  /**
   * Should the sandbox be created in the component's directory.
   */
  flat: boolean;
}
