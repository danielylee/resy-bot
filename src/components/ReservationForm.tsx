import { ChangeEvent, FormEvent, useState } from 'react';
import { supabase } from '../lib/api';

type FormData = {
  resturantName: string;
  dateTime: string;
};

type ReservationFormProps = {
  getReservations: () => Promise<void>;
};

const ReservationForm = ({ getReservations }: ReservationFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    resturantName: '',
    dateTime: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([formData]);

      if (error) {
        throw error;
      }

      console.log('Form submitted successfully: ', data);
      setFormData({ resturantName: '', dateTime: '' });
      getReservations();
    } catch (error) {
      console.error('Error submitting form: ', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="max-w-[300px] mx-auto mt-4 mb-10" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col text-left">
          <label>Resturant name: </label>
          <input
            className="border border-black py-1 px-3 rounded"
            type="text"
            name="resturantName"
            value={formData.resturantName}
            onChange={handleInputChange}
          ></input>
        </div>
        <div className="flex flex-col text-left">
          <label>When: </label>
          <input
            className="border border-black py-1 px-3 rounded"
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleInputChange}
          ></input>
        </div>
        <button
          className={`border border-black rounded-md mt-2 p-1 ${
            submitting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-500 hover:text-white'
          }`}
          type="submit"
          disabled={submitting}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ReservationForm;
