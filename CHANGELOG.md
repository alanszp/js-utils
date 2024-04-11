# Changelog

## v14.1.2

- Fix `@alanszp/jwt`: Fix missing assignment of `originalOrganizationReference`

## v14.1.1

- Fix `@alanszp/jwt`: Fix hardcoded organization for `axiosPermissionsResolutionFactory`

## v14.1.0

- Add `@alanszp/express`: implemnt package TSOA to generate docs & json schema validations

## v14.0.5

- Fix `@alanszp/jwt`: Fix `axiosPermissionsResolutionFactory` calling logger without reference. Now logger is required in params

## v14.0.4

- Add `@alanszp/logger`: Add to `ILogger` the method `event` to log events in the app.
- Add `@alanszp/logger`: Add restriction to console logger to log at least INFO logs. Error will be thrown when configure console as WARN or ERROR logger.
- Add `@alanszp/audit`: Add optional param to `createAuditLogger` to turn off audit logs. Useful for testing!

## v14.0.3

- Fix `@alanszp/eventbridge-subscriber`: Fix `isSubscribedEvent` validation.

## v14.0.2

- Fix `@alanszp/eventbridge-subscriber`: Fix `SubscribedEventInput` static method `fromEventPayload` interface.

## v14.0.1

- Added `@alanszp/eventbridge-subscriber`: Added `SubscribedEventInput` as the new base class to use when handling Eventbridge Events.
- Change `@alanszp/eventbridge-subscriber`: Marked `NotificationInput` to deprecate it in a near future.

## v14.0.0

- Upgrade bullmq to 5.x in `@alanszp/queues`
- Upgrade ioredis to 5.3.2 `@alanszp/queues`: 5.3.2 or higher is required
- Change `QueueOptions` & `WorkerOptions` types on `@alanszp/queues`: Connection is no longer a prop, because it's already required in the queue and worker constructor.
- Add `RepeatableQueue` class `@alanszp/queues`: for repeatable jobs

## v13.0.0

- Deprecated `@alanszp/express-commons-fn`: `commonErrorsHandler` in favor of the new errorRequestHandlerMiddleware.
- Renamed `@alanszp/express`: `returnInternalServerError` to `errorRequestHandlerMiddleware`.
- Modify `@alanszp/express`: Move logic from `commonErrorsHandler` into `errorRequestHandlerMiddleware`.
- Added `@alanszp/express`: Middlewares to handle permissions checks (with retro-compatibility for old-role-codes)
- Added `@alanszp/express`: Adds new helper for to craft a base log given a request `getRequestBaseLog`.
- Added `@alanszp/jwt`: Adds new `BitmaskUtils` class to handle binary bitmask operations supporting big numbers.
- Modify `@alanszp/jwt`: `JWTUser` class, adding methods to check for permissions
- Added `@alanszp/jwt`: Created `PermissionService`, instantiated via a `JWTUser` statically. Caching permissions in memory every hour for now. Better caching strategy is pending.

## v12.0.3

- Modify `@alanszp/*`: Removed from `package.json` the key `files` since it was preventing to remove `node_modules` when publishing the libs and where generating problems.

## v12.0.2

- Try to fix node_modules deps and move `@alanszp/error` to peerDependency only.

## v12.0.1

- Added `@alanszp/express-commons-fn`: `commonErrorsHandler` logs error when the error is `RenderableError` and statusCode >= 500

## v12.0.0

### Features

- Modify `@alanszp/core`: `appIdentifier` will now use `SERVICE_NAME` before `API_ORIGIN_NAME` to define the service name. `API_ORIGIN_NAME` will be deprecated.
- Added `@alanszp/core`: `appIdentifier` will set `ROLE_NAME` on the identifier.

### Breaking changes on `@alanszp/errors`.

- Modify `@alanszp/errors`: `RenderableError` is now an abstract class and inherits `BaseError`.
- Added `@alanszp/errors`: `HttpRenderableError` which inherits `RenderableError`.
- Remove `@alanszp/errors`: `HttpError` in favour of implementing our own domain errors.
- Modify `@alanszp/express-commons-fn`: `commonErrorsHandler` now renders `RenderableError` and if the error defines `HttpRenderableError` will use that code.
- Modify many libs to be compliant with above changes.

## v11.0.0

Breaking changes on `@alanszp/jwt`.

- Modify `@alanszp/jwt`: JWTUser is now a class
- Modify `@alanszp/jwt`: createTokenPayload is now a method of JWTUser, fn is not exported anymore
- Modify `@alanszp/jwt`: jwtUserHasRoles is now a method of JWTUser, fn is not exported anymore

## v10.2.0

- Add `@alanszp/access-list`: Add new module for check and filter segments

## v10.1.1

- Fix @alanszp/queue: Add maxEventListener to redis connection manager to avoid incorrect warning of possible leak

## v10.1.0

- Add @alanszp/queue: add repeatable job methods

## v10.0.3

- Remove cuid in favor of @paralleldrive/cuid2

## v10.0.2

- Add `@alanszp/audit`: Add lid, lch & lid to audit interface.
- Add `@alanszp/eventbridge-client`: Shorten lch string.
- Add `@alanszp/express`: Add lid, lch & lid to audit log.
- Add `@alanszp/express`: Add lid & lid response header.
- Add `@alanszp/worker`: Add queue name to lch.

## v10.0.1

- Upgrade to lerna v8.
- Fix building issues.
- Add needed dependencies to build project correctly.

## v10.0.0

- Fix vulnerabilities. Most of them were dev ones.
- What might break
  - `class-validator` upgraded to v0.14.1.
  - `jose` upgraded to v5.2.2 (this was not a vulnerability but made it anyways).
  - `axios` upgraded to v0.28.

## v9.3.1

- Add `@alanszp/queue`: Add missing export of the new modules published in v9.3.0.

## v9.3.0

- Add `@alanszp/queue`: Add job management commands to create & get/search jobs.
- Add `@alanszp/queue`: Add reporter class with it's mock to be able to update progress to jobs.

## v9.2.7

- Add `@alanszp/express`: Add limit of 1mb to json body parse.

## v9.2.6

- Add `@alanszp/queue`: Add `Queue` generic on `createQueue` return param.

## v9.2.5

- Add `@alanszp/eventbridge-subscriber`: Add `INotificationInput<T>` to the interface.
- Modify `@alanszp/eventbridge-subscriber`: `NotificationInput` supports initialization with param of type `INotificationInput<T>`.

## v9.2.4

- Add `@alanszp/queue`: Add `ReturnValue` to `Worker` generics.

## v9.2.3

- Add `@alanszp/queue`: Add `getName` method for class `Queue`
- Add `@alanszp/queue`: Add return type to `publishJob` and `publishBulkJob` on class `Queue`
- Add `@alanszp/queue`: Export Queue entity

## v9.2.2

- Add `@alanszp/core`: Add utility function assignPaginableKeys

## v9.2.1

- Skipped version

## v9.2.0

- Modify `@alanszp/jwt`: Rename segment_id to segment_reference. Will invalidate v9.1.0, so we will remove that version to make sure that it's never used.

## v9.1.0

- Modify `@alanszp/jwt`: to add segment_id in the payload of the JWT.

## v9.0.0

- Modify `@alanszp/queue`: add context to queues.

## v8.0.0

- Modify `@alanszp/integrations-common`: strictly add `removed` into `details` property in `IntegrationExecutionResult` class

## v7.9.3

- Modify `@alanszp/split`: Fix type for constructor.

## v7.9.2

- Modify `@alanszp/serverless`: Fix bad build.
- Modify `@alanszp/split`: Fix bad build.

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
