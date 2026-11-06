const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

// A byte count as text in decimal units (1 kB is 1000 bytes): 999 -> "999 B",
// 1500 -> "1.5 kB", 1234567 -> "1.23 MB". At most two decimals, none for bytes.
// Anything that isn't a number gives "".
const formatSize = (bytes) => {
    const number = Number(bytes);
    if (bytes === null || bytes === '' || !Number.isFinite(number)) return '';

    let value = Math.abs(number);
    let unit = 0;
    while (value >= 1000 && unit < UNITS.length - 1) {
        value /= 1000;
        unit += 1;
    }

    let rounded = unit === 0 ? Math.round(value) : Number(value.toFixed(2));
    // 999,999 bytes is 999.999 kB, which rounds up to "1000 kB": call it 1 MB.
    if (rounded >= 1000 && unit < UNITS.length - 1) {
        rounded = Number((rounded / 1000).toFixed(2));
        unit += 1;
    }

    return `${number < 0 ? '-' : ''}${rounded} ${UNITS[unit]}`;
};

const FileUtil = {
    size: formatSize,
    joinPath: pathArray => pathArray.join("/"),
    // joinPath: path => _.map(path, p => FileUtil.stripTrailingSlash(p)).join("/"),
    stripTrailingSlash: pathStr => (FileUtil.isDirectory(pathStr) ? pathStr.substr(0, pathStr.length-1) : pathStr),
    isDirectory: pathStr => pathStr.charAt(pathStr.length - 1) == '/',
    fileNameFromPath: pathStr => (pathStr.split(/[\\/]/g).pop()),
    mimeTypeToType: mimetype => mimetype.replace(/\/.+$/, '')
  };
  
  export default FileUtil;