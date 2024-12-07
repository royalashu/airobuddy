import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSearchParams } from "react-router-dom";

const supabase = createClient(
  "https://ymhnrlnbpviraftmvfxe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltaG5ybG5icHZpcmFmdG12ZnhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzMwNjIxOCwiZXhwIjoyMDQ4ODgyMjE4fQ.9iKkbroyUtzKgeB0ytMHJzMzsbbUtvYiWPgKcOK3zHU"
);

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [images, setImages] = useState({});
  const [rooms, setRooms] = useState({});
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchHotelsAndImages = async () => {
      try {
        const destinationCode = searchParams.get("code");

        if (!destinationCode) {
          console.error("No destination code provided in the query.");
          setLoading(false);
          return;
        }

        // Fetch hotels with the same destination code
        const { data: hotelsData, error: hotelsError } = await supabase
          .from("hotels")
          .select("*")
          .eq("destination_code", destinationCode);

        if (hotelsError) throw hotelsError;

        setHotels(hotelsData);

        // Fetch images for the filtered hotels
        const hotelIds = hotelsData.map((hotel) => hotel.id);
        if (hotelIds.length > 0) {
          const { data: imagesData, error: imagesError } = await supabase
            .from("images")
            .select("hotel_id, path")
            .in("hotel_id", hotelIds);

          if (imagesError) throw imagesError;

          const imagesByHotel = imagesData.reduce((acc, image) => {
            acc[image.hotel_id] = image.path;
            return acc;
          }, {});

          setImages(imagesByHotel);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelsAndImages();
  }, [searchParams]);

  const fetchRooms = async (hotelId) => {
    try {
      setSelectedHotelId(hotelId);
      if (!rooms[hotelId]) {
        const { data: roomsData, error: roomsError } = await supabase
          .from("rooms")
          .select("*")
          .eq("hotel_id", hotelId);

        if (roomsError) throw roomsError;

        setRooms((prevRooms) => ({ ...prevRooms, [hotelId]: roomsData }));
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16 min-h-screen">
        <p className="text-gray-600 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="flex justify-center py-16 min-h-screen">
        <p className="text-gray-600 text-lg">No hotels found for the selected destination.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Hotels in {searchParams.get("destination")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="overflow-hidden rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => fetchRooms(hotel.id)}
          >
            <img
              className="w-full h-48 object-cover"
              src={
                images[hotel.id]
                  ? `https://photos.hotelbeds.com/giata/${images[hotel.id]}`
                  : "https://via.placeholder.com/300x200"
              }
              alt={hotel.name}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {hotel.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {hotel.description}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Location:</strong> {hotel.state_name}, {hotel.country_name}
              </p>
            </div>
          </div>
        ))}
      </div>
   {/* Rooms Section */}
   {selectedHotelId && rooms[selectedHotelId] && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Rooms in {hotels.find((hotel) => hotel.id === selectedHotelId)?.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms[selectedHotelId].map((room) => (
              <div
                key={room.id}
                className="overflow-hidden rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {room.type_description || "Room"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {room.description || "No description available."}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Guests:</strong> {room.min_pax} - {room.max_pax} pax
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Max Adults:</strong> {room.max_adults}, <strong>Max Children:</strong> {room.max_children}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {room.type_description || "N/A"}
                  </p>
                  {/* <p className="text-sm text-gray-600">
                    <strong>Room Code:</strong> {room.pms_room_code || "N/A"}
                  </p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotels;
