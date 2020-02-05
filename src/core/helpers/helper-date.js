import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

export default dayjs;

// Clock
export const getDate = () => {
  const date = dayjs().format('MMM DD h:mm:ss A');
  return date;
};

export const getDateHour = () => {
  const date = dayjs().format('MMM DD h:mm A');
  return date;
};
