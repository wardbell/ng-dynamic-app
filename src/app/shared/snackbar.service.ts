import { Injectable } from '@angular/core';

/**
 * Provide feedback about an operation
 * A stupid substitute for Material Design snackbar
 * https://material.io/guidelines/components/snackbars-toasts.html
 */
@Injectable()
export class SnackbarService {

  /** Open a brief message about an operation */
  open (msg: string, action: string, options = { duration: 3000 }) {

    const el = document.createElement('div');
    el.setAttribute('style', 'position:absolute;top:40%;left:20%;background-color:white;');
    el.innerHTML = msg;

    setTimeout(() => el.parentNode.removeChild(el), options.duration);

    document.body.appendChild(el);
  }
}
