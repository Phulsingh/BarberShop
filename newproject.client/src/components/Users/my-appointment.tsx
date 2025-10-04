
import { useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Card } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const MyAppointment = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock data for available time slots
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM",
    "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  // Mock data for services (you can import this from your services component)
  const services = [
    {
      id: 1,
      name: "Classic Haircut",
      price: "$25",
      duration: "30 min",
      category: "Hair"
    },
    {
      id: 2,
      name: "Beard Trim",
      price: "$15",
      duration: "20 min",
      category: "Beard"
    },
    {
      id: 3,
      name: "Hair Color",
      price: "$50",
      duration: "60 min",
      category: "Color"
    }
  ];

  // Mock data for appointments history
  const appointments = [
    {
      id: 1,
      barber: "Mike Johnson",
      date: "2025-01-15",
      time: "2:30 PM",
      service: "Classic Haircut",
      price: "$25",
      location: "123 Main Street, Downtown",
      status: "upcoming"
    },
    {
      id: 2,
      barber: "John Smith",
      date: "2024-12-28",
      time: "3:00 PM",
      service: "Beard Trim",
      price: "$15",
      location: "123 Main Street, Downtown",
      status: "completed"
    }
  ];

  return (
    <div className="w-full mt-16 max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

      <Tabs defaultValue="book" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="book">Book Appointment</TabsTrigger>
          <TabsTrigger value="history">Appointment History</TabsTrigger>
        </TabsList>

        {/* Booking Section */}
        <TabsContent value="book">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calendar and Time Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border mb-4"
              />
              <div className="space-y-4">
                <h3 className="font-medium">Available Time Slots</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button key={time} variant="outline" className="w-full">
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Service Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select Service</h2>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      <div className="flex justify-between items-center w-full">
                        <span>{service.name}</span>
                        <span className="text-sm text-gray-500">
                          {service.price} • {service.duration}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-8">
                <Button className="w-full" size="lg">
                  Book Appointment
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* History Section */}
        <TabsContent value="history">
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Barber Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Barber</p>
                        <p className="font-medium">{appointment.barber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="font-medium">
                          {appointment.date} • {appointment.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service & Price */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Service</p>
                        <p className="font-medium">
                          {appointment.service} • {appointment.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{appointment.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Call Shop
                  </Button>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    Message
                  </Button>
                  {appointment.status === "upcoming" && (
                    <>
                      <Button variant="outline" className="flex-1 sm:flex-none text-destructive hover:bg-destructive/90 hover:text-white">
                        Cancel
                      </Button>
                      <Button className="flex-1 sm:flex-none">
                        Reschedule
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyAppointment;
