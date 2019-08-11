
/**
 *
 *
 * @param {Date} origTime Original Date to be parsed
 * @returns {object.<string, string>} elapsed Contains elapsed day, hours, minute, formatted
 */
function timeElapsed(origTime) {
  const now = Date.now();
  const origDate = new Date(origTime);
  const elapsed = now - origDate;
  let formatted = '';
  if (elapsed < 60000) {
    formatted = `${new Date(elapsed).getUTCSeconds()}s`;
  } else if (elapsed < 3600000) {
    formatted = `${new Date(elapsed).getUTCMinutes()}m`;
  } else if (elapsed < 86400000) {
    formatted = `${new Date(elapsed).getUTCHours()}h${new Date(elapsed).getUTCMinutes()}m`;
  } else if (elapsed < 259200000) {
    formatted = `${new Date(elapsed).getUTCDate()}d${new Date(elapsed).getUTCHours()}h`;
  } else {
    const options = {
      year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false,
    };
    formatted = origDate.toLocaleString('en-CA', options).replace(',', '');
  }
  return {
    day: new Date(elapsed).getUTCDate(),
    hours: new Date(elapsed).getUTCHours(),
    minute: new Date(elapsed).getUTCMinutes(),
    formatted,
  };
}

export default timeElapsed;
