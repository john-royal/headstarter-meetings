import { ChangeEvent, useEffect, useState } from 'react';
import { LoaderFunction, useLoaderData } from 'react-router-dom';
import { useAuth } from 'src/lib/auth';

import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import Chip from '@mui/joy/Chip';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';

import CheckIcon from '@mui/icons-material/Check';
import SyncIcon from '@mui/icons-material/Sync';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array(24)
  .fill(0)
  .map((_, hour) => {
    return {
      hour,
      formattedHour: hour < 12 ? `${hour} am` : hour === 12 ? '12 pm' : `${hour - 12} pm`,
    };
  })
  .filter(({ hour }) => hour > 5);

enum Status {
  SAVED,
  PENDING,
  SAVING,
}

function AvailabilityForm() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<number[][]>(useLoaderData() as number[][]);
  const [status, setStatus] = useState(Status.SAVED);
  const debounced = useDebounce(availability, 1000);

  const changeHandler = (day: number, hour: number) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setStatus(Status.PENDING);
      setAvailability((prev) => {
        const next = [...prev];
        next[day][hour] = e.target.checked ? 1 : 0;
        console.log(
          `Updated ${DAYS_OF_WEEK[day]} ${HOURS[hour].formattedHour} to ${next[day][hour]}`,
        );
        return next;
      });
    };
  };

  useEffect(() => {
    if (user == null) return;

    setStatus(Status.SAVING);
    fetch(`/api/users/${user._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availability: debounced }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save availability');
        }
        setStatus(Status.SAVED);
      })
      .catch((error) => {
        console.error(error);
        setStatus(Status.PENDING);
      });
  }, [user, debounced]);

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
          {HOURS.map(({ hour, formattedHour }) => (
            <tr key={hour}>
              <td>{formattedHour}</td>

              {DAYS_OF_WEEK.map((dayText, day) => (
                <td key={`${day} ${hour}`}>
                  <Checkbox
                    aria-label={`${dayText} ${formattedHour}`}
                    checked={availability[day][hour] === 1}
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

const loadAvailability: LoaderFunction = async () => {
  const response = await fetch('/api/sessions');
  const json = await response.json();
  return json.user.availability;
};

export default AvailabilityForm;
export { loadAvailability };

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
