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
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { LoaderFunction, useLoaderData } from 'react-router-dom';
import { User } from 'src/lib/auth';
import { db } from 'src/lib/firebase';

function ScheduleMeetingView() {
  const users = useLoaderData() as User[];

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [attendees, setAttendees] = useState<User[]>([]);
  const [attendeesInputValue, setAttendeesInputValue] = useState('');

  const handleScheduleMeeting = () => {
    const startsAt = new Date(`${date} ${time}`);
    const endsAt = new Date(startsAt.getTime() + duration * 60 * 1000);
    setDoc(doc(collection(db, 'meetings')), {
      startsAt,
      endsAt,
      attendees: attendees.map((attendee) => doc(db, 'users', attendee.id)),
    })
      .then(() => alert('Success ' + JSON.stringify({ startsAt, endsAt, attendees })))
      .catch((error) => alert(error));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography level='h3' component='h1'>
        Schedule Meeting
      </Typography>

      <form>
        <FormControl sx={{ width: 300 }}>
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
            getOptionLabel={(user: User) => user.email}
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
  return await getDocs(collection(db, 'users')).then((querySnapshot) => {
    return querySnapshot.docs.map((doc) => {
      const user = doc.data() as User;
      return {
        id: user.id,
        email: user.email,
      };
    });
  });
};

export default ScheduleMeetingView;
