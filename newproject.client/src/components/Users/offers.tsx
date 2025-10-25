import { useEffect, useState } from "react";
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

const Offer = () => {
  const { getOffers } = useOfferService();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const data = await getOffers();
        if (!data) throw new Error("No data received");
        setOffers(data as Offer[]);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load offers");
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, []);

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

  if (error) {
    return (
      <div className="mt-8 px-4">
        <h2 className="text-2xl font-semibold mb-2">Offers</h2>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
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
  );
};

export default Offer;
