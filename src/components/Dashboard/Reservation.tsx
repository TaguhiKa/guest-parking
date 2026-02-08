import React from "react";
import type { ParkingEvent } from "./Dashboard";
import type { ParkingLot } from "../../data/parkingSystem";

import { MdDeleteOutline } from "react-icons/md";

type EventField = {
  label: string;
  render: (event: ParkingEvent) => React.ReactNode;
};

type EventCardProps = {
  events: ParkingEvent[];
  parkingLots: ParkingLot[];
  onDeleteEvent: (id: string) => void;
};

function formatDate(isoDate: string) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}.${m}.${y}`;
}

function buildLocalDate(date: string, time: string) {
  return new Date(`${date}T${time}`);
}

type EventStatus = "Upcoming" | "Ongoing" | "Closed";

function getStatus(e: ParkingEvent): EventStatus {
  const now = new Date();
  const start = buildLocalDate(e.date, e.startTime);
  const end = buildLocalDate(e.date, e.endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
    return "Upcoming";

  if (now < start) return "Upcoming";
  if (now > end) return "Closed";
  return "Ongoing";
}

function StatusBadge({ status }: { status: EventStatus }) {
  return <span className='text-secondary'>{status}</span>;
}

const buildEventFields = (
  onDeleteEvent: (id: string) => void,
): EventField[] => [
  {
    label: "Event",
    render: (e) => (
      <div className='flex items-center justify-between gap-2 min-w-0'>
        <p className='truncate'>{e.name}</p>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to delete this event?")) {
              onDeleteEvent(e.id);
            }
          }}
          className='text-red-600 text-xl shrink-0 hover:text-red-700 md:hidden'
          type='button'
          aria-label='Delete event'
          title='Delete'
        >
          <MdDeleteOutline />
        </button>
      </div>
    ),
  },
  {
    label: "Date",
    render: (e) => <p className='truncate'>{formatDate(e.date)}</p>,
  },
  {
    label: "Time",
    render: (e) => (
      <p className='truncate'>
        {e.startTime} - {e.endTime}
      </p>
    ),
  },
  {
    label: "Capacity",
    render: (e) => <p>{e.spots}</p>,
  },
  {
    label: "Status",
    render: (e) => (
      <div className='flex md:justify-start'>
        <StatusBadge status={getStatus(e)} />
      </div>
    ),
  },
];

export const Reservation = ({ events, onDeleteEvent }: EventCardProps) => {
  const activeEvents = events.filter((e) => getStatus(e) !== "Closed");
  const eventFields = buildEventFields(onDeleteEvent);
  const cols = eventFields.length;

  return (
    <div className='bg-white shadow flex flex-col p-4 gap-2 h-full min-h-0 rounded'>
      <div className='flex items-start justify-between shrink-0' >
        <h2 className='text-2xl font-semibold text-primary'>Events</h2>
      </div>

      {activeEvents.length > 0 && (
        <div className='hidden md:flex bg-primary w-full p-4 rounded items-center shrink-0'>
          <div
            className='grid w-full gap-4'
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr)) auto`,
            }}
          >
            {eventFields.map(({ label }) => (
              <p key={label} className='text-white font-medium'>
                {label}
              </p>
            ))}
            <span />
          </div>
        </div>
      )}

      <div className='flex-1 min-h-0 overflow-y-auto py-4'>
        {activeEvents.length === 0 ? (
          <div className='flex items-center w-full rounded border border-neutral p-4 text-secondary'>
            No events yet.
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            {activeEvents.map((e) => (
              <div
                key={e.id}
                className='w-full rounded border border-neutral text-secondary p-4'
              >
                <div className='grid grid-cols-1 gap-y-4 md:gap-y-0 md:items-center'>
                  {eventFields.map(({ label, render }) => (
                    <div key={label} className='grid grid-cols-1 md:contents'>
                      <p className='text-xs font-semibold text-primary md:hidden'>
                        {label}
                      </p>
                      <div className='min-w-0 md:col-auto'>
                        {render(e)}
                      </div>
                    </div>
                  ))}
                  <div className='hidden md:flex justify-end'>
                    <button
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this event?")
                        ) {
                          onDeleteEvent(e.id);
                        }
                      }}
                      className='text-red-600 text-xl hover:text-red-700'
                      type='button'
                      aria-label='Delete event'
                      title='Delete'
                    >
                      <MdDeleteOutline />
                    </button>
                  </div>
                </div>
                <style>{`
                  @media (min-width: 768px) {
                    .md\\:items-center {
                      display: grid;
                      grid-template-columns: repeat(${cols}, minmax(0, 1fr)) auto;
                      column-gap: 1rem;
                      row-gap: 0.75rem;
                      align-items: center;
                    }
                  }
                `}</style>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};