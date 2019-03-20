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

### Example

```js
import { MarkerArea } from 'markerjs';

const m = new MarkerArea(document.getElementById('imageToAnnotate'), document.getElementById('targetElement'));
m.show(
    (dataUrl) => {
        const res = document.getElementById("resultImage");
        res.src = dataUrl;
    }
);
```

## Use with your own UI

You don't have to use marker.js with its built-in toolbar. It's perfectly understandable that often you'd rather integrate annotation functionality into your own UI. And you may also want to limit available marker types according to your requirements.

marker.js has you covered. Instead of calling `MarkerArea.show()` like described above, call `MarkerArea.open()`, then call one of the following methods from your UI to perform whatever action you are after:

- `addMarker(markerType)` - call `addMarker` to place a new marker of the `markerType` type into the marker area. Currently supported marker types are: 
    - `ArrowMarker` - arrows, 
    - `CoverMarker` - solid rectangle to cover areas you'd rather not show,
    - `HighlightMarker` - semi-transparent rectangle to highlight areas,
    - `LineMarker` - lines,
    - `RectMarker` - transparent rectangle with solid border,
    - `TextMarker` - text;
- `deleteActiveMarker()` - deletes currently selected marker (if any);
- `render(completeCallback)` - renders current marker area on top of the original image and calls a `completeCallback` when done passing a `dataUrl` representing the resulting image. This can then be used for whatever you want to do wit the result;
- `close()` - call when you are done and want to remove marking functionality from the image.

### Example

This example assumes that marker.js was included in the page via a script tag ala:

```html
<script src="https://unpkg.com/markerjs"></script>
```

And has this simplistic toolbar to control marker.js behavior:

```html
<div id="markerActivator">
    <button onclick="showApiMarker(document.getElementById('targetImage'));">mark</button>
</div>

<div id="markerControls" style="display: none;">
    <button onclick="addArrow();">add arrow</button>
    <button onclick="deleteMarker();">delete marker</button>
    <button onclick="render();">render</button>
    <button onclick="closeMarkerArea();">close</button>
</div>
```

Note that for this example we want to support arrow markers only.

So, our JavaScript code would look something like this:

```js
let markerArea;

function showApiMarker(img) {
    markerArea = new markerjs.MarkerArea(img, document.getElementById('targetElement'));
    markerArea.open();
    document.getElementById('markerActivator').style.display = 'none';
    document.getElementById('markerControls').style.display = '';
}

function addArrow() {
    if (markerArea) {
        markerArea.addMarker(markerjs.ArrowMarker);
    }
}
function deleteMarker() {
    if (markerArea) {
        markerArea.deleteActiveMarker();
    }
}
function render() {
    if (markerArea) {
        markerArea.render((dataUrl) => {
            const res = document.getElementById('resultImage');
            res.src = dataUrl;
            res.style.display = "";
        });
    }
}
function closeMarkerArea() {
    if (markerArea) {
        markerArea.close();
    }
    document.getElementById('markerActivator').style.display = '';
    document.getElementById('markerControls').style.display = 'none';
}

```

## Credits

marker.js is using [Font Awesome Free](https://fontawesome.com) icons for the toolbar UI.

## License
Linkware (see [LICENSE](https://github.com/ailon/markerjs/blob/master/LICENSE) for details) - the UI displays a small link back to the marker.js website which should be retained. Alternative license options are coming soon.

Alternative licenses are available through the [marker.js website](https://markerjs.com).