import Check from '@mui/icons-material/Check';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
  Typography,
} from '@mui/joy';
import Alert from '@mui/joy/Alert';
import { useState } from 'react';
import { LoaderFunction, useLoaderData } from 'react-router-dom';
import { User } from 'src/lib/auth';

function ScheduleMeetingView() {
  const users = useLoaderData() as User[];

  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [attendees, setAttendees] = useState<User[]>([]);
  const [attendeesInputValue, setAttendeesInputValue] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleScheduleMeeting = () => {
    const startsAt = new Date(`${date} ${time}`);
    const endsAt = new Date(startsAt.getTime() + duration * 60 * 1000);

    const startDay = startsAt.getDay();
    const startHour = startsAt.getHours();
    const endDay = endsAt.getDay();
    const endHour = endsAt.getHours();

    // availability check
    for (const { name, email, availability } of attendees) {
      for (let day = startDay; day < endDay || day === startDay; day++) {
        for (let hour = startHour; hour < endHour || hour === startHour; hour++) {
          if (availability[day][hour] === 0) {
            setError(`${name} (${email}) is not available at this time.`);
            return;
          }
        }
      }
    }

    setError('');

    fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        startsAt,
        duration,
        attendees,
      }),
    })
      .then(async (response) => {
        console.log(await response.json());
        if (response.ok) {
          setSuccess(true);
        } else {
          setError('Something went wrong.');
        }
      })
      .catch((error) => {
        console.error(error);
        setError('Something went wrong.');
      });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography level='h3' component='h1'>
        Schedule Meeting
      </Typography>

      {error && <Alert color='danger'>{error}</Alert>}
      {success && (
        <Alert color='success' startDecorator={<Check />}>
          Your meeting has been scheduled successfully.
        </Alert>
      )}

      <form>
        <FormControl sx={{ width: 300 }}>
          <FormLabel>Topic</FormLabel>
          <Input
            type='text'
            placeholder='Topic'
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{ width: 300 }}
          />
        </FormControl>
        <FormControl sx={{ width: 300, marginTop: '20px' }}>
          <FormLabel>Date</FormLabel>
          <Input
            type='date'
            placeholder='Date'
            onChange={(e) => setDate(e.target.value)}
            sx={{ width: 300 }}
          />
        </FormControl>
        <FormControl sx={{ width: 300, marginTop: '20px' }}>
          <FormLabel>Time</FormLabel>
          <Input
            type='time'
            placeholder='Time'
            onChange={(e) => setTime(e.target.value)}
            sx={{ width: 300 }}
          />
        </FormControl>
        <FormControl sx={{ width: 300, marginTop: '20px' }}>
          <FormLabel>Duration</FormLabel>
          <Select value={duration} onChange={(_, value) => setDuration(value ?? 30)}>
            <Option value={30}>30 minutes</Option>
            <Option value={60}>1 hour</Option>
            <Option value={90}>1.5 hours</Option>
            <Option value={120}>2 hours</Option>
          </Select>
        </FormControl>
        <FormControl sx={{ width: 300, marginTop: '20px' }}>
          <FormLabel>Attendees</FormLabel>
          <Autocomplete
            multiple
            options={users}
            getOptionLabel={(user: User) => `${user.name} (${user.email})`}
            value={attendees}
            onChange={(_, newValue) => {
              setAttendees(newValue);
            }}
            inputValue={attendeesInputValue}
            onInputChange={(_, newInputValue) => {
              setAttendeesInputValue(newInputValue);
            }}
          />
        </FormControl>
        <FormControl sx={{ width: 300, marginTop: '20px' }}>
          <Button onClick={handleScheduleMeeting}>Schedule Meeting</Button>
        </FormControl>
      </form>
    </Box>
  );
}

export const loadUsers: LoaderFunction = async () => {
  const response = await fetch('/api/users');
  const json = await response.json();
  if (json.success) {
    return json.users as User[];
  } else {
    throw new Error(json.message);
  }
};

export default ScheduleMeetingView;
