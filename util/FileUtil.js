const FileUtil = {
    size: number => size(number, { base: 10 }),
    joinPath: pathArray => pathArray.join("/"),
    // joinPath: path => _.map(path, p => FileUtil.stripTrailingSlash(p)).join("/"),
    stripTrailingSlash: pathStr => (FileUtil.isDirectory(pathStr) ? pathStr.substr(0, pathStr.length-1) : pathStr),
    isDirectory: pathStr => pathStr.charAt(pathStr.length - 1) == '/',
    fileNameFromPath: pathStr => (pathStr.split(/[\\/]/g).pop()),
    mimeTypeToType: mimetype => mimetype.replace(/\/.+$/, '')
  };
  
  export default FileUtil;