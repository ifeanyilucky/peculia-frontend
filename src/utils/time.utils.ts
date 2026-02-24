import { format, parse, isBefore, addDays } from "date-fns";

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface DaySchedule {
  isOpen: boolean;
  slots: TimeSlot[];
}

export interface WeeklySchedule {
  schedule: {
    [key: string]: DaySchedule;
  };
}

export interface OpeningStatus {
  isOpen: boolean;
  message: string;
  status: "open" | "closed" | "closing_soon";
}

/**
 * Checks the current opening status of a provider based on their weekly schedule.
 */
export function getOpeningStatus(schedule?: WeeklySchedule): OpeningStatus {
  if (!schedule || !schedule.schedule) {
    return {
      isOpen: false,
      message: "Hours unavailable",
      status: "closed",
    };
  }

  const now = new Date();
  const dayName = format(now, "eeee").toLowerCase();
  const daySchedule = schedule.schedule[dayName];
  const currentTime = format(now, "HH:mm");

  if (
    !daySchedule ||
    !daySchedule.isOpen ||
    !daySchedule.slots ||
    daySchedule.slots.length === 0
  ) {
    return getNextOpeningMessage(schedule);
  }

  // Find the current slot or next slot today
  const currentSlot = daySchedule.slots.find(
    (slot) => currentTime >= slot.startTime && currentTime < slot.endTime,
  );

  if (currentSlot) {
    // Check if closing in less than 1 hour
    const endTime = parse(currentSlot.endTime, "HH:mm", now);
    const complexClose = isBefore(
      endTime,
      parse(format(now, "HH:mm"), "HH:mm", now),
    )
      ? addDays(endTime, 1)
      : endTime;
    const diffMinutes = (complexClose.getTime() - now.getTime()) / 60000;

    if (diffMinutes > 0 && diffMinutes < 60) {
      return {
        isOpen: true,
        message: `Open - closing in ${Math.round(diffMinutes)} mins`,
        status: "closing_soon",
      };
    }

    return {
      isOpen: true,
      message: "Open now",
      status: "open",
    };
  }

  // Check if it's before the first slot today
  const firstSlot = daySchedule.slots[0];
  if (currentTime < firstSlot.startTime) {
    return {
      isOpen: false,
      message: `Closed - opens today at ${firstSlot.startTime}`,
      status: "closed",
    };
  }

  // Otherwise, it's after the last slot today
  return getNextOpeningMessage(schedule);
}

function getNextOpeningMessage(schedule: WeeklySchedule): OpeningStatus {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const now = new Date();
  const todayIdx = days.indexOf(format(now, "eeee").toLowerCase());

  for (let i = 1; i <= 7; i++) {
    const nextIdx = (todayIdx + i) % 7;
    const nextDay = days[nextIdx];
    const nextDaySchedule = schedule.schedule[nextDay];

    if (
      nextDaySchedule &&
      nextDaySchedule.isOpen &&
      nextDaySchedule.slots &&
      nextDaySchedule.slots.length > 0
    ) {
      const dayLabel = i === 1 ? "tomorrow" : nextDay;
      const startTime = nextDaySchedule.slots[0].startTime;
      return {
        isOpen: false,
        message: `Closed - opens ${dayLabel} at ${startTime}`,
        status: "closed",
      };
    }
  }

  return {
    isOpen: false,
    message: "Closed",
    status: "closed",
  };
}
