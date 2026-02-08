import { useEffect, useRef, useState } from "react";
import { FaRegCalendar } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

import { parkingLots } from "../../data/parkingSystem";
import type { ParkingEvent } from "./Dashboard";

export default function ParkingForm({
  onCreate,
}: {
  onCreate: (event: Omit<ParkingEvent, "id">) => void;
}) {
  const today = new Date().toISOString().split("T")[0];

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [draftStart, setDraftStart] = useState("");
  const [draftEnd, setDraftEnd] = useState("");

  const [spots, setSpots] = useState<number | "">("");
  const [zone, setZone] = useState("");

  const [lotId, setLotId] = useState<string>("");
  const selectedLot = parkingLots.find((l) => l.id === lotId);
  const maxSpots = selectedLot?.capacity ?? 0;

  const dateRef = useRef<HTMLInputElement | null>(null);
  const endTimeRef = useRef<HTMLInputElement | null>(null);
  const timeWrapRef = useRef<HTMLDivElement | null>(null);

  const [timeOpen, setTimeOpen] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!timeWrapRef.current) return;
      if (!timeWrapRef.current.contains(e.target as Node)) setTimeOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  useEffect(() => {
    if (timeOpen) {
      setDraftStart(startTime);
      setDraftEnd(endTime);
    }
  }, [timeOpen]);

  function openPicker(input: HTMLInputElement | null) {
    if (!input) return;
    if (typeof (input as any).showPicker === "function")
      (input as any).showPicker();
    else input.focus();
  }

  function toLocalDateTime(d: string, t: string) {
    return new Date(`${d}T${t}`);
  }

  function formatRange(s: string, e: string) {
    if (!s && !e) return "Select time";
    if (s && !e) return `${s} — End`;
    if (!s && e) return `Start — ${e}`;
    return `${s} — ${e}`;
  }

  function ensureValidRange(nextStart: string, nextEnd: string) {
    if (!nextStart || !nextEnd) return { nextStart, nextEnd };
    if (nextEnd <= nextStart) return { nextStart, nextEnd: "" };
    return { nextStart, nextEnd };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const payload = {
      name: name.trim(),
      location: location.trim(),
      date: date.trim(),
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      spots: typeof spots === "number" && spots > 0 ? spots : 20,
      zone: zone.trim(),
      lotId: lotId.trim(),
    };

    if (!payload.name) return setError("Event name is required.");
    if (!payload.date) return setError("Date is required.");
    if (!payload.startTime) return setError("Start time is required.");
    if (!payload.endTime) return setError("End time is required.");
    if (!payload.lotId) return setError("Parking lot is required.");

    const now = new Date();
    const start = toLocalDateTime(payload.date, payload.startTime);
    const end = toLocalDateTime(payload.date, payload.endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return setError("Invalid date/time.");
    }

    if (end <= start) return setError("End time must be after start time.");
    if (start < now) return setError("Start time must be in the future.");

    onCreate(payload);

    setName("");
    setLocation("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setDraftStart("");
    setDraftEnd("");
    setSpots("");
    setZone("");
    setLotId("");
    setTimeOpen(false);
  }

  const inputBase =
    "w-full rounded bg-neutral p-4 text-secondary outline-none placeholder:text-secondary/60";

  return (
    <div className='w-full min-w-0 px-2 sm:px-0'>
      <div className='w-full h-full max-w-none rounded bg-white p-4 shadow'>
        <h1 className='text-xl sm:text-2xl font-semibold text-primary'>
          Reserve Guest Parking
        </h1>

        <form className="py-4 space-y-4" onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
            <Field label='Name'>
              <input
                type='text'
                placeholder='Event Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputBase}
              />
            </Field>

            <Field label='Location'>
              <input
                type='text'
                placeholder='Enter Location'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputBase + " p-2"}
              />
            </Field>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <Field label='Date'>
              <div className='relative'>
                <button
                  type='button'
                  onClick={() => openPicker(dateRef.current)}
                  className='w-full rounded bg-neutral p-4 text-left outline-none'
                >
                  <span
                    className={date ? "text-secondary" : "text-secondary/60"}
                  >
                    {date || "Select date"}
                  </span>
                </button>

                <input
                  ref={dateRef}
                  type='date'
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className='absolute inset-0 opacity-0 pointer-events-none'
                  tabIndex={-1}
                />

                <IconButton
                  title='Pick date'
                  className='right-2'
                  onClick={() => openPicker(dateRef.current)}
                >
                  <FaRegCalendar />
                </IconButton>
              </div>
            </Field>

            <Field label='Time'>
              <div className='relative' ref={timeWrapRef}>
                <button
                  type='button'
                  aria-label='Select time'
                  onClick={() => setTimeOpen((v) => !v)}
                  className='w-full rounded bg-neutral p-4 text-left outline-none'
                  aria-haspopup='dialog'
                  aria-expanded={timeOpen}
                >
                  <span
                    className={
                      startTime || endTime
                        ? "text-secondary"
                        : "text-secondary/60"
                    }
                  >
                    {formatRange(startTime, endTime)}
                  </span>
                </button>

                <IconButton
                  title='Pick time range'
                  className='right-2'
                  onClick={() => setTimeOpen(true)}
                >
                  <FiClock />
                </IconButton>

                {timeOpen && (
                  <div
                    className='absolute z-20 mt-2 w-full rounded bg-white p-2 shadow'
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className='grid grid-cols-2 gap-3'>
                      <label className='text-xs text-primary'>
                        <span className='mb-1 block font-medium'>Start</span>
                        <input
                          type='time'
                          value={draftStart}
                          onChange={(e) => {
                            const nextStart = e.target.value;
                            const { nextStart: s, nextEnd: en } =
                              ensureValidRange(nextStart, draftEnd);
                            setDraftStart(s);
                            setDraftEnd(en);
                            if (en === "" && endTimeRef.current) {
                              openPicker(endTimeRef.current);
                            }
                          }}
                          className='h-12 w-full rounded bg-neutral p-2 text-secondary outline-none'
                        />
                      </label>

                      <label className='text-xs text-primary'>
                        <span className='mb-1 block font-medium'>End</span>
                        <input
                          ref={endTimeRef}
                          type='time'
                          value={draftEnd}
                          min={draftStart || undefined}
                          onChange={(e) => setDraftEnd(e.target.value)}
                          className='h-12 w-full rounded bg-neutral px-2 text-secondary outline-none'
                        />
                      </label>
                    </div>

                    <div className='flex items-center justify-end gap-2'>
                      <button
                        type='button'
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDraftStart("");
                          setDraftEnd("");
                        }}
                        onClick={() => {
                          setDraftStart("");
                          setDraftEnd("");
                        }}
                        className='rounded p-2 m-2 text-sm text-secondary'
                      >
                        Clear
                      </button>

                      <button
                        type='button'
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setStartTime(draftStart);
                          setEndTime(draftEnd);
                          setTimeOpen(false);
                        }}
                        onClick={() => {
                          setStartTime(draftStart);
                          setEndTime(draftEnd);
                          setTimeOpen(false);
                        }}
                        className='rounded p-2 m-2 text-sm text-primary bg-accent '
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Field>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <Field label='Parking Lot'>
              <div className='relative'>
                <select
                  value={lotId}
                  onChange={(e) => setLotId(e.target.value)}
                  className={[
                    "w-full rounded bg-neutral p-4 appearance-none outline-none",
                    lotId ? "text-secondary" : "text-secondary/60",
                  ].join(" ")}
                >
                  <option value='' disabled>
                    Select lot
                  </option>

                  {parkingLots.map((lot) => (
                    <option
                      key={lot.id}
                      value={lot.id}
                      className='text-secondary'
                    >
                      {lot.name}
                    </option>
                  ))}
                </select>

                <IconButton
                  title='Pick lot'
                  className='right-2 pointer-events-none'
                >
                  <IoIosArrowDown />
                </IconButton>
              </div>
            </Field>

            <Field label='Parking Spots'>
              <input
                type='number'
                min={1}
                max={maxSpots || undefined}
                placeholder={maxSpots ? `${maxSpots}` : "0"}
                value={spots}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setSpots("");
                    return;
                  }
                  const value = Number(e.target.value);
                  if (Number.isNaN(value)) return;
                  setSpots(maxSpots > 0 ? Math.min(value, maxSpots) : value);
                }}
                className={inputBase}
              />

              {maxSpots > 0 && (
                <p className='mt-2 text-xs text-secondary'>
                  Maximum available spots: {maxSpots}
                </p>
              )}
            </Field>
          </div>

          {error && <p className='text-sm text-red-600'>{error}</p>}

          <button
            type='submit'
            className='p-4 w-full rounded bg-accent text-primary outline-none'
          >
            Reserve Parking
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className='block'>
      <span className='mb-2 block text-xs font-medium text-primary'>
        {label}
      </span>
      {children}
    </label>
  );
}

function IconButton({
  children,
  title,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type='button'
      title={title}
      onClick={onClick}
      className={[
        "absolute top-1/2 -translate-y-1/2",
        "inline-flex h-8 w-8 items-center justify-center rounded",
        "text-neutral-500 hover:text-neutral-700",
        "outline-none",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}