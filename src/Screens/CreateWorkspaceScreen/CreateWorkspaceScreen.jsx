import React from 'react';
import { Link, useNavigate } from 'react-router';
import useCreateWorkspace from '../../hooks/useCreateWorkspace';
import './CreateWorkspaceScreen.css';

const CreateWorkspaceScreen = () => {
    const {
        form_state,
        onChangeFieldValue,
        onSubmitForm,
        isLoading,
        error,
        errors
    } = useCreateWorkspace();

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '600px' }}>
                <div className="auth-header">
                    <h1>Create a new workspace</h1>
                    <p>Workspaces are your way to communicate.</p>
                </div>

                <form className="auth-form" onSubmit={onSubmitForm}>
                    <div>
                        <label htmlFor="title">Workspace Name</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Ex. Project Alpha"
                            value={form_state.title}
                            onChange={onChangeFieldValue}
                            disabled={isLoading}
                        />
                        {errors.title && <div style={{ color: '#e01e5a', fontSize: '0.9rem' }}>{errors.title}</div>}
                    </div>

                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="What is this workspace about?"
                            value={form_state.description}
                            onChange={onChangeFieldValue}
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid var(--slack-border)',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                minHeight: '100px',
                                fontFamily: 'inherit'
                            }}
                        />
                        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#616061' }}>
                            {form_state.description.length} / 1000
                        </div>
                        {errors.description && <div style={{ color: '#e01e5a', fontSize: '0.9rem' }}>{errors.description}</div>}
                    </div>

                    {error && <div style={{ color: '#e01e5a', marginBottom: '10px' }}>Error: {error.message}</div>}

                    <button type="submit" className="btn-primary" disabled={form_state.description.length > 1000 || isLoading}>
                        {isLoading ? 'Creating...' : 'Create Workspace'}
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/home">Back to workspaces</Link>
                </div>
            </div>
        </div>
    );
};

export default CreateWorkspaceScreen;