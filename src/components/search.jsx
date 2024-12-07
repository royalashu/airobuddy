import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const supabase = createClient(
  "https://ymhnrlnbpviraftmvfxe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltaG5ybG5icHZpcmFmdG12ZnhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzMwNjIxOCwiZXhwIjoyMDQ4ODgyMjE4fQ.9iKkbroyUtzKgeB0ytMHJzMzsbbUtvYiWPgKcOK3zHU"
);

const Search = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [travellers, setTravellers] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [code, setCode] = useState("");
  const navigate = useNavigate(); // To navigate to other routes

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase.from("destinations").select("*");
        if (error) throw error;

        // Format destination data
        const formattedDestinations = data.map((destination) => ({
          id: destination.id,
          name: destination.name.content,
          code: destination.code,  // Ensure the code is included
        }));

        setDestinations(formattedDestinations);
        setFilteredDestinations(formattedDestinations); // Initialize the filtered list
      } catch (error) {
        console.error("Error fetching destinations:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setQuery(searchQuery);
    // Filter destinations based on the search query
    const filtered = destinations.filter((destination) =>
      destination.name.toLowerCase().includes(searchQuery)
    );
    setFilteredDestinations(filtered.slice(0, 5)); // Limit to 5 suggestions
  };

  const handleSelectDestination = (destination) => {
    setQuery(destination.name);
    setCode(destination.code); // Set the correct code when a destination is selected
    setFilteredDestinations([]); // Clear the suggestions
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to hotels with search parameters
    navigate(
      `/hotels?destination=${query}&code=${code}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&travellers=${travellers}&rooms=${rooms}`
    );
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <div className="text-center my-5">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            id="where"
            placeholder="Where to?"
            className="p-3 w-4/5 max-w-[400px] border border-gray-300 rounded-md mb-3"
          />

          {/* Suggestions Dropdown */}
          {query && filteredDestinations.length > 0 && (
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-4/5 max-w-[400px] bg-white border border-gray-300 rounded-md shadow-md z-10">
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

          <div className="mt-3">
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="p-3 w-2/5 mr-3 border border-gray-300 rounded-md"
            />
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="p-3 w-2/5 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mt-3">
            <input
              type="number"
              value={travellers}
              onChange={(e) => setTravellers(e.target.value)}
              min="1"
              className="p-3 w-2/5 mr-3 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              min="1"
              className="p-3 w-2/5 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mt-5">
            <button
              type="submit"
              className="p-3 px-8 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;
