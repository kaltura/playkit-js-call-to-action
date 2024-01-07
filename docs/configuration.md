## Configuration

The plugin configuration allows defining one or more messages.
Every message can appear at a specific time and have specific content.
Messages can appear as either an overlay or a toast message.

### Configuration structure

```js
{
  messages: [
    {
      title: '...',
      description: '...',
      showToast: false,
      redisplayMessage: false,
      buttons: [
        // ...
      ],
      timing: {
        // ...
      }
    }
  ];
}
```

#### General Configuration

> | Name               | Type      | Description                                                                                   | Optional |
> | ------------------ | --------- | --------------------------------------------------------------------------------------------- | -------- |
> | `title`            | `string`  | Optional. Will appear as title of message.                                                    | Yes      |
> | `description`      | `string`  | Optional. Will appear below the title.                                                        | Yes      |
> | `showToast`        | `boolean` | Optional. If true - the message will appear as popup, otherwise it will appear as an overlay. | Yes      |
> | `redisplayMessage` | `boolean` | Optional. See below.                                                                          | Yes      |
> | `buttons`          | `Object`  | Optional. See below.                                                                          | Yes      |
> | `timing`           | `Object`  | Optional. See below.                                                                          | Yes      |

Although title, description and buttons are optional fields, at least one of them needs to be set, otherwise the message will not appear.

#### Buttons Configuration

#### Timing Configuration
