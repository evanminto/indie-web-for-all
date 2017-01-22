import moment from 'moment';

export default function timestamp(timeString, options) {
  return moment(timeString).format(options.hash.format);
}
