# marker.js &mdash; Let your users annotate and mark images

marker.js is a JavaScript library to enable image annotation in your web projects. Users can annotate and mark up images, and you can save, share or otherwise process the results.

## Installation

```
npm install markerjs
```

## Usage

To enable image annotation in your project follow these 3 simple steps:

1. Attach `markerjs.MarkerArea` to the image;
2. Pass a callback method to the `MarkerArea.show()` method;
3. Process the results when the user is done.

## Example

```js
import { MarkerArea } from 'markerjs';

const m = new MarkerArea(document.getElementById('imageToAnnotate'));
m.show(
    (dataUrl) => {
        const res = document.getElementById("resultImage");
        res.src = dataUrl;
    }
);
```

## Credits

marker.js is using [Font Awesome Free](https://fontawesome.com) icons for the toolbar UI.

## License
Linkware (see [LICENSE](https://github.com/ailon/markerjs/blob/master/LICENSE) for details) - the UI displays a small link back to the marker.js website which should be retained. Alternative license options are coming soon.

Alternative licenses are available through the [marker.js website](https://markerjs.com).