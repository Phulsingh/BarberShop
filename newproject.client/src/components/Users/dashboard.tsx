
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Card } from "../ui/card";
import Banner from "../../assets/Banner.png"
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  // Static data for demonstration
  const services = [
    {
      id: 1,
      name: "Classic Haircut",
      price: "$25",
      duration: "30 min",
      image: "https://cdn.shopify.com/s/files/1/0899/2676/2789/files/Classic_Side_Part.jpg?v=1735326797"
    },
    {
      id: 2,
      name: "Beard Trim",
      price: "$15",
      duration: "20 min",
      image: "https://i.ytimg.com/vi/MakC821Jty8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC6Zk2wSyF0TzqOsCzhPCMfGMdLqA"
    },
    {
      id: 3,
      name: "Hair Color",
      price: "$50",
      duration: "60 min",
      image: "https://static.vecteezy.com/system/resources/thumbnails/056/634/373/small_2x/a-young-man-with-red-hair-and-a-turtle-neck-photo.jpeg"
    }
  ];


  const offers = [
    {
      id: 1,
      title: "Monday Special",
      description: "20% off on all services",
      validUntil: "Valid only on Mondays"
    },
    {
      id: 2,
      title: "Student Discount",
      description: "15% off with valid student ID",
      validUntil: "Valid throughout the semester"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      rating: 5,
      comment: "Best haircut experience ever! Very professional and friendly staff.",
      date: "2 days ago"
    },
    {
      id: 2,
      name: "Mike Smith",
      rating: 5,
      comment: "Great attention to detail. Will definitely come back!",
      date: "1 week ago"
    }
  ];

  return (
    <div className="w-full mt-16 max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden mb-12">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10" />

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Banner})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-4 sm:px-8 md:px-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-snug sm:leading-tight">
              Experience the Art of Perfect Grooming
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed">
              Step into style with our expert barbers. From classic cuts to modern trends,
              we craft the perfect look for every client.
            </p>

            {/* Buttons */}
            <div className="flex  sm:flex-row gap-3 sm:gap-4">
              <Button 
                onClick={() => navigate('/book-now')}
                size="lg"
                className="hover:bg-white hover:text-black cursor-pointer text-base sm:text-lg px-6 sm:px-8"
              >
                Book Now
              </Button>
              <Button
                onClick={() => navigate('/services')}
                size="lg"
                variant="outline"
                className="text-black hover:text-white cursor-pointer hover:bg-black/10 text-base sm:text-lg px-6 sm:px-8"
              >
                View Services
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Services Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="p-4 flex flex-col">
              {/* Image */}
              <div className="aspect-video rounded-lg overflow-hidden ">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  <p className="text-2xl font-bold text-primary">{service.price}</p>
                </div>
                <div>
                  <p>Time</p>
                  <p className="text-gray-600">{service.duration}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-auto flex gap-2">
                <button className="flex-1 cursor-pointer bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition">
                  Book Now
                </button>
                <button className="flex-1 cursor-pointer border border-primary text-primary py-2 rounded-lg hover:bg-primary hover:text-white transition">
                  Add to Cart
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Special Offers */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="p-6 border-2 border-primary">
              <h3 className="text-xl font-semibold">{offer.title}</h3>
              <p className="text-gray-600 ">{offer.description}</p>
              <p className="text-sm text-gray-500">{offer.validUntil}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Booking Calendar */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Book Your Appointment</h2>
        <div className="flex gap-6 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <Calendar className="rounded-md border" />
          </div>
          <div className="flex-1 min-w-[300px]">
            <Card className="p-4">
              <h3 className="text-xl font-semibold mb-4">Today's Availability</h3>
              <div className="grid grid-cols-2 gap-2">
                {["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"].map((time) => (
                  <Button key={time} variant="outline" className="w-full">
                    {time}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Shop Information */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Visit Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 8:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 6:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </p>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-2">
              <p>📍 123 Barber Street, City, Country</p>
              <p>📞 +1 234 567 890</p>
              <p>✉️ info@barbershop.com</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-600 ">"{testimonial.comment}"</p>
              <div className="flex justify-between items-center">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.date}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
