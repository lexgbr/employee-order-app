import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginForm = ({ goToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token, data.numeAngajat);
      } else {
        toast.error(data.error || '❌ Login failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2 style={{ fontSize: '1.5rem' }}>🔐 Login</h2>

      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        required
        style={{ display: 'block', width: '100%', padding: 10, marginBottom: 15, fontSize: '1rem' }}
      />

      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
        style={{ display: 'block', width: '100%', padding: 10, marginBottom: 15, fontSize: '1rem' }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{ width: '100%', padding: 12, fontSize: '1rem', cursor: 'pointer' }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p style={{ marginTop: 20, fontSize: '1rem' }}>
        Nu ai cont?{' '}
        <button type="button" onClick={goToRegister} style={{ fontSize: '1rem' }}>
          Înregistrează-te
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
