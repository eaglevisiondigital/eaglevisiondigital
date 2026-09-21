import type { GenerationBrief } from './types';
import { qualifyExpress } from './qualifyExpress';

export function buildGenerationBrief(intake: any): GenerationBrief {
  const reviewFlags: string[] = [];

  for (const proof of intake?.goals?.approvedProofPoints ?? []) {
    if (proof?.verified === false) reviewFlags.push(`VERIFY CLAIM: ${proof.claim}`);
  }

  if (intake?.business?.industry === 'church_ministry' && intake?.contentPolicy?.beliefs === 'professional_rewrite') {
    reviewFlags.push('BELIEFS POLICY ERROR: church beliefs may not use professional_rewrite.');
  }

  if ((intake?.media ?? []).some((m: any) => m?.rightsConfirmed === false)) {
    reviewFlags.push('MEDIA RIGHTS: one or more assets cannot be published yet.');
  }

  return {
    submissionId: intake.submission.submissionId,
    product: intake.package.product,
    industry: intake.business.industry,
    businessName: intake.business.legalOrPublicName,
    primaryAction: intake.goals.primaryAction,
    pagePlan: intake.pages.selected,
    capabilityPlan: (intake.capabilities ?? []).filter((c: any) => c.needed),
    contentPolicy: intake.contentPolicy,
    brand: intake.brand,
    media: intake.media ?? [],
    integrations: intake.integrations ?? [],
    app: intake.app ?? null,
    expressQualification: qualifyExpress(intake),
    reviewFlags
  };
}
