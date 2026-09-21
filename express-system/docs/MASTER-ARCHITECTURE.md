# Eagle Vision Express Intake - Master Architecture v1

## 1. Product architecture

The system is one adaptive generator with industry blueprints, not separate builders for each vertical. Website and app share structured client information wherever practical.

The client chooses outcomes. Eagle Vision chooses implementation technology.

**Client layer**

Business facts, goals, content, branding, media, page choices and desired outcomes.

**Decision layer**

Industry blueprint + conditional rules + capability catalog + certification status + Express SLA guardrails.

**Production layer**

Website generator, app configuration, integrations, QA, preview, approval and launch.

**Shared platform layer**

Global Propel is the intended master identity/CRM/organization/role/membership/entitlement layer. Appy Pie is an app delivery provider, not the permanent system of record.

## 2. Five visible client steps

### Step 1 - Quick Start Lead Capture
Collect only the initial lead information Eagle Vision wants before project discovery begins:

- Product interest: Website, App, or Website + App
- Business / organization name
- First name
- Last name
- Role
- Phone
- Email
- City
- State / Province
- Country
- Industry
- Industry detail only when "Other" is selected

Once those required Step 1 fields are complete, create a lightweight **partial lead capture** even if the client never finishes the full intake. Use one persistent lead capture ID so a later completed intake can be matched back to the original partial lead.

Do not require the business description, current website, source materials, project goals, services, differentiators, integrations, or street address before the lead is captured.

### Step 2 - What You Need
Collect one primary CTA, top offerings, audience/problem, differentiators, outcome capabilities and existing integrations. Branch aggressively so irrelevant questions never appear.

### Step 3 - Your Look + Story
Collect logo/brand assets, up to three visual descriptors, color strategy, light/dark/EV choice, about/mission/history notes, and default content-handling preference.

### Step 4 - People + Photos + Pages
Collect labeled media, team profiles, permissions, recommended five pages with simple swap controls, and app-specific needs only when app is purchased.

### Step 5 - Review
Render “Here is what we understand,” highlight missing/uncertain facts, show selected pages/features, then allow **Looks right - Build my site** or Edit.

Target answered questions after branching:
- Simple: 12-16
- Typical: 18-24
- Complex: 25-30

The UI may have many underlying fields without feeling like a long questionnaire.

## 3. Content safety and factual integrity

Every important content field inherits one of:
- exact
- light_polish
- professional_rewrite

Per-field overrides are allowed.

Restricted behavior:
- Church beliefs: exact or light polish only.
- Legal disclaimers: exact only.
- Testimonials: exact by default; light polish only with explicit permission.
- Never invent years, licenses, insurance, guarantees, awards, ratings, prices, medical claims, theological assertions, or other factual proof.

Information provenance supports:
- verified
- imported
- generated

Imported sensitive facts must be confirmed before publication.

## 4. Media model

Every upload is labeled and rights-confirmed. Required metadata supports owner/founder, team member, group, location, facility, project, product, menu item, event, logo, source material and other. Placement may be anywhere, homepage, about, team, gallery, service-specific, website-only, app-only, or source-only.

## 5. Page model

The standard website package is five marketing pages. Utility/legal/confirmation pages do not inherently consume a paid marketing-page slot.

A page is not the same as a functional system. Examples: Order Online can be an external action rather than an ordering engine; Events can exist without ticketing; Contact can exist without CRM.

## 6. App provider abstraction

Future application code should implement a provider contract rather than directly coupling Global Propel to Appy Pie:

- CreateUser
- UpdateUser
- DeactivateUser
- AssignGroup
- RemoveGroup
- GetFeatures

Provider examples:
- AppyPieAppProvider
- FutureNativeProvider
- PWAProvider

External app identity mapping must not rely only on email. Store Propel user, organization, provider, external app, external user identifier, group/status, provisioned time and sync state.

## 7. Current Appy Pie certification snapshot

- Code Page: tested/approved for custom HTML/CSS/JS interactive pages.
- HTML Code: tested with limits; HTML/CSS works, JS not proven in the visible editor.
- Website feature: documented/observed but seamless hosted-page behavior not certified.
- Deeplink: platform destinations observed; internal feature deep linking not certified.
- Folder: available but child-feature/navigation behavior still needs testing.
- Food Court: pilot only until a complete transaction and shared menu source are certified.
- Loyalty/Coupons: pilot only for simple use; Boss remains external/custom unless separately proven.
- User registration/update APIs: promising/documented but live provisioning/group-change test remains outstanding.
- True SSO: unresolved. Provisioning is not SSO.
- Push: must be certified on iPhone and Android before a standard promise.

## 8. Express SLA gate

The 3-24-hour website clock and 3-7-business-day app clock begin only after Eagle Vision marks the project **accepted_for_build**.

Acceptance means required information/assets are complete or explicitly waived, rights are confirmed, sensitive claims needed for publication are verified, and the project fits standard/preapproved scope.

Custom software, extensive ecommerce, large databases/portals, unsupported integrations, unusual DNS, uncatalogued POS workflows, missing assets, or required unverified app capabilities trigger manual/custom scope.

Apple/Google review and developer-account enrollment are never included in the app build clock.

## 9. Approval/version model

Every generated build has an immutable version identifier.

Flow:

Intake confirmed -> Eagle Vision accepts -> Generate -> Automated QA -> Dave review -> Client review -> Revision if required -> final version approval -> launch.

Dave approval and client approval must reference the same version before production launch.

## 10. Pilot order

1. Local Service: prove intake -> website -> QA -> branded preview -> approval.
2. Church: add app shell, access groups and Propel/Appy Pie provisioning pilot.
3. Restaurant: add menu/POS/ordering integration decisioning without blocking the first two pilots.
