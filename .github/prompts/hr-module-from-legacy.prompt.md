---
name: 'HR Module From Legacy'
description: 'Rebuild HR module screens from legacy HTML with current app design, mock data, and backend API contract JSON'
argument-hint: 'legacy folder path, target route prefix, locale, and whether to generate api-contract json'
agent: 'agent'
model: 'GPT-5 (copilot)'
---

Act as a senior prompt engineer and senior frontend architect with 10+ years of experience.

Your task is to rebuild a complete HR module from legacy HTML pages into the current application design system and architecture.

Inputs:

- Legacy pages folder: {{legacy_folder_path:hr-html}}
- Target routes prefix: {{target_routes_prefix:/hr}}
- Target stack: {{target_stack:Next.js + TypeScript + existing UI system in this repo}}
- Locale direction: {{locale:en|ar|both}}
- Generate backend contract JSON: {{generate_backend_contract_json:true}}

Business scope to implement:

1. Requests tab:

- Vacation Request
- Leave Permission Request
- Request Receipt Custody
- Request Job Modification
- Request Resignation
- Entitlements Request
- Loans Request

2. Follow-up tab:

- Requests Inbox
- Requests Outbox

3. Employees tab:

- Employees Management
- Employee Commission
- Commission Slices
- Check In/Out
- Leave Balance

4. Employee Complaints tab

Hard requirements:

- Scan and map all corresponding legacy screens in the legacy folder.
- Preserve the functional parameters and form fields from legacy pages.
- Redesign to match the current system style and component patterns.
- Use realistic mock data for lists, details, statuses, and filters.
- For every request creation form, prefill employee identity from authenticated user context and keep these fields read-only:
  - Employee Name
  - Employee Number
  - Department
- Keep request-specific fields editable according to each request type.
- Add validation rules and clear error states.
- Keep responsive behavior for desktop and mobile.

Backend handoff requirement:

- Produce a machine-friendly API contract JSON that backend can implement directly.
- Include endpoints, methods, request payload schemas, response schemas, enums, and status transitions.
- Include common auth assumptions and pagination/filter/sort conventions.

Execution instructions:

1. Discover and list legacy-to-new screen mapping.
2. Propose route structure and shared component strategy.
3. Implement pages, reusable components, and local mock data sources.
4. Implement request create flows with read-only employee identity fields from logged-in user.
5. Add inbox and outbox flows.
6. Add employees and complaints flows.
7. Generate API contract JSON file aligned with implemented frontend models.
8. Validate consistency between UI fields and API schemas.

Output format (strict):

1. Legacy mapping table.
2. Implementation plan.
3. Files created/updated.
4. Mock data strategy.
5. API contract JSON (full content).
6. Open assumptions and risks.
7. Next implementation steps.

Quality bar:

- Keep naming consistent across routes, components, services, and API contract.
- Avoid placeholder-only UI; provide meaningful data shapes.
- Ensure each request type has clear unique fields and workflow states.
- Prefer reusable form sections and validation schemas where possible.
