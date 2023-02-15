import { useState } from "react";
import {Box, Button, FormControl, Select, Input, FormLabel, Option} from "@mui/joy";

function ScheduleMeetingView() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(Number);
  const [attendees, setAttendees] = useState<string[]>([]);
  const [selectedAttendee, setSelectedAttendee] = useState("");

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  const handleDurationChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDuration(event.target.value as number);
  };

  const handleAttendeeChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSelectedAttendee(event.target.value);
  };

  const handleAddAttendee = () => {
    setAttendees([...attendees, selectedAttendee]);
    setSelectedAttendee("");
  };

  const handleRemoveAttendee = (index: number) => {
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  const handleScheduleMeeting = () => {
    //add functionality
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Input
      type="date"
        placeholder="Date"
        onChange={handleDateChange}
        sx={{ width: 300 }}
      />
      <Input
      type="time"
        placeholder="Time"
        onChange={handleTimeChange}
        sx={{ width: 300 }}
      />
      <FormControl sx={{ width: 300 }}>
        <FormLabel>Duration</FormLabel>
        <Select defaultValue={30}>
          <Option value={30}>30 minutes</Option>
          <Option value={60}>1 hour</Option>
          <Option value={90}>1.5 hours</Option>
          <Option value={120}>2 hours</Option>
        </Select>
      </FormControl>
      <FormControl sx={{ width: 300 }}>
        <FormLabel>Attendees</FormLabel>
        <Select defaultValue="user1">
          <Option value="user1">User 1</Option>
          <Option value="user2">User 2</Option>
          <Option value="user3">User 3</Option>
        </Select>
        <Button onClick={handleAddAttendee}>Add</Button>
      </FormControl>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {attendees.map((attendee, index) => (
          <Box key={attendee}>
            {attendee} <Button onClick={() => handleRemoveAttendee(index)}>Remove - {index+1}</Button>
          </Box>
        ))}
      </Box>
      <Button onClick={handleScheduleMeeting}>Schedule Meeting</Button>
    </Box>
  );
}

export default ScheduleMeetingView;