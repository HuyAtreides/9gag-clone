import moment from 'moment';

export type UnitOfTimeDiff =
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'months'
  | 'years';

type UnitOfTimeDiffDisplay = {
  singular: string;
  plural: string;
};

const unitOfTimeDiffs: UnitOfTimeDiff[] = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
];

const unitOfTimeDiffToDisplayMap: Record<UnitOfTimeDiff, UnitOfTimeDiffDisplay> = {
  seconds: {
    singular: 'Second Ago',
    plural: 'Seconds Ago',
  },
  days: {
    singular: 'Day Ago',
    plural: 'Days Ago',
  },
  hours: {
    singular: 'Hour Ago',
    plural: 'Hours Ago',
  },
  weeks: {
    singular: 'Week Ago',
    plural: 'Weeks Ago',
  },
  minutes: {
    singular: 'Minute Ago',
    plural: 'Minutes Ago',
  },
  months: {
    singular: 'Month Ago',
    plural: 'Months Ago',
  },
  years: {
    singular: 'Year Ago',
    plural: 'Years Ago',
  },
};

export function timeDiffFromToday(date: Date): string {
  for (const unitOfTime of unitOfTimeDiffs) {
    const diff = calculateDiffFromToday(date, unitOfTime);
    if (diff <= 0) {
      continue;
    }

    if (diff === 1) {
      return `${diff} ${unitOfTimeDiffToDisplayMap[unitOfTime].singular}`;
    }

    return `${diff} ${unitOfTimeDiffToDisplayMap[unitOfTime].plural}`;
  }

  return 'Now';
}

function calculateDiffFromToday(date: Date, unitOfTimeDiff: UnitOfTimeDiff) {
  const today = new Date();
  const moment1 = moment(date);
  const moment2 = moment(today);

  return moment2.diff(moment1, unitOfTimeDiff);
}
