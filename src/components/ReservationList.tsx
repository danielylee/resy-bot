import { useEffect } from 'react';
import { Reservation } from '../App';

type ReservationListProps = {
  loading: boolean;
  reservations: Reservation[];
  handleRemove: (id: number) => void;
  getReservations: () => Promise<void>;
};

const ReservationList = ({
  loading,
  reservations,
  handleRemove,
  getReservations,
}: ReservationListProps) => {
  useEffect(() => {
    getReservations();
  }, []);

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date
      .toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .replace(',', ' @ ');
  };

  return (
    <div className="text-left">
      <h3 className="mb-5">reservations: </h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="min-w-[250px]">name</th>
              <th className="min-w-[200px]">when</th>
              <th>status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(
              ({ resturantName, dateTime, id, bookingStatus }) => (
                <tr key={id} className="even:bg-gray-200">
                  <td className="min-w-[150px] py-2">{resturantName}</td>
                  <td className="min-w-[150px] py-2">
                    {formatDateTime(dateTime)}
                  </td>
                  <td className="min-w-[150px] py-2">{bookingStatus}</td>
                  <td className="min-w-[80px] flex justify-center py-2">
                    <button
                      className="text-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-200 transition-all"
                      onClick={() => handleRemove(id)}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReservationList;
