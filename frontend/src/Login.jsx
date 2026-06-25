import { useState } from 'react';

export default function Login({ setRole }) {
    const [email, setEmail] = useState('');
    const [role, setRoleLocal] = useState('employee');

    const handleLogin = async () => {
        await fetch('http://localhost:10000/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: '123', role })
        });
        setRole(role); // This updates your app to show Recruiter view or Employee view
    };

    return (
        <div className="p-10">
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <select onChange={e => setRoleLocal(e.target.value)}>
                <option value="employee">Employee</option>
                <option value="recruiter">Recruiter</option>
            </select>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}