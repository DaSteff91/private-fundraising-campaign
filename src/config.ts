export const PAYEE = {
  name: __PAYEE_NAME__,
  iban: __PAYEE_IBAN__,
  bic: __PAYEE_BIC__,
} as const;

export const OPERATOR = {
  name: __OPERATOR_NAME__,
  street: __OPERATOR_STREET__,
  zip: __OPERATOR_ZIP__,
  city: __OPERATOR_CITY__,
  email: __OPERATOR_EMAIL__,
} as const;

export const WISE_REQUEST_URL = __WISE_REQUEST_URL__;
export const PAYPAL_ME_HANDLE = __PAYPAL_ME_HANDLE__;
export const SITE_URL = __SITE_URL__;
export const POCKETBASE_URL = __POCKETBASE_URL__;
export const CAMPAIGN_NAME = __CAMPAIGN_NAME__;
export const CAMPAIGN_REMITTANCE = __CAMPAIGN_REMITTANCE__;

export const AMOUNT_PRESETS = [10, 25, 50] as const;
/** Fallback close date when PocketBase settings are unavailable. */
export const CLOSE_DATE_ISO = "2026-12-31";
