import axios from "axios";
import { isDate, reduce } from "lodash";
import { Writable } from "stream";
import { serialize, stringify } from "./serializer";

const COLOR_FROM_LEVEL = {
  10: "#c4c4c4",
  20: "#00ab00",
  30: "#0066E7",
  40: "#F18009",
  50: "#D4070F",
};

const REMOVABLE_FIELDS = {
  v: true,
  name: true,
  pid: true,
  level: true,
  msg: true,
  hostname: true,
  time: true,
};

export interface SlackStreamOptions {
  webhookUrl: string;
  channel?: string;
  username?: string;
  emojiIcon?: string;
  onError?: (error: Error, record: unknown) => void;
}

export class SlackStream extends Writable {
  private webhookUrl: string;
  private onError: (error: Error, record: unknown) => void;
  private channel?: string;
  private username?: string;
  private emojiIcon?: string;

  constructor(options: SlackStreamOptions) {
    super({
      objectMode: true,
    });

    if (!options?.webhookUrl) {
      throw new Error("webhookUrl and channel must be given");
    }

    this.channel = options.channel;
    this.webhookUrl = options.webhookUrl;
    this.username = options.username || "Logger";
    this.emojiIcon = options.emojiIcon || ":warning:";
    this.onError =
      options.onError ||
      function (error, record) {
        console.log(
          JSON.stringify(
            serialize({
              level: 50,
              msg: "_slack_serializer.error",
              error,
              record,
            })
          )
        );
      };
  }

  public _write(record: any): void {
    record = record || {};
    try {
      const color = COLOR_FROM_LEVEL[record.level];
      const log = reduce(
        record,
        (acc, value, key) => {
          if (!REMOVABLE_FIELDS[key]) {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      const body = {
        channel: this.channel,
        username: this.username,
        icon_emoji: this.emojiIcon,
        attachments: [
          {
            color,
            blocks: [
              {
                type: "section",
                fields: [
                  {
                    type: "mrkdwn",
                    text: `*Message*\n${record.msg}`,
                  },
                  {
                    type: "mrkdwn",
                    text: `*Application:*\n${record.name}:${process.env.NODE_ENV}`,
                  },
                  {
                    type: "mrkdwn",
                    text: `*Host*\n${record.hostname}:${record.pid}`,
                  },
                  {
                    type: "mrkdwn",
                    text: `*Time:*\n${
                      isDate(record.time)
                        ? record.time.toISOString()
                        : record.time
                    }`,
                  },
                ],
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "```" + stringify(serialize(log)) + "```",
                },
              },
            ],
          },
        ],
      };

      axios.post<void>(this.webhookUrl, body).catch((error) =>
        this.onError(error, {
          slackResponse: error.response ? error.response.data : null,
          record,
        })
      );
    } catch (err) {
      this.onError(err, record);
    }
  }
}
