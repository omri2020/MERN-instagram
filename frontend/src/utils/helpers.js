export const calculateLength = (str) => {
  return str.length;
};

///// DATE FORMATTING /////

export const getMonthAndDay = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "long", day: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);
  return formattedDate;
};

export const getPassedTimeCount = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date); // difference in milliseconds
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 7) {
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks}w`;
  } else if (diffDays > 0) {
    return `${diffDays}d`;
  } else {
    // If less than a day, calculate hours
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      // If less than an hour, calculate minutes
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      if (diffMinutes > 0) {
        return `${diffMinutes}m`;
      } else {
        // If less than a minute, calculate seconds
        const diffSeconds = Math.floor(diffTime / 1000);
        return `${diffSeconds}s`;
      }
    }
  }
};

////// AUTHENTICATION //////

export const getAccessTokenFromMemory = () => {
  return localStorage.getItem("accessToken");
};
