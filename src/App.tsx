import { useEffect, useState } from 'react';
import './styles/App.css';
import ReservationForm from './components/ReservationForm';
import { supabase } from './lib/api';

type Reservation = {
  id: number;
  resturantName: string;
  dateTime: string;
};

function App() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReservations();
  }, []);

  const getReservations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('reservations').select('*');
      if (error) {
        throw error;
      }
      setReservations(data as Reservation[]);
    } catch (err) {
      console.log(err);
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

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return new Intl.DateTimeFormat('default', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      <ReservationForm getReservations={getReservations} />
      <div>
        <h3 className="mb-5">Reservations: </h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table-auto m-auto text-left">
            <thead>
              <tr>
                <th className="min-w-[150px]">Name</th>
                <th className="min-w-[150px]">When</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(({ resturantName, dateTime, id }) => (
                <tr key={id} className="even:bg-gray-200">
                  <td className="min-w-[150px] py-2">{resturantName}</td>
                  <td className="min-w-[150px] py-2">
                    {formatDateTime(dateTime)}
                  </td>
                  <td className="min-w-[80px] flex justify-center py-2">
                    <button
                      className="text-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-200 transition-all"
                      onClick={() => removeReservation(id)}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default App;
