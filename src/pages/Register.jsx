import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');

  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        email,
        password,
        role
      });

      login(res.data.token);

      navigate('/');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <div>
        <label>
          <input
            type="radio"
            value="USER"
            checked={role === 'USER'}
            onChange={e => setRole(e.target.value)}
          />
          User
        </label>

        <label style={{ marginLeft: '1rem' }}>
          <input
            type="radio"
            value="PROVIDER"
            checked={role === 'PROVIDER'}
            onChange={e => setRole(e.target.value)}
          />
          Provider
        </label>
      </div>

      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
