import { useState, FormEvent } from 'react';
import { supabase } from '../lib/api';

const Auth = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Error signing in: ', error.message);
    } else {
      console.log('Signed in as: ', data?.user);
      setSubmitting(false);
      onLogin();
    }
  };

  return (
    <div className="max-w-[360px] mx-auto text-left">
      <form className="mt-4 mb-10" onSubmit={handleLogin}>
        <div className="flex flex-col gap-2">
          <input
            className="border border-black py-1 px-3 rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border border-black py-1 px-3 rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className={`border border-black rounded-md mt-3 py-1 px-3 ${
            submitting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-500 hover:text-white'
          }`}
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Auth;
