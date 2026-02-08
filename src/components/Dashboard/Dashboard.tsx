import { useEffect, useState } from "react";
import { Reservation } from "./Reservation";
import Capacity from "./Capacity";
import ParkingForm from "./ParkingForm";
import { parkingLots } from "../../data/parkingSystem";

export type ParkingEvent = {
  id: string;
  name: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  spots: number;
  zone: string;
  lotId: string;
};

const EVENTS_STORAGE_KEY = "parking_events_v1";

function uid() {
  return `${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function safeParseEvents(raw: string | null): ParkingEvent[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((e: any) => e && typeof e.id === "string");
  } catch {
    return [];
  }
}

export const Dashboard = () => {
  const [events, setEvents] = useState<ParkingEvent[]>(() => {
    return safeParseEvents(localStorage.getItem(EVENTS_STORAGE_KEY));
  });

  const handleCreateEvent = (newEvent: Omit<ParkingEvent, "id">) => {
    setEvents((prev) => [...prev, { ...newEvent, id: uid() }]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  useEffect(() => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== EVENTS_STORAGE_KEY) return;
      setEvents(safeParseEvents(e.newValue));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className='max-w-6xl space-y-6 lg:h-[calc(100vh-2rem)] lg:min-h-0'>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 lg:grid-rows-[auto_minmax(0,1fr)] lg:h-full lg:min-h-0'>
        <ParkingForm onCreate={handleCreateEvent} />
        <Capacity events={events} parkingLots={parkingLots} />

        <div className='lg:col-span-2 lg:min-h-0'>
          <Reservation
            events={events}
            parkingLots={parkingLots}
            onDeleteEvent={handleDeleteEvent}
          />
        </div>
      </div>
    </div>
  );
};