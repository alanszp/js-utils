import { BaseModel, ModelValidationError } from "@alanszp/validations";
import { IsDefined } from "class-validator";
import {
  EventBaseData,
  SubscribedEvent,
  isSubscribedEvent,
} from "./types/SubscribedEvent";

export type Class<T, Arguments extends unknown[] = any[]> = {
  prototype: Pick<T, keyof T>;
  new (...arguments_: Arguments): T;
};

export interface ISubscribedEventInput<
  T extends EventBaseData = EventBaseData
> {
  event: SubscribedEvent<T>;
}

export class SubscribedEventInput<T extends EventBaseData = EventBaseData>
  extends BaseModel
  implements ISubscribedEventInput<T>
{
  @IsDefined()
  public event: SubscribedEvent<T>;

  constructor(event: SubscribedEvent<T>) {
    super();
    this.event = event;
  }

  static fromEventPayload<
    K extends SubscribedEventInput<P>,
    P extends EventBaseData
  >(
    this: Class<K>,
    payload: {
      event: SubscribedEvent<P>;
    }
  ): K {
    return new this(payload.event);
  }

  async validate(): Promise<void> {
    await super.validate();
    if (!isSubscribedEvent(this.event))
      throw new ModelValidationError([
        {
          property: "event",
          constraints: {
            missingProps: "event is not a queued notification",
          },
        },
      ]);
  }

  getEventData(): T {
    return this.event.detail;
  }

  getEventId(): string {
    return this.event.id;
  }

  getEventTopic(): string {
    return this.event["detail-type"];
  }

  getEventSource(): string {
    return this.event.source;
  }

  getEventTimestamp(): string {
    return this.event.time;
  }
}
