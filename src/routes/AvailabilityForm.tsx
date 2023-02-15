import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import Chip from '@mui/joy/Chip';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import { doc, setDoc } from 'firebase/firestore';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAuth } from 'src/lib/auth';
import { db } from 'src/lib/firebase';

import CheckIcon from '@mui/icons-material/Check';
import SyncIcon from '@mui/icons-material/Sync';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = (() => {
  const hours = [];
  for (let hour = 6; hour < 12; hour++) {
    hours.push(`${hour} am`);
  }
  hours.push('12 pm');
  for (let hour = 1; hour <= 10; hour++) {
    hours.push(`${hour} pm`);
  }
  return hours;
})();

const initialAvailability = (() => {
  const availability: Record<string, Record<string, boolean>> = {};
  for (const day of DAYS_OF_WEEK) {
    availability[day] = {};
    for (const hour of HOURS) {
      availability[day][hour] = false;
    }
  }
  return availability;
})();

enum Status {
  SAVED,
  PENDING,
  SAVING,
}

export default function AvailabilityForm() {
  const [availability, setAvailability] = useState(initialAvailability);
  const debouncedAvailability = useDebounce(availability, 1000);
  const [status, setStatus] = useState(Status.SAVED);
  const { user } = useAuth();

  const changeHandler = (day: string, hour: string) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setStatus(Status.PENDING);
      setAvailability((prevAvailability) => ({
        ...prevAvailability,
        [day]: {
          ...prevAvailability[day],
          [hour]: e.target.checked,
        },
      }));
    };
  };

  useEffect(() => {
    if (user == null) return;

    setStatus(Status.SAVING);
    setDoc(
      doc(db, 'users', user.id),
      {
        availability: debouncedAvailability,
      },
      { merge: true },
    )
      .then(() => {
        setStatus(Status.SAVED);
      })
      .catch((error) => {
        setStatus(Status.PENDING);
        alert(error);
      });
  }, [user, debouncedAvailability]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography level='h3' component='h1'>
          My Availability
        </Typography>

        <StatusChip status={status} />
      </Box>

      <Table>
        <thead>
          <tr>
            <th /> {/* empty cell for the hours column */}
            {DAYS_OF_WEEK.map((day) => (
              <th key={day}>{day.slice(0, 3)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map((hour) => (
            <tr key={hour}>
              <td>{hour}</td>

              {DAYS_OF_WEEK.map((day) => (
                <td key={day}>
                  <Checkbox
                    aria-label={`${day} ${hour}`}
                    checked={availability[day][hour]}
                    onChange={changeHandler(day, hour)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
}

function StatusChip({ status }: { status: Status }) {
  switch (status) {
    case Status.SAVED:
      return (
        <Chip color='primary' startDecorator={<CheckIcon />}>
          Saved
        </Chip>
      );
    case Status.PENDING:
      return (
        <Chip color='neutral' startDecorator={<SyncDisabledIcon />}>
          Not Saved
        </Chip>
      );
    case Status.SAVING:
      return (
        <Chip color='neutral' startDecorator={<SyncIcon />}>
          Saving...
        </Chip>
      );
  }
}

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
