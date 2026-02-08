export type ParkingLot = {
  id: string;
  name: string;
  capacity: number;
};

export const parkingLots: ParkingLot[] = [
  { id: "lot-a", name: "Parking 1", capacity: 20 },
];

export type EventHold = {
  lotId: string;
  spots: number;
};

export function getLotById(lotId: string): ParkingLot | undefined {
  return parkingLots.find((l) => l.id === lotId);
}

export function getReservedForLot(events: EventHold[], lotId: string): number {
  return events
    .filter((e) => e.lotId === lotId)
    .reduce((sum, e) => sum + (Number.isFinite(e.spots) ? e.spots : 0), 0);
}

export function getAvailableForLot(events: EventHold[], lotId: string): number {
  const lot = getLotById(lotId);
  if (!lot) return 0;
  const reserved = getReservedForLot(events, lotId);
  return Math.max(0, lot.capacity - reserved);
}