export function color(rating) {
  if (rating >= 0 && rating < 1200) {
    return "#808080";
  } else if (rating >= 1200 && rating < 1400) {
    return "#008000";
  } else if (rating >= 1400 && rating < 1600) {
    return "#03A89E";
  } else if (rating >= 1600 && rating < 1900) {
    return "#0000FF";
  } else if (rating >= 1900 && rating < 2100) {
    return "#AA00AA";
  } else if (rating >= 2100 && rating < 2300) {
    return "#FF8C00";
  } else if (rating >= 2300 && rating < 2400) {
    return "#FF8C00";
  } else if (rating >= 2400 && rating < 2600) {
    return "#FF0000";
  } else if (rating >= 2600) {
    return "#FF0000";
  } else {
    return "#ffffff";
  }
}
