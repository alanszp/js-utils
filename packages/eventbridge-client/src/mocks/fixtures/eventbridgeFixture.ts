export const fifteenEventsFixture = {
  eventsToSend: [
    { topic: "topic", body: { property: true } },
    { topic: "topic", body: { property: true } },
    { topic: "topic", body: { property: true } },
    { topic: "topic", body: { property: true } },
    { topic: "topic", body: { property: true } },
    { topic: "topic", body: { property: true } },
    { topic: "topic", body: { property: true } },
    { topic: "topic", body: { property: true } },
    { topic: "topic", body: { property: true } },
    { topic: "topic", body: { property: true } },
    { topic: "topic", body: { property: true } },
    { topic: "topic", body: { property: true } },
    { topic: "topic", body: { property: true } },
    { topic: "topic", body: { property: true } },
    { topic: "topic", body: { property: true } },
  ],

  allSuccessfulResponses: {
    firstResponse: {
      Entries: [
        { EventId: 1 },
        { EventId: 2 },
        { EventId: 3 },
        { EventId: 4 },
        { EventId: 5 },
        { EventId: 6 },
        { EventId: 7 },
        { EventId: 8 },
        { EventId: 9 },
        { EventId: 10 },
      ],
      FailedEntryCount: 0,
    },

    secondResponse: {
      Entries: [
        { EventId: 11 },
        { EventId: 12 },
        { EventId: 13 },
        { EventId: 14 },
        { EventId: 15 },
      ],
      FailedEntryCount: 0,
    },
  },

  allUnsuccessfulResponses: {
    firstResponse: {
      Entries: [
        { EventId: null },
        { EventId: null },
        { EventId: null },
        { EventId: null },
        { EventId: null },
        { EventId: null },
        { EventId: null },
        { EventId: null },
        { EventId: null },
        { EventId: null },
      ],
      FailedEntryCount: 10,
    },
    secondResponse: {
      Entries: [
        { EventId: null },
        { EventId: null },
        { EventId: null },
        { EventId: null },
        { EventId: null },
      ],
      FailedEntryCount: 5,
    },
  },

  sevenUnsuccessfulResponses: {
    firstResponse: {
      Entries: [
        { EventId: 1 },
        { EventId: 2 },
        { EventId: 3 },
        { EventId: 4 },
        { EventId: null },
        { EventId: null },
        { EventId: null },
        { EventId: null },
        { EventId: null },
        { EventId: null },
      ],
      FailedEntryCount: 6,
    },

    secondResponse: {
      Entries: [
        { EventId: 5 },
        { EventId: 6 },
        { EventId: 8 },
        { EventId: null },
        { EventId: 7 },
      ],
      FailedEntryCount: 1,
    },
  },
};
