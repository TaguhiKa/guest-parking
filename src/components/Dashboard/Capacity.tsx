import { useEffect, useState } from "react";
import { MdLocalParking, MdLock } from 'react-icons/md'

import type { ParkingEvent } from "./Dashboard";
import type { ParkingLot } from "../../data/parkingSystem";
import {
  getAvailableForLot,
  getReservedForLot,
} from "../../data/parkingSystem";

function buildLocalDate(date: string, time: string) {
  return new Date(`${date}T${time}`);
}

function getStatus(e: ParkingEvent, now: Date) {
  const start = buildLocalDate(e.date, e.startTime);
  const end = buildLocalDate(e.date, e.endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
    return "Upcoming";
  if (now < start) return "Upcoming";
  if (now > end) return "Closed";
  return "Ongoing";
}

export default function Capacity({
  events,
  parkingLots,
}: {
  events: ParkingEvent[];
  parkingLots: ParkingLot[];
}) {
  const lot = parkingLots[0];

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const ongoingEvents = events.filter((e) => getStatus(e, now) === "Ongoing");
  const isLive = ongoingEvents.length > 0;

  const holds = ongoingEvents.map((e) => ({
    lotId: e.lotId,
    spots: e.spots,
  }));

  const reserved = lot ? getReservedForLot(holds, lot.id) : 0;
  const available = lot ? getAvailableForLot(holds, lot.id) : 0;

  return (
    <div className='w-full min-w-0 px-2 sm:px-0'>
      <div className='w-full h-full max-w-none rounded-lg bg-white p-4 shadow'>
        <div className='flex items-center justify-between gap-4'>
          <h1 className='text-xl sm:text-2xl font-semibold text-primary'>
            Parking Capacity
          </h1>
          {isLive && (
            <button
              type='button'
              className='px-4 py-4 rounded-full bg-accent text-primary inline-flex items-center justify-center gap-2 select-none'
            >
              <span className='h-2 w-2 rounded-full bg-red-500 animate-pulse' />
              Live
            </button>
          )}
        </div>

        <div className='grid grid-cols-1 gap-4 py-2'>
          <div className='w-full rounded border border-neutral text-secondary p-4 flex items-center justify-between'>
            <div className='flex items-center gap-4 text-secondary'>
              <MdLock />
              <span>Reserved spots</span>
            </div>
            <span>
              {reserved}
            </span>
          </div>
          <div className='w-full rounded border border-neutral text-secondary p-4 flex items-center justify-between'>
            <div className='flex items-center gap-4 text-secondary'>
              <MdLocalParking />
              <span>Available spots</span>
            </div>
            <span>
              {available}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
