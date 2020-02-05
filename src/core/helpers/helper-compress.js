/* eslint-disable no-new */

import ImageCompressor from 'image-compressor.js';
import Promise from 'bluebird';
import ExifReader from 'exifreader/dist/exif-reader';

export default file => new Promise((resolve, reject) => {
  // Read exif info
  const reader = new FileReader();
  reader.onload = function onload(readerEvent) {
    try {
      const tags = ExifReader.load(readerEvent.target.result);
      // The MakerNote tag can be really large. Remove it to lower
      // memory usage if you're parsing a lot of files and saving the
      // tags.
      delete tags.MakerNote;
      const { GPSLongitude = {}, GPSLatitude = {} } = tags;
      const lat = GPSLatitude.description || 0;
      const lon = GPSLongitude.description || 0;
      console.log(tags);
      console.log(lat, lon);
    } catch (error) {
      alert(error);
    }
  };

  // We only need the start of the file for the Exif info.
  reader.readAsArrayBuffer(file.slice(0, 128 * 1024));

  new ImageCompressor(file, {
    quality: 0.6,
    success(result) {
      // console.log(result);

      resolve(result);
    },
    error(e) {
      console.log(e.message);
      reject(e.message);
    },
  });
});
