## Configuration

The plugin configuration allows defining one or more messages.
Every message can appear at a specific time and have specific content.
Messages can appear as either an overlay or a toast message.

#### Configuration structure

```js
{
    messages: [{
        showToast: true // optional - default false
        title: "message title", // optional
        description: "message description", // optional
        buttons: [{ // optional
            label: "button 1 label",
            link: "https://www.kaltura.com" // can be entry id or url
        }, {
            label: "button 2 label",
            link: "entry_id" // can be entry id or url
        }],
        timing: {
            redisplayMessage: true, // optional - default false
            showOnStart: true // optional
            duration: 10 // optional
            //showOnEnd: true, // optional
            //timeFromStart: 5, // optional
            //timeFromEnd: 5 // optional
        }
    }]
}
```
