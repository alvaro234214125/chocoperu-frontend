import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        email,
        password,
        role
      });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
