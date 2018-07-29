function timeElapsed(origTime) {
  const now = Date.now();
  const elapsed = now - new Date(origTime);
  let formatted = '';
  if (elapsed < 60000) {
    formatted = `${new Date(elapsed).getUTCSeconds()}s`;
  } else if (elapsed < 3600000) {
    formatted = `${new Date(elapsed).getUTCMinutes()}m`;
  } else if (elapsed < 86400000) {
    formatted = `${new Date(elapsed).getUTCHours()}h${new Date(elapsed).getUTCMinutes()}m`;
  } else {
    formatted = `${new Date(elapsed).getUTCDate()}d${new Date(elapsed).getUTCHours()}h`;
  }
  return {
    day: new Date(elapsed).getUTCDate(),
    hours: new Date(elapsed).getUTCHours(),
    minute: new Date(elapsed).getUTCMinutes(),
    formatted,
  };
}

export default timeElapsed;
