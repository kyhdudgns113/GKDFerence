import {DetailedHTMLProps, FC, HTMLAttributes} from 'react'
import {Icon} from '../../../../components'
import {ChatBlockType} from '../../../../common'

export type DocChatBlockOtherProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  chatBlock: ChatBlockType
  index: number
}

export const DocChatBlockOther: FC<DocChatBlockOtherProps> = ({chatBlock, index}) => {
  return (
    <div className="DATA_DIV flex flex-row w-fit p-2">
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
