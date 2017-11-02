export class QuestionBase {
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  type: string;
  options: {};

  constructor(options: {
      key?: string,
      label?: string,
      required?: boolean,
      order?: number,
      controlType?: string,
      type?: string,
      options?: {}
    } = {}) {
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || 'text';
    this.type = options.type || 'text';
    this.options = options.options || {};
  }
}
