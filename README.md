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

const m = new MarkerArea(document.getElementById('imageToAnnotate'));
m.show(
    (dataUrl) => {
        const res = document.getElementById("resultImage");
        res.src = dataUrl;
    }
);
```

### Additional configuration

Starting with version `1.2` marker.js accepts a second parameter to the `MarkerArea` constructor. You can pass configuration through that object parameter.

Currently supported configuration settings are:

- `targetRoot` - in case your target image is not a child of `document.body` you can specify a different root here,
- `renderAtNaturalSize` - set to `true` to render the resulting marked image at the native resolution of the source target image,
- `markerColors` - object with color values for markers:
    - `mainColor` - main color for most markers (default: #ff0000),
    - `highlightColor` - color for the `HighlightMarker` - will be displayed semi-transparent,
    - `coverColor` - color for the `CoverMarker`,
- `strokeWidth` (new in 1.7) - set width of the stroke (line) on rectangular, ellipse and line markers (default: 3);
- `renderImageType` (new in 1.4) - marker.js renders in PNG by default but you can change this to other MIME type if you like (like "image/jpeg"),
- `renderImageQuality` (new in 1.4) - in a lossy image type (like JPEG) controls image quality (number from 0 to 1),
- `renderMarkersOnly` (new in 1.5) - renders the markers layer only (without the original image) when set to `true`. *Note*: make sure `renderImageType` is `image/png` (default) if you want to get transparent background image that can be overlayed on the original,
- `previousState` (new in 1.6) - lets you pass a state from a previous annotation session to continue editing (see "Multi-session example" for details).


### Example with config

This example sets marker.js to render at original image resolution and chages the main marker color to green.

```js
const m = new MarkerArea(document.getElementById('imageToAnnotate'), {
    renderAtNaturalSize: true,
    markerColors: {
        mainColor: '#00cc00'
    }
});
```

## Use with your own UI

You don't have to use marker.js with its built-in toolbar. It's perfectly understandable that often you'd rather integrate annotation functionality into your own UI. And you may also want to limit available marker types according to your requirements.

marker.js has you covered. Instead of calling `MarkerArea.show()` like described above, call `MarkerArea.open()`, then call one of the following methods from your UI to perform whatever action you are after:

- `addMarker(markerType)` - call `addMarker` to place a new marker of the `markerType` type into the marker area. Currently supported marker types are: 
    - `ArrowMarker` - arrows, 
    - `CoverMarker` - solid rectangle to cover areas you'd rather not show,
    - `EllipseMarker` (new in v.1.3) - transparent ellipse with solid border,
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
    markerArea = new markerjs.MarkerArea(img);
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
            const res = document.getElementById("resultImage");
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

## Multi-session example

Starting with version 1.6 you can save and restore the previous annotation session. The state is returned on each render as the second argument to `completeCallback` and then you can pass it back in the config to the constructor of a new `MarkerArea`.

```js
let savedState;

const m = new MarkerArea(document.getElementById('imageToAnnotate'), {
    previousState: savedState
});

m.show(
    (dataUrl, state) => {
        const res = document.getElementById("resultImage");
        res.src = dataUrl;
        savedState = state;
    }
);
```

This way in every subsequent editing session the state will be restored. You can persist this state in your app as JSON and restore later on.

## Credits

marker.js is using [Font Awesome Free](https://fontawesome.com) icons for the toolbar UI.

## License

Since version 1.8 marker.js is released under the [MIT license](https://github.com/ailon/markerjs/blob/master/LICENSE).

The annotation UI includes a small logo back to [marker.js website](https://markerjs.com). You can find instructions on how to remove it [here](https://markerjs.com/#price).
