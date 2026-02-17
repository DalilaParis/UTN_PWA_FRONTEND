import React from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import { register } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import useRegister from '../../hooks/useRegister'

const RegisterScreen = () => {
    const {
        form_state,
        onChangeFieldValue,
        onSubmitForm,
        loading,
        error,
        response
    } = useRegister()
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Slaque</h1>
                    <p>Join Slaque today</p>
                </div>
                <form onSubmit={onSubmitForm} className="auth-form">
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Your username"
                            value={form_state.username}
                            onChange={onChangeFieldValue}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="name@work-email.com"
                            value={form_state.email}
                            onChange={onChangeFieldValue}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Create a password"
                            value={form_state.password}
                            onChange={onChangeFieldValue}
                        />
                    </div>
                    {
                        error && <div style={{ color: '#e01e5a', marginBottom: '10px' }}>{error.message}</div>
                    }
                    {
                        response && response.ok &&
                        <div style={{ color: '#007a5a', marginBottom: '10px' }}>
                            Registration successful! Check your email.
                        </div>
                    }
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <div className="auth-footer">
                    Already using Slaque? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    )
}

export default RegisterScreen