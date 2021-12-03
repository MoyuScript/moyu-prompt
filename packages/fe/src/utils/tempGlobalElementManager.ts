import { HTMLAttributes } from 'react';
import { merge } from 'lodash';

export default class TempGlobalElementManager {
  private el: HTMLDivElement;

  constructor(attrs: HTMLAttributes<HTMLDivElement> = {}) {
    this.el = document.createElement('div');

    merge(this.el.attributes, attrs);
  }

  init(): void {
    const body = document.body;

    if (body.contains(this.el)) {
      return;
    }

    body.appendChild(this.el);
  }

  destroy(): void {
    const body = document.body;

    if (!body.contains(this.el)) {
      return;
    }

    body.removeChild(this.el);
  }

  getElement(): HTMLDivElement {
    return this.el;
  }
}
