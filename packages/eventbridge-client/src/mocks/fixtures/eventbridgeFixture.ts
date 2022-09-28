export const topics = ["topic1", "topic2"];

export const events = [{ property: "1" }, { property: "2" }];

export const twoEventsToSend = [
  { topic: topics[0], body: events[0] },
  { topic: topics[1], body: events[1] },
];

export const twoSuccessfulResponses = [
  {
    Entries: [{ EventId: 1 }],
    FailedEntryCount: 0,
  },
  {
    Entries: [{ EventId: 2 }],
    FailedEntryCount: 0,
  },
];

export const twoUnsuccessfulResponses = [
  {
    Entries: [{ EventId: undefined }],
    FailedEntryCount: 1,
  },
  {
    Entries: [{ EventId: undefined }],
    FailedEntryCount: 1,
  },
];

export const oneSuccessfulOneUnsuccessfulResponses = [
  {
    Entries: [{ EventId: 1 }],
    FailedEntryCount: 0,
  },
  {
    Entries: [{ EventId: null }],
    FailedEntryCount: 1,
  },
];
