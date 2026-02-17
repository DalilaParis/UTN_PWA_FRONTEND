import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { login } from '../../services/authService'
import useLogin from '../../hooks/useLogin'

const LoginScreen = () => {
    const {
        form_state,
        onChangeFieldValue,
        onSubmitForm,
        loading,
        error,
        response
    } = useLogin()

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Slaque</h1>
                    <p>Sign in to your workspace</p>
                </div>
                <form onSubmit={onSubmitForm} className="auth-form">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="name@work-email.com"
                            onChange={onChangeFieldValue}
                            value={form_state.email}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Your password"
                            onChange={onChangeFieldValue}
                            value={form_state.password}
                        />
                    </div>
                    {
                        error && <div style={{ color: '#e01e5a', marginBottom: '10px' }}>{error.message}</div>
                    }
                    <button type="submit" className="btn-primary" disabled={loading || (response && response.ok)}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <div className="auth-footer">
                    New to Slaque? <Link to="/register">Create an account</Link>
                </div>
            </div>
        </div>
    )
}

export default LoginScreen