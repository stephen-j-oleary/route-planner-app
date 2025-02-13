export const CONSENT_RECORD_NAME = "cookie-consent";


type CategoryOptions = {
  /** Is the category enabled by default; Defaults to false */
  enabled?: boolean,
  /** Is the category checkbox readOnly; Defaults to false */
  readOnly?: boolean,
};

export const CATEGORIES: Record<string, CategoryOptions> = {
  necessary: { enabled: true, readOnly: true },
  analytics: {},
  ads: {},
};