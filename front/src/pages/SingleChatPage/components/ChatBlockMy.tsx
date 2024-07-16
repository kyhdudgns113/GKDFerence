import {DetailedHTMLProps, FC, HTMLAttributes} from 'react'
import {ChatContentType} from '../../../common'

export type ChatBlockMyProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  chatBlock: ChatContentType
  index: number
}

export const ChatBlockMy: FC<ChatBlockMyProps> = ({chatBlock, index}) => {
  return (
    <div className="CHATBLOCK_DIV flex flex-col w-fit ml-auto mr-2 p-2">
      <p className="bg-white border-black border-2 p-2 rounded-lg">{chatBlock.content}</p>
    </div>
  )
}
