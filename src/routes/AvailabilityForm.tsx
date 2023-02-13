import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import { ChangeEvent, useState } from 'react';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((hour) => {
  const suffix = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 || 12;
  return `${hour12} ${suffix}`;
});

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

export default function AvailabilityForm() {
  const [availability, setAvailability] = useState(initialAvailability);

  const changeHandler = (day: string, hour: string) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setAvailability((prevAvailability) => ({
        ...prevAvailability,
        [day]: {
          ...prevAvailability[day],
          [hour]: e.target.checked,
        },
      }));
    };
  };

  return (
    <Box>
      <Typography level='h3' component='h1'>
        My Availability
      </Typography>

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
