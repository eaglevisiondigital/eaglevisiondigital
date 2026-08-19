# Eagle Vision Digital — Netlify Form Notification Recipients

The site form is configured as a Netlify Form named:

`eagle-vision-project-inquiry`

The HTML is ready for Netlify form capture and includes a version-controlled notification subject.

## Required one-time Netlify project setting

Netlify controls the actual recipient email addresses in the project dashboard rather than in `netlify.toml` or the static form HTML.

In the Eagle Vision Digital Netlify project:

1. Open **Project configuration**
2. Go to **Notifications → Emails and webhooks**
3. Under **Form submission notifications**, add an email notification for:
   - `dave@eaglevision.biz`
4. Add a second email notification for:
   - `info@eaglevision.biz`
5. Scope both notifications to the form:
   - `eagle-vision-project-inquiry`

After those two notification recipients are enabled, every verified form submission will be stored in Netlify Forms and emailed to both addresses.

The visitor's `email` field remains named `email`, so Netlify can set the Reply-To address to the submitter.
