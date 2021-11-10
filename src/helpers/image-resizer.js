import Resizer from 'react-image-file-resizer';

export default function resizeImage(imageFile) {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      imageFile,
      300,
      300,
      'JPEG',
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      'base64',
    );
  });
}
