function converter(data) {
  if (data < 1024) {
    return (data / 1024).toFixed(2) + " B";
  } else if (data < 1024 * 1024) {
    return (data / 1024).toFixed(2) + " KB";
  } else if (data < 1024 * 1024 * 1024) {
    return (data / (1024 * 1024)).toFixed(2) + " MB";
  } else if (data < 1024 * 1024 * 1024 * 1024) {
    return (data / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  } else {
    return (data / (1024 * 1024 * 1024 * 1024)).toFixed(2) + " TB";
  }
}

function timedata(timestamp) {
  if (timestamp == 0) {
    return "Unlimited Access";
  } else {
    return new Date(timestamp).toLocaleString();
  }
}
