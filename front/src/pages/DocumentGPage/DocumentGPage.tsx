import {Title} from '../../components'
import {useDocumentGContext} from '../../contexts'

export default function DocumentGPage() {
  const {title, contents, setTitle, setContents, onChangeTitle} = useDocumentGContext() // eslint-disable-line

  return (
    <div className="flex flex-col items-center h-full">
      <Title>DocumentG Page</Title>
      <input
        className="border-2 text-gkd-sakura-text m-2 p-2 text-3xl w-1/3"
        onChange={onChangeTitle}
        value={title}></input>
    </div>
  )
}
