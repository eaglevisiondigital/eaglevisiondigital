export type Product = 'website' | 'app' | 'website_app';
export type Industry = 'local_service' | 'church_ministry' | 'restaurant' | string;
export type ContentHandling = 'exact' | 'light_polish' | 'professional_rewrite';
export type CertificationStatus =
  | 'tested_approved'
  | 'tested_limited'
  | 'documented_unverified'
  | 'pilot_only'
  | 'external_custom'
  | 'proposed'
  | 'future';

export interface CapabilityRequest {
  capabilityId: string;
  needed: boolean;
  priority?: 'must_have' | 'nice_to_have' | 'future';
  notes?: string | null;
}

export interface ExpressQualification {
  website: 'eligible' | 'manual_review' | 'custom_scope' | 'not_applicable';
  app: 'eligible' | 'manual_review' | 'custom_scope' | 'not_applicable';
  reasons: string[];
  timingClockStartsAt?: string | null;
}

export interface GenerationBrief {
  submissionId: string;
  product: Product;
  industry: Industry;
  businessName: string;
  primaryAction: string;
  pagePlan: string[];
  capabilityPlan: CapabilityRequest[];
  contentPolicy: Record<string, unknown>;
  brand: Record<string, unknown>;
  media: unknown[];
  integrations: unknown[];
  app?: Record<string, unknown> | null;
  expressQualification: ExpressQualification;
  reviewFlags: string[];
}
