
import { Card } from "../ui/card";
import { Button } from "../ui/button";

const Services = () => {
  // Static services data (will be replaced with API data later)
  const services = [
    {
      id: 1,
      name: "Classic Haircut",
      price: "$25",
      duration: "30 min",
      description: "Traditional haircut with precision trimming and styling",
      image: "https://cdn.shopify.com/s/files/1/0899/2676/2789/files/Classic_Side_Part.jpg?v=1735326797",
      category: "Hair"
    },
    {
      id: 2,
      name: "Beard Trim",
      price: "$15",
      duration: "20 min",
      description: "Professional beard shaping and trimming service",
      image: "https://i.ytimg.com/vi/MakC821Jty8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC6Zk2wSyF0TzqOsCzhPCMfGMdLqA",
      category: "Beard"
    },
    {
      id: 3,
      name: "Hair Color",
      price: "$50",
      duration: "60 min",
      description: "Full hair coloring service with premium products",
      image: "https://static.vecteezy.com/system/resources/thumbnails/056/634/373/small_2x/a-young-man-with-red-hair-and-a-turtle-neck-photo.jpeg",
      category: "Color"
    },
    {
      id: 4,
      name: "Hot Towel Shave",
      price: "$30",
      duration: "45 min",
      description: "Luxurious traditional hot towel shave experience",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033",
      category: "Shave"
    },
    {
      id: 5,
      name: "Hair & Beard Combo",
      price: "$35",
      duration: "50 min",
      description: "Complete grooming package with haircut and beard trim",
      image: "https://images.unsplash.com/photo-1622286342621-4bd786c422e4",
      category: "Combo"
    },
    {
      id: 6,
      name: "Kids Haircut",
      price: "$20",
      duration: "25 min",
      description: "Gentle and fun haircuts for children",
      image: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d",
      category: "Hair"
    }
  ];

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
                  src={service.image}
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
                    <p className="text-sm text-gray-600">{service.duration}</p>
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
