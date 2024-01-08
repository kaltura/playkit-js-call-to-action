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

##

> ### title
>
> ##### Type: `string`
>
> ##### Default: ``
>
> ##### Optional: yes
>
> ##### Description: Defines the message title

##

> ### description
>
> ##### Type: `string`
>
> ##### Default: ``
>
> ##### Optional: yes
>
> ##### Description: Defines the message description

##

> ### showToast
>
> ##### Type: `boolean`
>
> ##### Default: false
>
> ##### Optional: yes
>
> ##### Description: If true - the message will appear as a popup, otherwise it will appear as an overlay

##

> ### redisplayMessage
>
> ##### Type: `boolean`
>
> ##### Default: false
>
> ##### Optional: yes
>
> ##### Description: See under [Message timing](#message-timing).

##

> ### buttons
>
> ##### Type: `Array`
>
> ##### Optional: yes
>
> ##### Description: The message can contain between zero and two buttons. The buttons data is defined in this array.

##

> > ### button.label
> >
> > ##### Type: `string`
> >
> > ##### Optional: no
> >
> > ##### Description: Button text.

##

> > ### button.link
> >
> > ##### Type: `string`
> >
> > ##### Optional: no
> >
> > ##### Description: Can contain either an entry id to be played when the button is clicked, or a url to be opened when the button is clicked.

##

> > ### button.type
> >
> > ##### Type: `string`
> >
> > ##### Default: `primary`
> >
> > ##### Optional: yes
> >
> > ##### Description: Button type - primary or secondary button.

##

> ### timing
>
> ##### Type: `Object`
>
> ##### Optional: no
>
> ##### Description: Definition of the message timing.

##

> > ### timing.showOnStart
> >
> > ##### Type: `boolean`
> >
> > ##### Optional: yes
> >
> > ##### Description: If true, message will appear on playback start.

##

> > ### timing.showOnEnd
> >
> > ##### Type: `boolean`
> >
> > ##### Optional: yes
> >
> > ##### Description: If true, message will appear on playback end.

##

> > ### timing.timeFromStart
> >
> > ##### Type: `number`
> >
> > ##### Optional: yes
> >
> > ##### Description: Start time of message relative to playback start. Non-negative number.

##

> > ### timing.timeFromEnd
> >
> > ##### Type: `number`
> >
> > ##### Optional: yes
> >
> > ##### Description: Start time of message relative to playback end. Non-negative number.

##

> > ### timing.duration
> >
> > ##### Type: `number`
> >
> > ##### Optional: yes
> >
> > ##### Description: Message duration. Positive number.

### Message content

Although title, description and buttons are all optional fields - at least one of them needs to be set, otherwise the message will not appear.
To set data for a button, both the button label and the button link need to be set.

### Message timing

At least one of the message timing fields must be set to a valid value.
A message will appear at its start time and be visible until either: its duration expires (if duration is set), or until it is dismissed by the user.
If the user seeks back into a message's time range after it has already been displayed, the message will appear again, unless either: it was dismissed by the user, or [redisplayMessage](#redisplaymessage) is true.
