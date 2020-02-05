export function timeConvert(n) {

  const d = Math.floor(n/1440); // 60*24
  const h = Math.floor((n-(d*1440))/60);
  const m = Math.round(n%60);
  console.log(n + " minutes = " + h + " hour(s) and " + m + " minute(s)." + d) ;
  this.setState({
      daysCounter: d,
      hoursCounter: h,
      minutesCounter: m,
    })
  }