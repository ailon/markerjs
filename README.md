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

```
import { MarkerArea } from 'markerjs';

const m = new MarkerArea(document.getElementById('imageToAnnotate'));
m.show(
    (dataUrl) => {
        const res = document.getElementById("resultImage");
        res.src = dataUrl;
    }
);
```

## License
Linkware (see LICENSE for details) - the UI displays a small link back to the marker.js website which should be retained. Alternative license options are coming soon.