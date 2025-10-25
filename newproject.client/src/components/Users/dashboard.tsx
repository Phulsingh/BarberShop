
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Card } from "../ui/card";
import Banner from "../../assets/Banner.png"
import { useNavigate } from "react-router-dom";
import { useBarberServices } from "@/services/BarberServices";
import type { IBarberService } from "@/services/BarberServices";
import { useEffect, useState } from "react";
import { useCartServices } from '@/services/cartServices';
import useOfferService from "@/services/offerService";

type Offer = {
  id: number;
  type: "DayOffer" | "FestivalOffer" | string;
  name: string;
  description: string;
  discount: number;
  validTillText?: string;
  validTillDate?: string;
  numberOfUses?: number;
  festivalName?: string | null;
  dayName?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const formatDate = (iso?: string) => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};


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


const Dashboard = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<IBarberService[]>([]);
 
  const { getAllServices } = useBarberServices();
  const { getOffers } = useOfferService();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const cartServices = useCartServices();
  const [addedServices, setAddedServices] = useState<number[]>([]);

  useEffect(() => {
    const fetchServicesAndCart = async () => {
      try {
        // Fetch all services
        const allServices = await getAllServices();
        setServices(allServices);

        // Fetch cart items and update addedServices state
        const cartItems = await cartServices.getCartItems();
        const cartServiceIds = cartItems.map(item => item.serviceId);
        setAddedServices(cartServiceIds);
      } catch (error) {
        console.error('Error fetching services and cart:', error);
      }
    };
    fetchServicesAndCart();
  }, [])


  const handleAddToCart = async (serviceId: number) => {
    try {
      console.log('Adding to cart:', serviceId);
      await cartServices.addToCart(serviceId);
      setAddedServices((prev) => [...prev, serviceId]);
      alert("Service added to cart!");
    } catch (error: any) {
      console.error('Add to cart error:', error);
      alert("Failed to add service to cart.");
    }
  };


    useEffect(() => {
    const fetchServicesAndCart = async () => {
      try {
       const allServices = await getAllServices();
          setServices(allServices);

        // Fetch offers
        try {
          const fetchedOffers = await getOffers();
          setOffers(fetchedOffers as Offer[]);
        } catch (offerErr) {
          console.error("Error fetching offers:", offerErr);
          setOffers([]);
        } finally {
          setLoading(false);
        }

        // Fetch cart items and update addedServices state
        const cartItems = await cartServices.getCartItems();
        const cartServiceIds = cartItems.map(item => item.serviceId);
        setAddedServices(cartServiceIds);
      } catch (error) {
        console.error('Error fetching services and cart:', error);
      }
    };
    fetchServicesAndCart();
  }, [])


   if (loading) {
    return (
      <div className="mt-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg bg-gray-100 h-40" />
          ))}
        </div>
      </div>
    );
  }



  return (
    <div className="w-full mt-13 max-w-7xl mx-auto px-4 py-8">
      {/* Offers Marquee */}
      <section className="overflow-hidden bg-gradient-to-r from-black to-primary rounded-lg">
        <div className="py-7 relative flex justify-center items-center">
          <div className="flex items-center animate-scroll whitespace-nowrap absolute left-0">
            <span className="text-2xl font-bold text-yellow-400 px-4">🎉 Special Offer: 20% OFF on First Visit! 🎉</span>
            <span className="text-2xl font-bold text-white px-4">💈 Premium Haircut + Free Beard Trim</span>
            <span className="text-2xl font-bold text-emerald-400 px-4">🎁 Refer a Friend & Get ₹200 Off!</span>
            <span className="text-2xl font-bold text-pink-400 px-4">✨ Student Special: 15% Discount with ID</span>
            <span className="text-2xl font-bold text-cyan-400 px-4">🌟 Senior Citizen Special: Extra Care, Special Price</span>
          </div>
        </div>
      </section>
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden mt-5 mb-12">
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

      {/* Services Grid */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="p-4 flex flex-col">
              {/* Service Image */}
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Service Details */}
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold">{service.name}</h3>
                    <span className="inline-block px-2 py-1 text-sm bg-primary/10 text-primary rounded-full">
                      {service.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₹{service.price}</p>
                    <p className="text-sm text-gray-600">{service.durationInMinutes} min</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{service.description}</p>

                {/* Action Buttons */}
                <div className="mt-auto flex gap-2">
                  <Button className="flex-1" variant="default">
                    Book Now
                  </Button>
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => service.id && handleAddToCart(service.id)}
                    disabled={Boolean(service.id && addedServices.includes(service.id))}
                  >
                    {Boolean(service.id && addedServices.includes(service.id)) ? "Added ✅" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Special Offers */}
     <div className="mt-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Offers</h2>
        <p className="text-sm text-gray-500">{offers.length} {offers.length === 1 ? "offer" : "offers"}</p>
      </div>

      {offers.length === 0 ? (
        <div className="py-12 text-center text-gray-500">No offers available right now.</div>
      ) : (
        <div className="grid cursor-pointer mb-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((o) => (
            <article
              key={o.id}
              className={`relative bg-white border rounded-lg shadow-sm p-4 flex flex-col justify-between transition-transform hover:scale-[1.01]`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{o.name}</h3>
                      <div className="mt-1 text-sm text-gray-600">{o.description}</div>
                    </div>

                    <div className="ml-3 flex flex-col items-end">
                      <span className="inline-block bg-gradient-to-tr from-indigo-500 to-purple-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        {o.discount}% OFF
                      </span>
                      <span
                        className={`mt-2 text-xs font-medium px-2 py-1 rounded ${
                          o.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {o.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 bg-gray-50 border px-2 py-1 rounded text-gray-700">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {o.validTillText ?? formatDate(o.validTillDate)}
                    </span>

                    {o.type && (
                      <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                        {o.type === "DayOffer" ? (o.dayName ?? "Day Offer") : o.festivalName ?? o.type}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-800 px-2 py-1 rounded">
                      Uses: {o.numberOfUses ?? "∞"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">Valid till: {formatDate(o.validTillDate)}</div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-sm cursor-pointer px-3 py-1 rounded border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    aria-label={`View offer ${o.name}`}
                  >
                    View
                  </button>
                  <button
                    className={`text-sm cursor-pointer px-3 py-1 rounded ${
                      o.isActive ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-600 cursor-not-allowed"
                    }`}
                    disabled={!o.isActive}
                    aria-disabled={!o.isActive}
                  >
                    Redeem
                  </button>
                </div>
              </div>

            </article>
          ))}
        </div>
      )}
    </div>


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
