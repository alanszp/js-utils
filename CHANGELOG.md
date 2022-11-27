# Changelog

## v7.9.1

- Modify `@alanszp/split`: Removes the timeout functionality since its already implemented in the SplitClient lib.
- Modify `@alanszp/split`: Adds a log in the succeed to measure how long did it take to init.
- Modify `@alanszp/split`: Change base params to not be so aggressive on pushing analytics metrics.
- Modify `@alanszp/serverless`: Assures that SplitIO is destroyed if for any reason it couldn't be loaded.

## v7.9.0

- Publish `@alanszp/queue`: Adds library to manage BullMQ queues. It contains publishers and workers.

## v7.8.5

- Modify `@alanszp/integrations-common`: Add integration history base entity and common views

## v7.8.4

- Modify `@alanszp/integrations-common`: Adds common types and logic.

## v7.8.3

- Add `@alanszp/integrations-common`: First publish, empty and non-functional.

## v7.8.2

- Modify `@alanszp/eventbridge-client`: Adds DeletedEvent.

## v7.8.1

Nothing changed. It was never published

## v7.8.0

Changes

- Modify `@alanszp/serverless`: Adds middleware for SplitIO.
- Modify `@alanszp/split`: Fixes types of SplitIO SDK.

## v7.8.0

- Add `@alanszp/split`: Wrapper of Split IO Javascript SDK and creation of a base class to init and consume the SDK.

## v7.7.0

Nothing changed. It was never published

## v7.6.0

Changes

- Modify `@alanszp/eventbridge-client`: When some of the request fails, it adds the payload to the response of the `sendEvents` method.

## v7.5.0

Changes

- Modify `@alanszp/eventbridge-client`: still receives multiple events to send to eventbridge, but sends them 1 by 1 in parallel and then aggregate result to allow to know which events actually failed.

## v7.4.3

Changes

- Modify `@alanszp/eventbridge-client`: remove logs from responses and failures.

## v7.4.2

Changes

- Modify `@alanszp/eventbridge-client`: now sends multiple events to eventbridge in the same request and logs responses and failures.

## v7.4.1

Changes

- Modify `@alanszp/express` middleware createContext: change import from dist folder to src folder.

## v7.4.0

Changes

- Modify `@alanszp/express` middleware createContext: fix bug that when body didn't exist, requests failed.
- Modify `@alanszp/express` middleware returnInternalServerError: fix bug that when logger didn't exist it failed. Instead, get logger with `getLogger` function to hold the actual sharedContext.

## v7.3.0

Changes

- Modify `@alanszp/express` middleware createContext: when headers "x-lifecycle-chain" and "x-lifecycle-id" are not present try to fetch them from request body as eventbridge events send them there.

## v7.2.0

Changes

- Create `@alanszp/eventbridge-subscriber` to hold common classes useful to subscribe to events

## v7.1.1

Changes

- FIX: `@alanszp/eventbridge-client`: remove default eventbus name in constructor that was not
  wrong.

## v7.1.0

Changes

- Modify `@alanszp/eventbridge-client` add generic types for Update and Create entity events.

## v7.0.1

Changes

- Create `@alanszp/eventbridge-client` to handle communication with AWS EventBridge.
- FIX: `@alanszp/` now JWTVerifyOptions extends Partial<VerifyOptions> instead of VerifyOptions.

## v7.0.0

Changes

- Modified `@alanszp/express` middleware authWithJWT now is called authenticateUser and provides
  a way to authenticate using either JWT, API_KEY, or both for the same endpoint.

## v6.1.0

Changes

- `@alanszp/express-commons-fn`: Will now get logger inside function so that the context is already loaded

---

## v6.0.5

Changes

- FIX: `@alanszp/logger`: `serializer` error serializer will now only serialize response if it's Non200ResponseError

---

## v6.0.4

Changes

- `@alanszp/shared-context`: Will now pass the context as the first executable.
- FIX: `@alanszp/express`: `createContext` will now create the context before calling next.

---

## v6.0.3

Changes

- FIX: Name of the lifecycle ID and chain in the logger.

---

## v6.0.2

Changes

- FIX: `@alanszp/serverless` DB middleware will make suer to create once the connection of the DB.

---

## v6.0.1

Changes

- FIX: Adds `@alanszp/serverless` types of AWS Lambda as a dependency, so other repos will have the proxy types well defined.

---

## v6.0.0

Changes

- Create `@alanszp/serverless` to store all logic and types related to lambda execution context and middlewares.
- Create `@alanszp/shared-context` to isolate logic arount storing a context to use across the stack of an execution.
- Modified `@alanszp/logger` to not use `@alanszp/axios-node` to avoid circular dependency and to serialize the field response of an error.
- Modified and renamed `@alanszp/express`' middleware `createExtraContext` to `createContext`, which uses the new `SharedContext`.
- Added `appIdentifier` function to `@alanszp/core`.

---

## v5.0.1

Changes

- Fix commonErrorsHandler to add `extraContext` in every log

---

## v5.0.0

Changes

- Move validation objects from `@alanszp/typeorm` to `@alanszp/validations`
- Use `@alanszp/validations` instead of `@alanszp/typeorm` in `@alanszp/express-common-fn`
- `commonErrorsHandler` now returns as default 404 when the error is `EntityNotFoundError`, instead of returning a 400

---

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
