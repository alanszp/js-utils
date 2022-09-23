import {
  BasicEventbridgeClient,
  EventDispatchResult,
  LaraEvent,
} from "./basicEventbridgeClient";

export class MockEventbridgeClient extends BasicEventbridgeClient {
  public mockSendEvents(events: LaraEvent[]): Promise<EventDispatchResult> {
    return this.sendEvents(events);
  }
}
