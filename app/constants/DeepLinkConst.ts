export const domain: string = 'aispec.page.link';

export const bundleId: string = 'com.simform.aispec';

export const deepLinkPrefixes = ['aispec://', `${domain}//`, `https://${domain}`];

export enum DeepLink {
  // aispec://magic_link&lang=en&tenantId=austin-electrical-qqm76
  MagicLink = 'magic_link',
  // aispec://forgot_password&lang=en&tenantId=austin-electrical-qqm76
  ForgotPassword = 'forgot_password',
  // aispec://?toastMessage=<message content>
  ToastMessage = 'toastMessage'
}

export default DeepLink;
