import { useState } from 'react';
import { Box, Button, FormControl, Select, Input, FormLabel, Option } from '@mui/joy';

function ScheduleMeetingView() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState("");
  const [attendees, setAttendees] = useState<string[]>([]);
  const [selectedAttendee, setSelectedAttendee] = useState('');

  const handleAddAttendee = () => {
    setAttendees([...attendees, selectedAttendee]);
    setSelectedAttendee('');
  };

  const handleRemoveAttendee = (index: number) => {
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  const handleScheduleMeeting = () => {
    //add functionality
    console.log("pressed");
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <form>
            <FormControl sx={{ width: 300, marginTop: '20px' }}>
                <FormLabel>Date</FormLabel>
                <Input type='date' placeholder='Date' onClick={e=>setDate((e.target as HTMLInputElement).value)} sx={{ width: 300 }} />
            </FormControl>
            <FormControl sx={{ width: 300, marginTop: '20px' }}>
                <FormLabel>Time</FormLabel>
                <Input type='time' placeholder='Time' onClick={e=>setTime((e.target as HTMLInputElement).value)} sx={{ width: 300 }} />
            </FormControl>
            <FormControl sx={{ width: 300, marginTop: '20px' }}>
                <FormLabel>Duration</FormLabel>
                <Select defaultValue={30} onClick={e=>setDuration((e.target as HTMLButtonElement).value)}>
                    <Option value={30}>30 minutes</Option>
                    <Option value={60}>1 hour</Option>
                    <Option value={90}>1.5 hours</Option>
                    <Option value={120}>2 hours</Option>
                </Select>
            </FormControl>
            <FormControl sx={{ width: 300, marginTop: '20px' }}>
                <FormLabel>Attendees</FormLabel>
                <Select defaultValue='user1' onClick={e=>setSelectedAttendee((e.target as HTMLButtonElement).value)}>
                    <Option value='user1'>User 1</Option>
                    <Option value='user2'>User 2</Option>
                    <Option value='user3'>User 3</Option>
                </Select>
                <Button onClick={handleAddAttendee}>Add</Button>
            </FormControl>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {attendees.map((attendee, index) => (
                <Box key={attendee}>
                    {attendee}{' '}
                <Button onClick={() => handleRemoveAttendee(index)}>Remove - {index + 1}</Button>
                </Box>
                ))}
            </Box>
            <FormControl sx={{ width: 300, marginTop: '20px'}}>
                <Button onClick={handleScheduleMeeting}>Schedule Meeting</Button>
            </FormControl>
        </form>
    </Box>
  );
}

export default ScheduleMeetingView;
