import { BaseModel, ModelValidationError } from "@alanszp/validations";
import { IsDefined } from "class-validator";
import {
  EventBaseData,
  SubscribedEvent,
  isSubscribedEvent,
} from "./types/SubscribedEvent";

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

  static fromEventPayload<T extends EventBaseData = EventBaseData>(payload: {
    event: SubscribedEvent<T>;
  }) {
    return new SubscribedEventInput(payload.event);
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
