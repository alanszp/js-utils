# Changelog

## v4.0.13

Changes

- Add to `@alanszp/core` editable types & functions to make it easier create modify inputs and use those values.
- Create `@alanszp/validations` to isolate validation logic and create custom and shareable validators.

---

## v4.0.12

Changes

- Export `cache` object on `@alanszp/business-days-date-fns` in order to change it.

---

## v4.0.11

Changes

- Fix `@alanszp/business-days-date-fns` cache to assure that it always will execute once the fetchStrategy when the identify is the same and the lib is executed two times in a row without await.

---

## v4.0.10

Changes

- Added new lib: `@alanszp/business-days-date-fns` to extend `date-fns` lib with custom non bussiness days functions.

---

## v4.0.9

Changes

- `auditLog` express middleware has now a generic type to avoid casting when used certain params.

---

## v4.0.8

Changes

- [FIX] `jsonBodyParser`: Was not catching properly the error.
- [FIX] `returnInternalServerError`: In some occasions, when context did not existed, it throwing an exception without responding to the client.
- Add all express middlewares any on every generic to avoid collisions with other middlewares.

---

## v4.0.7

Changes

- Make `auditLog` of @alanszp/express mark the request as successful when a 304 is returned. [More info](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304)

---

## v4.0.6

Changes

- All middlewares exposed will be setting the request param as `Request<any>` to avoid type collision with other middlewares.
- New `CommonMetadataKeys`: `query` to save all query related params.

---

## v4.0.5

Changes

- Separate state from Audit base class. Now we have a AuditWithState which is the correct one to use for each request, to not share state between requests.
- Use AuditWithState instead of Audit in @alanszp/express

---

## v4.0.4

Changes

- Make the auditLog middleware in @alanszp/express to execute after request is finished but must be configured before the controller.

---

## v4.0.3

Changes

- Exported new middleware on @alanszp/express to write audit logs. 🤦‍♂️

---

## v4.0.2

Changes

- Added @alanszp/audit which normalizes the way to write audit logs and defines the interface & checks.
- Create new middleware on @alanszp/express to write audit logs.
- Adds new LogType `audit` to @alanszp/logger

---

## v4.0.1

Changes

- @alanszp/logger uses now @alanszp/axios-node instead of axios itself
- Make all peer deps match the dev deps.
- Remove unused imports from @alanszp/axios-node

---

## v4.0.0

Changes

- Upgrade axios to v0.24.0. It has breaking changes on typescript side [SEE CHANGELOG](https://github.com/axios/axios/blob/master/CHANGELOG.md#0240-october-25-2021)
- Starting this changelog since this version.
