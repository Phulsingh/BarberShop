import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useBarberServices } from "@/services/BarberServices";
import type { IBarberService } from "@/services/BarberServices";


const Services = () => {

   const [services, setServices] = useState<IBarberService[]>([]);

  const { getAllServices } = useBarberServices();

  useEffect(()=>{
    const fetchServices = async () => {
      const allServices = await getAllServices();
      setServices(allServices); // Assuming the API response has a 'data' field containing the services
    };
    fetchServices();
  }, [])
 
  return (
    <div className="w-full mt-16 max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our comprehensive range of professional grooming services designed to keep you looking your best.
          Each service is delivered by our expert barbers with years of experience.
        </p>
      </section>

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
                    <p className="text-2xl font-bold text-primary">{service.price}</p>
                    <p className="text-sm text-gray-600">{service.durationInMinutes} min</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{service.description}</p>

                {/* Action Buttons */}
                <div className="mt-auto flex gap-2">
                  <Button className="flex-1" variant="default">
                    Book Now
                  </Button>
                  <Button className="flex-1" variant="outline">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Services;
