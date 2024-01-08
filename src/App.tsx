import { useState } from 'react';
import { supabase } from './lib/api';
import ReservationList from './components/ReservationList';
import ReservationForm from './components/ReservationForm';
import Auth from './components/Auth';

export type Reservation = {
  id: number;
  resturantName: string;
  dateTime: string;
  bookingStatus: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
};

function App() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getReservations = async () => {
    setLoading(true);
    try {
      const res = await supabase.from('reservations').select('*');
      console.log(res);
      if (res.error) {
        throw res.error;
      }
      setReservations(res.data as Reservation[]);
    } catch (err) {
      console.error(err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const removeReservation = async (id: number) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Remove the reservation from the state
      setReservations(
        reservations.filter((reservation) => reservation.id !== id),
      );
    } catch (error) {
      console.error('Error removing reservation: ', error);
    }
  };
  return (
    <div className="max-w-[760px] m-auto p-8 border border-black text-center">
      <h1>resy bot</h1>
      {!isLoggedIn ? (
        <Auth onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <>
          <ReservationForm getReservations={getReservations} />
          <ReservationList
            loading={loading}
            reservations={reservations}
            handleRemove={removeReservation}
            getReservations={getReservations}
          />
        </>
      )}
    </div>
  );
}

export default App;
