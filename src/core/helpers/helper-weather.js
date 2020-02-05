/* eslint-disable no-bitwise */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import SunCalc from 'suncalc';
import dayjs from './helper-date';

function fromDate(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function toDate(julian) {
  return new Date((julian - 2440587.5) * 86400000);
}

// Phases of the moon & precision
const NEW = 0;
const FIRST = 1;
const FULL = 2;
const LAST = 3;
const PHASE_MASK = 3;

// Astronomical Constants
// JDN stands for Julian Day Number
// Angles here are in degrees
// 1980 January 0.0 in JDN
// XXX: DateTime(1980).jdn yields 2444239.5 -- which one is right?
// XXX: even though 2444239.5 is correct for the 1 Jan 1980, 2444238.5 gives
// better accuracy results... possibly somebody chose all of the below
// constants based on the wrong epoch?
const EPOCH = 2444238.5;

// Ecliptic longitude of the Sun at epoch 1980.0
const ECLIPTIC_LONGITUDE_EPOCH = 278.833540;

// Ecliptic longitude of the Sun at perigee
const ECLIPTIC_LONGITUDE_PERIGEE = 282.596403;

// Eccentricity of Earth's orbit
const ECCENTRICITY = 0.016718;

// Semi-major axis of Earth's orbit, in kilometers
const SUN_SMAXIS = 1.49585e8;

// Sun's angular size, in degrees, at semi-major axis distance
const SUN_ANGULAR_SIZE_SMAXIS = 0.533128;

// Elements of the Moon's orbit, epoch 1980.0
// Moon's mean longitude at the epoch
const MOON_MEAN_LONGITUDE_EPOCH = 64.975464;

// Mean longitude of the perigee at the epoch
const MOON_MEAN_PERIGEE_EPOCH = 349.383063;

// Eccentricity of the Moon's orbit
const MOON_ECCENTRICITY = 0.054900;

// Semi-major axis of the Moon's orbit, in kilometers
const MOON_SMAXIS = 384401.0;

// MOON_SMAXIS premultiplied by the angular size of the Moon from the Earth
const MOON_ANGULAR_SIZE_SMAXIS = MOON_SMAXIS * 0.5181;

// Synodic month (new Moon to new Moon), in days
const SYNODIC_MONTH = 29.53058868;

function fixangle(a) {
  return a - 360.0 * Math.floor(a / 360.0);
}

/**
 * Convert degrees to radians
 * @param  {Number} d Angle in degrees
 * @return {Number}   Angle in radians
 */
function torad(d) {
  return (Math.PI / 180.0) * d;
}

/**
 * Convert radians to degrees
 * @param  {Number} r Angle in radians
 * @return {Number}   Angle in degrees
 */
function todeg(r) {
  return (180.0 / Math.PI) * r;
}

function dsin(d) {
  return Math.sin(torad(d));
}

function dcos(d) {
  return Math.cos(torad(d));
}

/**
 * Solve the equation of Kepler.
 */
function kepler(m, ecc) {
  const epsilon = 1e-6;

  m = torad(m);
  let e = m;
  while (1) {
    const delta = e - ecc * Math.sin(e) - m;
    e -= delta / (1.0 - ecc * Math.cos(e));

    if (Math.abs(delta) <= epsilon) {
      break;
    }
  }

  return e;
}

/**
 * Finds the phase information for specific date.
 * @param  {Date} phase_date Date to get phase information of.
 * @return {Object}          Phase data
 */
export function phase(phase_date) {
  if (!phase_date) {
    phase_date = new Date();
  }
  phase_date = fromDate(phase_date);

  const day = phase_date - EPOCH;

  // calculate sun position
  const sun_mean_anomaly = (360.0 / 365.2422) * day
    + (ECLIPTIC_LONGITUDE_EPOCH - ECLIPTIC_LONGITUDE_PERIGEE);
  const sun_true_anomaly = 2 * todeg(Math.atan(
    Math.sqrt((1.0 + ECCENTRICITY) / (1.0 - ECCENTRICITY))
    * Math.tan(0.5 * kepler(sun_mean_anomaly, ECCENTRICITY)),
  ));
  const sun_ecliptic_longitude = ECLIPTIC_LONGITUDE_PERIGEE + sun_true_anomaly;
  const sun_orbital_distance_factor = (1 + ECCENTRICITY * dcos(sun_true_anomaly))
    / (1 - ECCENTRICITY * ECCENTRICITY);

  // calculate moon position
  const moon_mean_longitude = MOON_MEAN_LONGITUDE_EPOCH + 13.1763966 * day;
  const moon_mean_anomaly = moon_mean_longitude - 0.1114041 * day - MOON_MEAN_PERIGEE_EPOCH;
  const moon_evection = 1.2739 * dsin(
    2 * (moon_mean_longitude - sun_ecliptic_longitude) - moon_mean_anomaly,
  );
  const moon_annual_equation = 0.1858 * dsin(sun_mean_anomaly);
  // XXX: what is the proper name for this value?
  const moon_mp = moon_mean_anomaly
    + moon_evection
    - moon_annual_equation
    - 0.37 * dsin(sun_mean_anomaly);
  const moon_equation_center_correction = 6.2886 * dsin(moon_mp);
  const moon_corrected_longitude = moon_mean_longitude
    + moon_evection
    + moon_equation_center_correction
    - moon_annual_equation
    + 0.214 * dsin(2.0 * moon_mp);
  const moon_age = fixangle(
    moon_corrected_longitude
    - sun_ecliptic_longitude
    + 0.6583 * dsin(
      2 * (moon_corrected_longitude - sun_ecliptic_longitude),
    ),
  );
  const moon_distance = (MOON_SMAXIS * (1.0 - MOON_ECCENTRICITY * MOON_ECCENTRICITY))
    / (1.0 + MOON_ECCENTRICITY * dcos(moon_mp + moon_equation_center_correction));

  return {
    phase: (1.0 / 360.0) * moon_age,
    illuminated: 0.5 * (1.0 - dcos(moon_age)),
    age: (SYNODIC_MONTH / 360.0) * moon_age,
    distance: moon_distance,
    angular_diameter: MOON_ANGULAR_SIZE_SMAXIS / moon_distance,
    sun_distance: SUN_SMAXIS / sun_orbital_distance_factor,
    sun_angular_diameter: SUN_ANGULAR_SIZE_SMAXIS * sun_orbital_distance_factor,
  };
}

/**
 * Calculates time of the mean new Moon for a given base date.
 * This argument K to this function is the precomputed synodic month
 * index, given by:
 *   K = (year - 1900) * 12.3685
 * where year is expressed as a year and fractional year.
 * @param  {Date} sdate   Start date
 * @param  {[type]} k     [description]
 * @return {[type]}       [description]
 */
function meanphase(sdate, k) {
  // Time in Julian centuries from 1900 January 12 noon UTC
  const delta_t = (sdate - -2208945600000.0) / 86400000.0;
  const t = delta_t / 36525;
  return 2415020.75933
    + SYNODIC_MONTH * k
    + (0.0001178 - 0.000000155 * t) * t * t
    + 0.00033 * dsin(166.56 + (132.87 - 0.009173 * t) * t);
}

/**
 * Given a K value used to determine the mean phase of the new moon, and a
 * phase selector (0, 1, 2, 3), obtain the true, corrected phase time.
 * @param  {[type]} k      [description]
 * @param  {[type]} tphase [description]
 * @return {[type]}        [description]
 */
function truephase(k, tphase) {
  // restrict tphase to (0, 1, 2, 3)
  tphase &= PHASE_MASK;

  // add phase to new moon time
  k += 0.25 * tphase;

  // Time in Julian centuries from 1900 January 0.5
  const t = (1.0 / 1236.85) * k;

  // Mean time of phase
  let pt = 2415020.75933
    + SYNODIC_MONTH * k
    + (0.0001178 - 0.000000155 * t) * t * t
    + 0.00033 * dsin(166.56 + (132.87 - 0.009173 * t) * t);

  // Sun's mean anomaly
  const m = 359.2242 + 29.10535608 * k - (0.0000333 - 0.00000347 * t) * t * t;

  // Moon's mean anomaly
  const mprime = 306.0253 + 385.81691806 * k + (0.0107306 + 0.00001236 * t) * t * t;

  // Moon's argument of latitude
  const f = 21.2964 + 390.67050646 * k - (0.0016528 - 0.00000239 * t) * t * t;

  // use different correction equations depending on the phase being sought
  switch (tphase) {
    // new and full moon use one correction
    case NEW:
    case FULL: {
      pt += (0.1734 - 0.000393 * t) * dsin(m)
        + 0.0021 * dsin(2 * m)
        - 0.4068 * dsin(mprime)
        + 0.0161 * dsin(2 * mprime)
        - 0.0004 * dsin(3 * mprime)
        + 0.0104 * dsin(2 * f)
        - 0.0051 * dsin(m + mprime)
        - 0.0074 * dsin(m - mprime)
        + 0.0004 * dsin(2 * f + m)
        - 0.0004 * dsin(2 * f - m)
        - 0.0006 * dsin(2 * f + mprime)
        + 0.0010 * dsin(2 * f - mprime)
        + 0.0005 * dsin(m + 2 * mprime);
      break;
    }
    // first and last quarter moon use a different correction
    case FIRST:
    case LAST: {
      pt += (0.1721 - 0.0004 * t) * dsin(m)
        + 0.0021 * dsin(2 * m)
        - 0.6280 * dsin(mprime)
        + 0.0089 * dsin(2 * mprime)
        - 0.0004 * dsin(3 * mprime)
        + 0.0079 * dsin(2 * f)
        - 0.0119 * dsin(m + mprime)
        - 0.0047 * dsin(m - mprime)
        + 0.0003 * dsin(2 * f + m)
        - 0.0004 * dsin(2 * f - m)
        - 0.0006 * dsin(2 * f + mprime)
        + 0.0021 * dsin(2 * f - mprime)
        + 0.0003 * dsin(m + 2 * mprime)
        + 0.0004 * dsin(m - 2 * mprime)
        - 0.0003 * dsin(2 * m + mprime);

      // the sign of the last term depends on whether we're looking for a first
      // or last quarter moon!
      const sign = (tphase < FULL) ? +1 : -1;
      pt += sign * (0.0028 - 0.0004 * dcos(m) + 0.0003 * dcos(mprime));

      break;
    }
    default: {
      break;
    }
  }

  return toDate(pt);
}

/**
 * Find time of phases of the moon which surround the current date.
 * Five phases are found, starting and ending with the new moons
 * which bound the current lunation.
 * @param  {Date} sdate Date to start hunting from (defaults to current date)
 * @return {Object}     Object containing recent past and future phases
 */
export function phaseHunt(sdate) {
  if (!sdate) {
    sdate = new Date();
  }

  let adate = new Date(sdate.getTime() - (45 * 86400000)); // 45 days prior
  let k1 = Math.floor(12.3685 * (adate.getFullYear() + (1.0 / 12.0) * adate.getMonth() - 1900));
  let nt1 = meanphase(adate.getTime(), k1);

  sdate = fromDate(sdate);
  adate = nt1 + SYNODIC_MONTH;
  let k2 = k1 + 1;
  let nt2 = meanphase(adate, k2);
  while (nt1 > sdate || sdate >= nt2) {
    adate += SYNODIC_MONTH;
    k1 += 1;
    k2 += 1;
    nt1 = nt2;
    nt2 = meanphase(adate, k2);
  }

  return {
    new_date: truephase(k1, NEW),
    q1_date: truephase(k1, FIRST),
    full_date: truephase(k1, FULL),
    q3_date: truephase(k1, LAST),
    nextnew_date: truephase(k2, NEW),
  };
}

export function phaseRange(start, end, phas) {
  start = start.getTime();
  end = end.getTime();

  const t = start - 45 * 86400000;

  let k;
  {
    const d = new Date(t);
    k = Math.floor(12.3685 * (d.getFullYear() + (1.0 / 12.0) * d.getMonth() - 1900));
  }

  let date = truephase(k, phas);
  // skip every phase before starting date
  while (date.getTime() < start) {
    k += 1;
    date = truephase(k, phas);
  }
  // add every phase before (or on!) ending date to a list, and return it
  const list = [];
  while (date.getTime() <= end) {
    list.push(date);
    k += 1;
    date = truephase(k, phas);
  }
  return list;
}

export const PHASE_NEW = NEW;
export const PHASE_FIRST = FIRST;
export const PHASE_FULL = FULL;
export const PHASE_LAST = LAST;


const SUNPHASES = {
  dawn: 'amanecer',
  dusk: 'atardecer',
  goldenHour: 'hora dorada',
  goldenHourEnd: 'hora dorada (fin)',
  nadir: 'medianoche solar',
  nauticalDawn: 'amanecer náutico',
  nauticalDusk: 'atardecer náutico',
  night: 'noche',
  nightEnd: 'noche (fin)',
  solarNoon: 'mediodía solar',
  sunrise: 'amanecer',
  sunriseEnd: 'amanecer (fin)',
  sunset: 'puesta de sol',
  sunsetStart: 'puesta de sol',
};

export const getWeatherIcon = (code, night) => {
  switch (code) {
    case 200: // thunderstorm with light rain
    case 201: // thunderstorm with rain
    case 202: // thunderstorm with heavy rain
    case 210: // light thunderstorm
    case 211: // thunderstorm
    case 212: // heavy thunderstorm
    case 221: // ragged thunderstorm
    case 230: // thunderstorm with light drizzle
    case 231: // thunderstorm with drizzle
    case 232: // thunderstorm with heavy drizzle
      if (!night) {
        // Daytime
        return 'wi wi-day-thunderstorm';
      }
      // Nighttime
      return 'wi wi-night-alt-thunderstorm';


    case 300: // light intensity drizzle
    case 301: // drizzle
    case 302: // heavy intensity drizzle
    case 310: // light intensity drizzle rain
    case 311: // drizzle rain
    case 312: // heavy intensity drizzle rain
    case 313: // shower rain and drizzle
    case 314: // heavy shower rain and drizzle
    case 321: // shower drizzle
      if (!night) {
        // Daytime
        return 'wi wi-day-showers';
      }
      // Nighttime
      return 'wi wi-night-alt-showers';


    case 500: // light rain
    case 501: // moderate rain
    case 502: // heavy intensity rain
    case 503: // very heavy rain
    case 504: // extreme rain
    case 511: // freezing rain
    case 520: // light intensity shower rain
    case 521: // shower rain
    case 522: // heavy intensity shower rain
    case 531: // ragged shower rain
      if (!night) {
        return 'wi wi-day-rain';
      }
      return 'wi wi-night-alt-rain';


    case 600: // light snow
    case 601: // snow
    case 602: // heavy snow
    case 615: // light rain and snow
    case 616: // rain and snow
    case 620: // light shower snow
    case 621: // shower snow
    case 622: // heavy shower snow
      if (!night) {
        return 'wi wi-day-snow';
      }
      return 'wi wi-night-alt-snow';


    case 611: // sleet
    case 612: // shower sleet
      if (!night) {
        return 'wi wi-day-sleet';
      }
      return 'wi wi-night-alt-sleet';


    case 701: // mist
    case 721: // haze
    case 741: // fog
      if (!night) {
        return 'wi wi-day-fog';
      }
      return 'wi wi-night-fog';

    case 711: // smoke
      return 'wi wi-smog';

    case 731: // sand, dust whirls
    case 751: // sand
      return 'wi wi-sandstorm';

    case 761: // dust
      return 'wi wi-dust';

    case 762: // volcanic ash
      return 'wi wi-volcano';

    case 771: // squalls
    case 901: // tropical storm
    case 960: // storm
    case 961: // violent storm
      return 'wi wi-thunderstorm';

    case 781: // tornado
    case 900: // tornado
      return 'wi wi-tornado';

    case 800: // clear sky
    case 951: // calm
      if (!night) {
        return 'wi wi-day-sunny';
      }
      return 'wi wi-night-clear';


    case 801: // few clouds
    case 802: // scattered clouds
    case 803: // broken clouds
    case 804: // overcast clouds
      if (!night) {
        return 'wi wi-day-cloudy';
      }
      return 'wi wi-night-alt-cloudy';


    case 902: // hurricane
    case 962: // hurricane
      return 'wi wi-hurricane';

    case 903: // cold
      return 'wi wi-thermometer-exterior';

    case 904: // hot
      return 'wi wi-thermometer';

    case 905: // windy
    case 952: // light breeze
    case 953: // gentle breeze
    case 954: // moderate breeze
    case 955: // fresh breeze
    case 956: // strong breeze
      return 'wi wi-windy';

    case 906: // hail
      return 'wi wi-hail';

    case 957: // high wind, near gale
    case 958: // gale
    case 959: // severe gale
      return 'wi wi-strong-wind';
    default:
      return '';
  }
};

// End Clock

const formatHour = s => s.format('h:mm A');
const formatDay = s => s.format('ddd DD');
const formatDate = s => s.format('MMM DD h:mm A');

export const getWeatherDateObj = (unix) => {
  // console.log(new Date(unix * 1000));
  const date = dayjs.unix(unix);
  return {
    hour: formatHour(date),
    day: formatDay(date),
  };
};

export const getEarthPhaseObj = (times) => {
  // console.log(new Date(date * 1000));
  const sunrise = dayjs(times.sunrise);
  const sunset = dayjs(times.sunset);
  const nadir = dayjs(times.nadir);
  const solarNoon = dayjs(times.solarNoon);
  return {
    sunrise: {
      phase: 0.25,
      name: 'Amanecer',
      hour: formatHour(sunrise),
      day: formatDay(sunrise),
      date: formatDate(sunrise),
      id: 'TierraAmanecer',
    },
    sunset: {
      phase: 0.75,
      name: 'Ocaso',
      hour: formatHour(sunset),
      day: formatDay(sunset),
      date: formatDate(sunset),
      id: 'TierraOcaso',
    },
    nadir: {
      phase: 0.0,
      name: 'Media Noche',
      hour: formatHour(nadir),
      day: formatDay(nadir),
      date: formatDate(nadir),
      id: 'TierraMedia',
    },
    solarNoon: {
      phase: 0.5,
      name: 'Medio Día',
      hour: formatHour(solarNoon),
      day: formatDay(solarNoon),
      date: formatDate(solarNoon),
      id: 'TierraMedio',
    },
  };
};


export const getMoonPhaseObj = (recentPhases) => {
  const new_date = dayjs(new Date(recentPhases.new_date));
  const q1_date = dayjs(new Date(recentPhases.q1_date));
  const full_date = dayjs(new Date(recentPhases.full_date));
  const q3_date = dayjs(new Date(recentPhases.q3_date));
  const nextnew_date = dayjs(new Date(recentPhases.nextnew_date));
  return {
    new_date: {
      phase: 0.0,
      name: 'Luna Nueva',
      hour: formatHour(new_date),
      day: formatDay(new_date),
      date: formatDate(new_date),
      id: 'LunaNueva',
    },
    q1_date: {
      phase: 0.25,
      name: 'Creciente',
      hour: formatHour(q1_date),
      day: formatDay(q1_date),
      date: formatDate(q1_date),
      id: 'Creciente',
    },
    full_date: {
      phase: 0.5,
      name: 'Luna Llena',
      hour: formatHour(full_date),
      day: formatDay(full_date),
      date: formatDate(full_date),
      id: 'LunaLlena',
    },
    q3_date: {
      phase: 0.75,
      name: 'Menguante',
      hour: formatHour(q3_date),
      day: formatDay(q3_date),
      date: formatDate(q3_date),
      id: 'Menguante',
    },
    nextnew_date: {
      phase: 0.0,
      name: 'Luna Nueva',
      hour: formatHour(nextnew_date),
      day: formatDay(nextnew_date),
      date: formatDate(nextnew_date),
      id: 'LunaNueva2',
    },
  };
};

export const getMoonPhaseName = (moonPhase) => {
  let moonName = '';
  if (moonPhase <= 0.0625 || moonPhase > 0.9375) {
    moonName = 'Luna Nueva';
  } else if (moonPhase <= 0.1875) {
    moonName = 'Creciente';
  } else if (moonPhase <= 0.3125) {
    moonName = 'Creciente';
  } else if (moonPhase <= 0.4375) {
    moonName = 'Creciente';
  } else if (moonPhase <= 0.5625) {
    moonName = 'Luna Llena';
  } else if (moonPhase <= 0.6875) {
    moonName = 'Menguante';
  } else if (moonPhase <= 0.8125) {
    moonName = 'Menguante';
  } else if (moonPhase <= 0.9375) {
    moonName = 'Menguante';
  }
  return moonName;
};

export const getDOY = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const end = new Date(now.getFullYear() + 1, 0, 0);
  const diffs = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const diffend = (end - now) + ((now.getTimezoneOffset() - end.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const elapsed = (diffs / oneDay).toFixed(2);
  const remaining = (diffend / oneDay).toFixed(2);
  return {
    elapsed,
    remaining,
  };
};

export const getEarthName = (sunToday, sunTomorrow, now = new Date()) => {
  const todaySunTimes = Object.keys(sunToday).map((key) => {
    const id = key;
    const date = sunToday[key];
    return {
      id,
      date,
    };
  });
  const tomorrowSunTimes = Object.keys(sunToday).map((key) => {
    const id = key;
    const date = sunToday[key];
    return {
      id,
      date,
    };
  });

  const days = [...todaySunTimes, ...tomorrowSunTimes];

  let bestDate = '';
  let bestDiff = -(new Date(0, 0, 0)).valueOf();
  let currDiff = 0;
  // let i;

  days.map((obj) => {
    currDiff = Math.abs(obj.date - now);
    if (currDiff < bestDiff) {
      bestDate = SUNPHASES[obj.id];
      bestDiff = currDiff;
    }
    return false;
  });

  return bestDate;
};

export const getSunTimes = (now = new Date()) => {
  const today = now;
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const sunTimesToday = SunCalc.getTimes(today, 32.520666, -117.021315);
  const sunTimesTomorrow = SunCalc.getTimes(tomorrow, 32.520666, -117.021315);

  const moonPhase = phase();
  const recentPhases = phaseHunt();
  const earthPhase = getDOY();

  return {
    earthPhase,
    earthPhases: getEarthPhaseObj(sunTimesToday),
    earthCurrent: (today.getHours()) / 24,
    earthPhaseName: getEarthName(sunTimesToday, sunTimesTomorrow),

    moonPhase,
    moonPhases: getMoonPhaseObj(recentPhases),
    moonCurrent: moonPhase.phase,
    moonPhaseName: getMoonPhaseName(moonPhase.phase),
  };
};
