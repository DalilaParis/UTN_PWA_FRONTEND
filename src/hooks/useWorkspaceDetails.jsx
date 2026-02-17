import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import useRequest from './useRequest'
import { getWorkspaceById, getChannels, createChannel } from '../services/workspaceService'

const useWorkspaceDetails = () => {
    const { workspace_id } = useParams()
    const [workspace, setWorkspace] = useState(null)
    const [member, setMember] = useState(null)
    const [channels, setChannels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Request hooks
    const workspaceRequest = useRequest()
    const channelsRequest = useRequest()
    const createChannelRequest = useRequest()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Fetch workspace details
                const workspaceData = await workspaceRequest.sendRequest(() => getWorkspaceById(workspace_id))
                setWorkspace(workspaceData.data.workspace)
                setMember(workspaceData.data.member)

                // Fetch channels
                const channelsData = await channelsRequest.sendRequest(() => getChannels(workspace_id))
                setChannels(channelsData.data.channels)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        if (workspace_id) {
            fetchData()
        }
    }, [workspace_id])

    const handleCreateChannel = async (name) => {
        try {
            await createChannelRequest.sendRequest(() => createChannel(workspace_id, name))
            // Refresh channels
            const channelsData = await channelsRequest.sendRequest(() => getChannels(workspace_id))
            setChannels(channelsData.data.channels)
        } catch (err) {
            console.error("Fallo al crear canal", err)
        }
    }

    return {
        workspace,
        member,
        channels,
        loading: loading || workspaceRequest.loading || channelsRequest.loading,
        error: error || workspaceRequest.error || channelsRequest.error,
        handleCreateChannel,
        createChannelLoading: createChannelRequest.loading,
        createChannelError: createChannelRequest.error
    }
}

export default useWorkspaceDetails
