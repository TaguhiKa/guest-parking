import type { ParkingEvent } from "./Dashboard";
import type { ParkingLot } from "../../data/parkingSystem";

type EventCardProps = {
  events: ParkingEvent[];
  parkingLots: ParkingLot[];
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
  return <span className="text-secondary">{status}</span>;
}

export const Reservation = ({ events }: EventCardProps) => {
  const activeEvents = events.filter((e) => getStatus(e) !== "Closed");

  return (
    <div className="bg-white shadow flex flex-col justify-between p-4 h-full rounded">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-semibold text-primary">Events</h2>
        </div>

        <div className="hidden md:flex bg-primary h-12 w-full px-4 rounded items-center">
          <div className="grid w-full grid-cols-4 gap-4">
            <p className="text-white font-medium">Event Name</p>
            <p className="text-white font-medium">Date &amp; Time</p>
            <p className="text-white font-medium">Capacity</p>
            <p className="text-white font-medium">Status</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {activeEvents.length === 0 ? (
            <div className="flex items-center w-full rounded border border-neutral p-4 text-[#666666]">
              No events yet.
            </div>
          ) : (
            activeEvents.map((e) => {
              const status = getStatus(e);

              return (
                <div
                  key={e.id}
                  className="w-full rounded border border-neutral text-secondary p-4"
                >
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-4 md:items-center">
                    <p className="text-xs font-semibold text-primary md:hidden">
                      Event Name
                    </p>
                    <p className="truncate md:col-auto col-span-1">{e.name}</p>

                    <p className="text-xs font-semibold text-primary md:hidden">
                      Date &amp; Time
                    </p>
                    <p className="truncate">
                      {formatDate(e.date)} · {e.startTime} - {e.endTime}
                    </p>

                    <p className="text-xs font-semibold text-primary md:hidden">
                      Capacity
                    </p>
                    <p>{e.spots}</p>

                    <p className="text-xs font-semibold text-primary md:hidden">
                      Status
                    </p>
                    <div className="flex md:justify-start">
                      <StatusBadge status={status} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};