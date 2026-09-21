# Eagle Vision Express - Netlify Form Setup

The Express system uses two Netlify Forms:

1. `express-lead-capture`
   - Captures the Step 1 lead even when the visitor does not complete the full intake.
2. `express-intake`
   - Stores the completed five-step intake, structured JSON, uploaded files, and the chat-ready Eagle Vision Build Brief.

## Required one-time Netlify notification setup

In the Eagle Vision Digital Netlify project:

1. Open **Forms > Submission notifications**.
2. Add email notifications for `express-lead-capture`.
3. Add email notifications for `express-intake`.
4. Use the same internal recipients Eagle Vision uses for project inquiries unless Dave changes them:
   - dave@eaglevision.biz
   - info@eaglevision.biz

The forms include an `email` field so Netlify can set Reply-To to the submitter where supported.

## Suggested notification purpose

### express-lead-capture
Use for immediate lead follow-up when someone completes Step 1 but may abandon later.

### express-intake
Use as the completed production handoff. The submission includes:
- `review_summary`
- `intake_json`
- `eagle_vision_build_brief`
- uploaded files / file links
- lead capture ID tying the final intake back to the Step 1 lead

## File upload limitation

Netlify Forms supports only one uploaded file per field and limits the entire form request to 8 MB.

The Express intake therefore:
- uses separate single-file source upload fields
- limits the combined selected uploads to 7 MB in the browser to leave request headroom
- tells clients larger asset packages can be supplied separately

A future dedicated asset-upload system may replace this limit.

## Final pre-launch test

Before public launch, submit:
1. one Step 1 test lead and confirm it appears in Netlify Forms and email notifications
2. one complete Express intake and confirm:
   - redirect to `/express/thank-you/`
   - uploaded files are accessible
   - `intake_json` is present
   - `eagle_vision_build_brief` is readable and complete
   - notification email arrives
   - Reply-To is the test submitter email
