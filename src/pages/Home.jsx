import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ymhnrlnbpviraftmvfxe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltaG5ybG5icHZpcmFmdG12ZnhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzMwNjIxOCwiZXhwIjoyMDQ4ODgyMjE4fQ.9iKkbroyUtzKgeB0ytMHJzMzsbbUtvYiWPgKcOK3zHU"
);

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [query, setQuery] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [travellers, setTravellers] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase.from("destinations").select("*");
        if (error) throw error;

        const formattedDestinations = data.map((destination) => ({
          id: destination.id,
          name: destination.name.content,
          code: destination.code,
        }));

        setDestinations(formattedDestinations);
        setFilteredDestinations(formattedDestinations);
      } catch (error) {
        console.error("Error fetching destinations:", error.message);
        setError("Failed to load destinations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setQuery(searchQuery);

    const filtered = destinations.filter((destination) =>
      destination.name.toLowerCase().includes(searchQuery)
    );
    setFilteredDestinations(filtered.slice(0, 5));
  };

  const handleSelectDestination = (destination) => {
    setQuery(destination.name);
    setCode(destination.code);
    setFilteredDestinations([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query || !checkInDate || !checkOutDate || !travellers || !rooms) {
      setError("All fields are required.");
      return;
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    setError("");
    navigate(
      `/hotels?destination=${query}&code=${code}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&travellers=${travellers}&rooms=${rooms}`
    );
  };

  return (
    <div className="bg-gray-100">
      <div
        className="relative bg-cover bg-center h-[400px] sm:h-[600px]"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/hammocks-umbrellas-placed-row_1203-185.jpg?t=st=1733586842~exp=1733590442~hmac=91e60a82928debd88c0a7c18dff87a8c7fc8ebf666a6e643cec8d1a93398048c&w=1380')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Find Your Perfect Getaway
          </h1>
          <p className="text-lg sm:text-xl mb-6">
            Discover the best deals on hotels, tailored just for you.
          </p>
          <Link to="/search">
            <button className="px-6 py-3 bg-blue-500 rounded-md text-white hover:bg-blue-600 transition duration-300">
              Start Exploring
            </button>
          </Link>
        </div>
      </div>

      <div className="relative -mt-16 mx-auto max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="w-full relative">
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                id="where"
                placeholder="Where to?"
                className="p-3 border w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {query && filteredDestinations.length > 0 && (
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-[400px] bg-white border border-gray-300 rounded-md shadow-md z-10">
                  {filteredDestinations.map((destination) => (
                    <div
                      key={destination.id}
                      onClick={() => handleSelectDestination(destination)}
                      className="p-3 cursor-pointer border-b border-gray-200 hover:bg-gray-100"
                    >
                      {destination.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              placeholder="Check-in"
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              placeholder="Check-out"
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4 flex justify-between items-center">
            <input
              type="number"
              placeholder="Travellers"
              value={travellers}
              onChange={(e) => setTravellers(e.target.value)}
              min="1"
              className="p-3 w-1/2 mr-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              min="1"
              placeholder="Rooms"
              className="p-3 w-1/2 ml-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && (
            <div className="mt-4 text-red-500 text-center">
              <p>{error}</p>
            </div>
          )}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 rounded-md text-white hover:bg-blue-600 transition duration-300"
            >
              Search Hotels
            </button>
          </div>
        </form>
      </div>

      <div className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Explore Popular Destinations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Paris", "Bali", "New York", "Tokyo"].map((destination, index) => (
              <div
                key={index}
                className="relative bg-cover bg-center h-48 rounded-lg shadow-lg overflow-hidden"
                style={{
                  backgroundImage: `url('https://via.placeholder.com/300x200?text=${destination}')`,
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white font-bold text-lg">
                  {destination}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Partners</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-6">
            {["Airbnb", "Booking.com", "Expedia", "Hotels.com", "Trivago"].map(
              (partner, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded-lg">
                  <img
                    src={`https://via.placeholder.com/1000x500?text=${partner}`}
                    alt={partner}
                    className="w-full h-16 object-cover rounded-lg"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
