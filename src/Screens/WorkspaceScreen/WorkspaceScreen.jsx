import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router'
import useWorkspaceDetails from '../../hooks/useWorkspaceDetails'
import useChannel from '../../hooks/useChannel'
import { inviteUser, getMembers, deleteWorkspace } from '../../services/workspaceService'
import { WorkspaceContext } from '../../Context/WorkspaceContext'
import './WorkspaceScreen.css'

const WorkspaceScreen = () => {
    const navigate = useNavigate()
    const { refreshWorkspaces } = useContext(WorkspaceContext)
    const {
        workspace,
        member,
        channels,
        loading: workspaceLoading,
        error: workspaceError,
        handleCreateChannel
    } = useWorkspaceDetails()

    const [selectedChannelId, setSelectedChannelId] = useState(null)
    const [newChannelName, setNewChannelName] = useState('')


    const [showInviteModal, setShowInviteModal] = useState(false)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteStatus, setInviteStatus] = useState(null)


    const [showMembersModal, setShowMembersModal] = useState(false)
    const [members, setMembers] = useState([])
    const [membersLoading, setMembersLoading] = useState(false)


    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const handleInvite = async (e) => {
        e.preventDefault()
        setInviteStatus(null)
        try {
            await inviteUser(workspace._id, inviteEmail)
            setInviteStatus({ type: 'success', message: 'Invitación enviada!' })
            setInviteEmail('')
            setTimeout(() => {
                setShowInviteModal(false)
                setInviteStatus(null)
            }, 2000)
        } catch (err) {
            setInviteStatus({ type: 'error', message: err.message || 'Error al enviar invitación.' })
        }
    }

    const handleShowMembers = async () => {
        setShowMembersModal(true)
        setMembersLoading(true)
        try {
            const response = await getMembers(workspace._id)
            setMembers(response.data.members)
        } catch (err) {
            console.error("Error al obtener miembros", err)
        } finally {
            setMembersLoading(false)
        }
    }

    const handleDeleteWorkspace = async () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este workspace? Esta acción no se puede deshacer.')) {
            try {
                await deleteWorkspace(workspace._id)
                refreshWorkspaces()
                navigate('/home')
            } catch (err) {
                alert('Error al eliminar workspace: ' + (err.message || 'Error desconocido'))
            }
        }
    }

    useEffect(() => {
        if (!selectedChannelId && channels.length > 0) {
            setSelectedChannelId(channels[0]._id)
        }
    }, [channels, selectedChannelId])

    if (workspaceLoading) return <span>Cargando workspace...</span>
    if (workspaceError) return <span>Error al cargar workspace: {workspaceError.message}</span>
    if (!workspace) return <span>Workspace no encontrado</span>

    return (
        <div className="workspace-container">
            <div className="mobile-header">
                <button className="mobile-menu-toggle" onClick={() => setShowMobileMenu(true)}>☰</button>
                <div style={{ fontWeight: 'bold' }}>{workspace.title}</div>
            </div>

            <div className={`workspace-sidebar ${showMobileMenu ? 'show' : ''}`}>
                <div className="workspace-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/home" className="back-button" style={{ marginBottom: '10px', display: 'inline-block' }}>← Volver al Home</Link>
                        <button className="mobile-menu-toggle" onClick={() => setShowMobileMenu(false)} style={{ color: 'white', marginBottom: '10px' }}>×</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {workspace.image ? (
                            <img src={workspace.image} alt={workspace.title} style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '36px', height: '36px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                                {workspace.title.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{workspace.title}</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                            onClick={() => setShowInviteModal(true)}
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.3)',
                                color: 'white',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                flex: 1
                            }}
                        >
                            + Invitar
                        </button>
                        <button
                            onClick={handleShowMembers}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: 'white',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                flex: 1
                            }}
                        >
                            Miembros
                        </button>
                    </div>
                </div>
                <div className="channels-list">
                    <h3>Canal</h3>
                    <ul>
                        {channels.map(channel => (
                            <li
                                key={channel._id}
                                onClick={() => setSelectedChannelId(channel._id)}
                                className={selectedChannelId === channel._id ? 'active' : ''}
                            >
                                # {channel.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="create-channel">
                    <input
                        type="text"
                        placeholder="Crear canal"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                    />
                    <button onClick={() => {
                        if (newChannelName.trim()) {
                            handleCreateChannel(newChannelName)
                            setNewChannelName('')
                        }
                    }}>
                        +
                    </button>
                </div>
            </div>
            <div className="workspace-main">
                {selectedChannelId ? (
                    <ChannelChat channelId={selectedChannelId} channels={channels} />
                ) : (
                    <div className="no-channel-selected">Selecciona un canal para comenzar a chatear</div>
                )}
            </div>

            {showInviteModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: '#1d1c1d'
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Invitar a {workspace.title}</h3>
                        <form onSubmit={handleInvite}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                    style={{
                                        width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem'
                                    }}
                                />
                            </div>
                            {inviteStatus && (
                                <div style={{
                                    marginBottom: '15px',
                                    color: inviteStatus.type === 'error' ? '#e01e5a' : '#007a5a',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                }}>
                                    {inviteStatus.message}
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    Enviar invitación
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {showMembersModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '500px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: '#1d1c1d',
                        maxHeight: '80vh', display: 'flex', flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>Miembros de {workspace.title}</h3>
                            <button onClick={() => setShowMembersModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px' }}>
                            {membersLoading ? (
                                <div>Cargando miembros...</div>
                            ) : (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {members.map(m => (
                                        <li key={m._id} style={{ padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '4px',
                                                backgroundColor: stringToColor(m.fk_id_user?.username || 'User'),
                                                color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold'
                                            }}>
                                                {(m.fk_id_user?.username || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{m.fk_id_user?.username || 'Unknown User'}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#616061' }}>{m.fk_id_user?.email} • {m.role}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {member && member.role === 'Owner' && (
                            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginTop: 'auto' }}>
                                <button
                                    onClick={handleDeleteWorkspace}
                                    style={{
                                        background: '#e01e5a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', width: '100%'
                                    }}
                                >
                                    Eliminar Workspace
                                </button>
                                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#616061', marginTop: '5px' }}>
                                    Advertencia: Esta acción no se puede deshacer.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const ChannelChat = ({ channelId, channels }) => {
    const { messages, loading, sendMessage, hasFetchedOnce } = useChannel(channelId)
    const [newMessage, setNewMessage] = useState('')

    const channel = channels.find(c => c._id === channelId)

    const handleSend = (e) => {
        e.preventDefault()
        if (newMessage.trim()) {
            sendMessage(newMessage)
            setNewMessage('')
        }
    }

    return (
        <div className="channel-chat">
            <div className="channel-header">
                # {channel ? channel.name : 'channel'}
            </div>
            <div className="messages-list">
                {messages.map(msg => {
                    const authorName = msg.fk_workspace_member_id?.fk_id_user?.username || msg.author_name || 'User'
                    const initial = authorName.charAt(0).toUpperCase()
                    const time = new Date(msg.created_at || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                    return (
                        <div key={msg._id} className="message-item">
                            <div className="message-avatar" style={{ backgroundColor: stringToColor(authorName) }}>
                                {initial}
                            </div>
                            <div className="message-body">
                                <div className="message-header">
                                    <span className="message-author">{authorName}</span>
                                    <span className="message-time">{time}</span>
                                </div>
                                <div className="message-content">{msg.mensaje || msg.content}</div>
                            </div>
                        </div>
                    )
                })}
                {messages.length === 0 && hasFetchedOnce && !loading && (
                    <div style={{ padding: '20px', color: '#616061' }}>No hay mensajes aun. Di hola!</div>
                )}
            </div>
            <div className="input-area-container">
                <form className="message-input" onSubmit={handleSend}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Escribe un mensaje en #${channel ? channel.name : 'channel'}`}
                    />
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </div>
    )
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + "00000".substring(0, 6 - c.length) + c;
}

export default WorkspaceScreen
