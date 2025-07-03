import { useState } from 'react';
import { toast } from 'react-toastify';

const RegisterForm = ({ goToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [numeAngajat, setNumeAngajat] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, numeAngajat, code })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('✅ Înregistrare reușită. Te poți loga acum.');
        setUsername('');
        setPassword('');
        setNumeAngajat('');
        setCode('');
        goToLogin();
      } else {
        toast.error(data.error || '❌ Înregistrare eșuată');
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      toast.error('❌ Eroare server. Încearcă din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2 style={{ fontSize: '1.5rem' }}>📝 Înregistrare</h2>

      <label style={{ display: 'block', marginBottom: 10 }}>
        Username
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={{ display: 'block', width: '100%', padding: 10, fontSize: '1rem' }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 10 }}>
        Parolă
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ display: 'block', width: '100%', padding: 10, fontSize: '1rem' }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 10 }}>
        Nume Angajat
        <input
          value={numeAngajat}
          onChange={e => setNumeAngajat(e.target.value)}
          placeholder="Nume Angajat"
          required
          style={{ display: 'block', width: '100%', padding: 10, fontSize: '1rem' }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 10 }}>
        Cod Înregistrare
        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Registration Code"
          required
          style={{ display: 'block', width: '100%', padding: 10, fontSize: '1rem' }}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: 10 }}
      >
        {loading ? 'Se înregistrează...' : 'Înregistrează'}
      </button>

      <p style={{ marginTop: 20, fontSize: '1rem' }}>
        Ai deja un cont?{' '}
        <button
          type="button"
          onClick={goToLogin}
          disabled={loading}
          style={{ fontSize: '1rem' }}
        >
          Loghează-te
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;
