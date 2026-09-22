import type { ExpressQualification } from './types';

const customCapabilityTriggers = new Set([
  'true_sso',
  'advanced_custom_auth',
  'custom_native_sdk',
  'large_database_portal'
]);

const appUncertifiedMustHave = new Set([
  'online_ordering',
  'loyalty',
  'push_notifications',
  'member_only_content',
  'courses',
  'chat_messaging'
]);

export function qualifyExpress(intake: any): ExpressQualification {
  const reasons: string[] = [];
  const product = intake?.package?.product;
  let website: ExpressQualification['website'] = product === 'app' ? 'not_applicable' : 'eligible';
  let app: ExpressQualification['app'] = product === 'website' ? 'not_applicable' : 'eligible';

  if (!intake?.permissions?.contentRightsConfirmed) {
    if (website !== 'not_applicable') website = 'manual_review';
    if (app !== 'not_applicable') app = 'manual_review';
    reasons.push('Content/media rights are not fully confirmed.');
  }

  const selectedPages: string[] = intake?.pages?.selected ?? [];
  const paidPages: string[] = intake?.pages?.additionalPaidPages ?? [];
  if (selectedPages.length > 5 && paidPages.length === 0 && website !== 'not_applicable') {
    website = 'manual_review';
    reasons.push('Website page scope exceeds the standard five-page Express package without recorded add-on scope.');
  }

  const unverifiedClaims = (intake?.goals?.approvedProofPoints ?? []).filter((p: any) => p?.verified === false);
  if (unverifiedClaims.length && website !== 'not_applicable') {
    website = 'manual_review';
    reasons.push('One or more publishable proof/credential claims remain unverified.');
  }

  for (const capability of intake?.capabilities ?? []) {
    if (!capability?.needed) continue;
    if (customCapabilityTriggers.has(capability.capabilityId)) {
      if (website !== 'not_applicable') website = 'custom_scope';
      if (app !== 'not_applicable') app = 'custom_scope';
      reasons.push(`Capability ${capability.capabilityId} requires custom scope.`);
    }
    if (app !== 'not_applicable' && capability?.priority === 'must_have' && appUncertifiedMustHave.has(capability.capabilityId)) {
      app = app === 'custom_scope' ? app : 'manual_review';
      reasons.push(`Must-have app capability ${capability.capabilityId} requires implementation certification or preapproval.`);
    }
  }

  const integrations = intake?.integrations ?? [];
  if (integrations.some((i: any) => i?.provider?.toLowerCase?.().includes('other') && i?.keepExisting)) {
    if (website !== 'not_applicable') website = 'manual_review';
    if (app !== 'not_applicable') app = 'manual_review';
    reasons.push('An unclassified third-party integration needs compatibility review.');
  }

  return {
    website,
    app,
    reasons,
    timingClockStartsAt: intake?.submission?.acceptedForBuildAt ?? null
  };
}
