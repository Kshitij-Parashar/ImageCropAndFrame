getMeAShop.controller('Cropper', function ($scope) {
    $scope.myImage = '';
    $scope.myCroppedImage = '';

    var img = new Image,
        w = canvas.width,
        h = canvas.height,
        ctx = canvas.getContext('2d');
    img.crossOrigin = '';
    img.onload = getBounds;
    img.src = 'images/cup.png';

    function getBounds() {
        ctx.drawImage(this, 0, 0, w, h);

        var idata = ctx.getImageData(0, 0, w, h),
            buffer = idata.data,
            buffer32 = new Uint32Array(buffer.buffer),
            x, y,
            x1 = w, y1 = h, x2 = 0, y2 = 0;


        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                // get left edge
                if (buffer32[x + y * w] == 0) {
                    if (x < x1) x1 = x;
                }
                // get right edge
                if (buffer32[(w - x) + y * w] == 0) {
                    if ((w - x) > x2) x2 = w - x;
                }
            }
        }

        for (x = 0; x < w; x++) {
            for (y = 0; y < h; y++) {
                // get top edge
                if (buffer32[x + y * w] == 0) {
                    if (y < y1) y1 = y;
                }
                // get bottom edge
                if (buffer32[x + (h - y) * w] == 0) {
                    if ((h - y) > y2) y2 = (h - y);
                }
            }
        }

        $('#cropFrame').css(
            {
                "top": y1 + 'px',
                "margin-left": x1 + 'px',
                "height": y2 - y1 + "px",
                "width": x2 - x1 + "px"
            }
        )
    }
    var handleFileSelect = function (evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    $scope.download = function (src) {
        // atob to base64_decode the data-URI
        var image_data = atob(src.split(',')[1]);
        //To convert the binary data to a Blob
        var arraybuffer = new ArrayBuffer(image_data.length);
        var view = new Uint8Array(arraybuffer);
        for (var i = 0; i < image_data.length; i++) {
            view[i] = image_data.charCodeAt(i) & 0xff;
        }
        try {
            //Recommended method:
            var blob = new Blob([arraybuffer], {type: 'application/octet-stream'});
        } catch (e) {
            // The BlobBuilder API has been deprecated in favour of Blob, but older
            // browsers don't know about the Blob constructor
            // IE10 also supports BlobBuilder, but since the `Blob` constructor
            //  also works, there's no need to add `MSBlobBuilder`.
            var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
            bb.append(arraybuffer);
            var blob = bb.getBlob('application/octet-stream'); // <-- Here's the Blob
        }

        // Use the URL object to create a temporary URL
        var url = (window.webkitURL || window.URL).createObjectURL(blob);
        location.href = url; // <-- Download!
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
})