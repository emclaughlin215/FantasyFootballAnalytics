const _second: number = 1000;
const _minute: number = _second * 60;
const _hour: number = _minute * 60;
const _day: number = _hour * 24;

export const getDateDiffUnix = (date_end: Date, date_start?: Date) => {
    if (date_start === undefined || date_start === null) {
        date_start = new Date();
    }
    return date_end.getTime() - date_start.getTime()
}

export const formatDateDiffFromUnix = (milliseconds: number) => {

    const days = Math.floor(milliseconds / _day);
    const hours = Math.floor((milliseconds % _day) / _hour);
    const minutes = Math.floor((milliseconds % _hour) / _minute);
    const seconds = Math.floor((milliseconds % _minute) / _second);

    let countdown: string = '';
    countdown += days + (days !== 1 ? ' Days, ' : ' Day, ');
    countdown += hours + (hours !== 1 ? ' Hours, ' : ' Hour, ');
    countdown += minutes + (minutes !== 1 ? ' Minutes, ' : ' Minute, ');
    countdown += seconds + (seconds !== 1 ? ' Seconds.' : ' Second.');

    return countdown;
}

export const getCountdownIntent = (milliseconds: number) => {

    let days = Math.floor(milliseconds / _day);
    let hours = Math.floor((milliseconds % _day) / _hour);

    if (days === 0) {
      if (hours <= 6) {
        return 'render-intent-danger';
      } else {
        return 'render-intent-warning';
      }
    } else {
      return 'render-intent-success';
    }
  }