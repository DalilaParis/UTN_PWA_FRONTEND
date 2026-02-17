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
                                <h3>{workspace.workspace_title}</h3>
                                <p style={{ color: '#616061', marginTop: '10px' }}>Open Workspace</p>
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