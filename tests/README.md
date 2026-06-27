# VentureCraft E2E Tests

This folder contains Playwright tests for the application flow.

## What the tests cover

`tests/e2e/apply-travel-visa.spec.ts` covers:

- GCC attendee application submission and Firestore save.
- Non-GCC passport and visa branch submission.
- Passport expiry and blank-page warning flags.
- Existing Saudi visa fields.
- US/UK/Schengen visa or residence fields.
- GCC residency permit fields and uploads.
- Sponsorship review when more than two attendees are marked sponsored.
- Step 1 required field and upload validation.
- Closed registration blocking normal application access.

The tests submit through the UI and then verify saved data in Firestore using Firebase Admin credentials.

## Running locally

Create `.env.local` from `.env.local.example`, then run:

```powershell
npm run test:e2e
```

This opens Playwright Inspector and Chrome so you can watch and step through the test.

For a non-interactive run:

```powershell
npm run test:e2e:ci
```

## Important notes

- `.env.local` and `.env.e2e.local` are ignored by Git and must not be committed.
- Use a staging Firebase project or disposable test account when possible.
- The E2E suite mutates the configured Firebase project by opening registration, deleting the test user's application document, submitting new applications, and verifying Firestore data.
- The suite runs serially because it uses one configured test user and one application document.
- `test-results/` and `playwright-report/` are ignored and should not be committed.

