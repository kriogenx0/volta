import _ from 'lodash';

const fileTypes = {
  audio: [
    'mp3',
    'wav',
    'aif',
    'aiff',
    'm4a',
    'wma',
    'aac',
    'ogg',
    'flac',
    'alac',
  ],
  video: [
    'mpg',
    'mov',
    'wmv',
    'avi',
    'flv',
    'mp2',
    'asf',
    'qt',
    'avchd',
    'swf',
  ],
  image: [
    'gif',
    'png',
    'jpeg',
    'jpg',
    'tiff',
    'pdf',
    'pict',
    'bmp',
    'raw',
  ],
};

const fileClassFromExtension = (fileExtension) => {
  let fileClass;
  _.each(fileTypes, (fc, fileClassKey) => {
    _.each(fc, (fileExt) => {
      if (fileExt === fileExtension) return fileClass = fileClassKey;
    });
  });
  return fileClass || null;
};

const fileType = (fileName) => {
  if (!fileName) return;

  const match = /\.(\w+)$/i.exec(fileName);
  const fileExt = match[1].toLowerCase();

  return {
    fileName,
    fileClass: fileClassFromExtension(fileExt),
    fileExt,
  };
};

export default fileType;
