# TASK-15: Client Security Hardening

## Objective
Apply baseline web security controls suitable for public static hosting.

## Why This Task Exists
Current code includes user-input rendering patterns that can allow XSS if not handled safely.

## Scope
- Harden score/name input and rendering.
- Add content security policy guidance compatible with the app.
- Add host-level security header guidance for static providers.

## Inputs / Context
- Score list currently uses string `innerHTML` composition from user-entered name.

## Implementation Steps
1. Ensure all user-controlled values are rendered with safe DOM APIs (`textContent`).
2. Add input constraints for player names (max length, allowed characters, fallback to `Anonymous`).
3. Add CSP strategy to avoid inline script execution and restrict resource origins.
4. Document security headers and equivalent static-host config options (Netlify/Vercel/Cloudflare Pages/GitHub Pages notes).
5. Add a quick manual security checklist in docs.

## Deliverables
- Hardened rendering/input behavior.
- Documented CSP/security header recommendations.

## Acceptance Criteria
- Stored/script-like player names do not execute.
- App runs with documented CSP without breaking core functionality.
- Security guidance is present for static deployment.

## Out of Scope
- Advanced auth/identity and server-side security controls.
