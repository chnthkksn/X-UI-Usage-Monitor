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

function convertGb(data) {
  return (data / (1024 * 1024 * 1024)).toFixed(2);
}

function secondsConveter(seconds) {
  let days = Math.floor(seconds / (3600 * 24));
  let hours = Math.floor((seconds % (3600 * 24)) / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let secs = Math.floor(seconds % 60);
  let time = "";
  if (days > 0) {
    time += days + "d ";
  }
  if (hours > 0) {
    time += hours + "h ";
  }
  if (minutes > 0) {
    time += minutes + "m ";
  }
  if (secs > 0) {
    time += secs + "s ";
  }
  return time;
}

