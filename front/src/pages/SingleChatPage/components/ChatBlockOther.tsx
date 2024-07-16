import {DetailedHTMLProps, FC, HTMLAttributes} from 'react'
import {Icon} from '../../../components'
import {ChatContentType} from '../../../common'

export type ChatBlockOtherProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  chatBlock: ChatContentType
  index: number
}

export const ChatBlockOther: FC<ChatBlockOtherProps> = ({chatBlock, index}) => {
  return (
    <div className="DATA_DIV flex flex-row w-fit p-2" key={`chatBlock:${index}`}>
      <Icon
        name="account_circle"
        className="bg-white text-gray-400 rounded-xl border-2 border-gray-800 text-5xl h-fit"
      />
      <div className="CHATBLOCK_DIV flex flex-col ml-2 ">
        <p>{chatBlock.id}</p>
        <p className="bg-white border-black border-2 p-2 rounded-lg">{chatBlock.content}</p>
      </div>
    </div>
  )
}
