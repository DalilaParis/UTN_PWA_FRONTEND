import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import useRequest from './useRequest'
import { getMessages, createMessage } from '../services/channelService'

const useChannel = (channelId) => {
    const { workspace_id } = useParams()
    const [messages, setMessages] = useState([])

    const messagesRequest = useRequest()
    const sendMessageRequest = useRequest()

    const fetchMessages = async () => {
        if (!channelId || !workspace_id) return
        try {
            const data = await messagesRequest.sendRequest(() => getMessages(workspace_id, channelId))
            setMessages(data.data.messages)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchMessages()
        // Simple polling every 3 seconds
        const interval = setInterval(fetchMessages, 3000)
        return () => clearInterval(interval)
    }, [workspace_id, channelId])

    const handleSendMessage = async (content) => {
        try {
            await sendMessageRequest.sendRequest(() => createMessage(workspace_id, channelId, content))
            fetchMessages() // Refresh immediately
        } catch (err) {
            console.error(err)
        }
    }

    return {
        messages,
        loading: messagesRequest.loading,
        error: messagesRequest.error,
        sendMessage: handleSendMessage,
        sending: sendMessageRequest.loading
    }
}

export default useChannel
