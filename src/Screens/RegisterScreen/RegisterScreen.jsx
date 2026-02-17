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
                    <h1>Slack</h1>
                    <p>Únete a Slack</p>
                </div>
                <form onSubmit={onSubmitForm} className="auth-form">
                    <div>
                        <label htmlFor="username">Nombre de usuario</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Tu nombre de usuario"
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
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Crea una contraseña"
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
                            Registro exitoso! Mira tu email para confirmar la validación.
                        </div>
                    }
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
                <div className="auth-footer">
                    ¿Ya tienes Slack? <Link to="/login">Inicia sesión</Link>
                </div>
            </div>
        </div>
    )
}

export default RegisterScreen