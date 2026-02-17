import React, { useContext } from 'react'
import { Link } from 'react-router'
import { WorkspaceContext } from '../../Context/WorkspaceContext'




const HomeScreen = () => {
    const { workspace_list_loading, workspace_list_error, workspace_list } = useContext(WorkspaceContext)
    console.log(workspace_list)


    if (workspace_list_loading || !workspace_list) {
        return <span>Loading...</span>
    }

    return (
        <div className="home-container">
            <div className="home-header">
                <h1>Welcome back</h1>
                <Link to="/create-workspace" className="btn-primary">Create a new workspace</Link>
            </div>

            {
                workspace_list_error && <div style={{ color: 'red' }}>{workspace_list_error.message}</div>
            }

            <div className="workspace-list">
                {
                    workspace_list?.data?.workspaces?.length > 0 ? (
                        workspace_list.data.workspaces.map(workspace => (
                            <Link
                                to={'/workspace/' + workspace.workspace_id}
                                key={workspace.workspace_id}
                                className="workspace-card"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    {workspace.workspace_image ? (
                                        <img src={workspace.workspace_image} alt={workspace.workspace_title} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', backgroundColor: '#3F0E40', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
                                            {workspace.workspace_title.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h3 style={{ margin: 0 }}>{workspace.workspace_title}</h3>
                                        <p style={{ color: '#616061', margin: '5px 0 0 0', fontSize: '0.9rem' }}>Open Workspace</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <span>No workspaces found. Create one to get started!</span>
                    )
                }
            </div>
        </div>
    )
}

export default HomeScreen