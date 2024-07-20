import {DetailedHTMLProps, FC, HTMLAttributes, useCallback} from 'react'
import {Button} from '../../../components'
import {ChatBlockType, SocketChatContentType} from '../../../common'
import {useAuth} from '../../../contexts'
import {useSingleChatContext} from '../../../contexts/SingleChatContext/SingleChatContext'

export type InputAreaMyProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  //
}

export const InputArea: FC<InputAreaMyProps> = () => {
  const {chatInput, cOId, setChatInput, sockChatEmit} = useSingleChatContext()
  const {id, uOId, jwt} = useAuth()

  const onClickSend = useCallback(() => {
    const chatBlock: ChatBlockType = {
      id: id || '',
      uOId: uOId || '',
      content: chatInput
    }

    if (chatInput && jwt && cOId) {
      const payload: SocketChatContentType = {
        jwt: jwt || '',
        cOId: cOId,
        body: chatBlock
      }
      sockChatEmit('chat', payload)
    } else {
      !jwt && console.log(`jwt is null in InputArea`)
      !cOId && console.log(`cOId is null in InputArea`)
    }
    setChatInput('')
  }, [cOId, id, uOId, jwt, chatInput, setChatInput, sockChatEmit])

  return (
    <div className="DIV_INPUT flex flex-row w-full h-12 bg-white">
      <textarea
        className="p-4 w-full resize-none border-2 border-gkd-sakura-border"
        onChange={e => setChatInput(e.target.value)}
        onKeyDown={e => {
          switch (e.key) {
            case 'Enter':
              e.preventDefault()
              if (e.altKey) {
                setChatInput(prev => prev + '\n')
              } else {
                onClickSend()
              }
              break
          }
        }}
        value={chatInput}
      />
      <Button className="" onClick={e => onClickSend()}>
        send
      </Button>
    </div>
  )
}
