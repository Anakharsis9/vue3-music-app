import { ErrorMessage, Field as VeeField } from 'vee-validate';
import type { App } from 'vue';

export default {
  install(app: App<Element>) {
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);
  },
};
