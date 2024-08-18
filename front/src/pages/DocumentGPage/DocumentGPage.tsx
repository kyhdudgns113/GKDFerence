import {DocumentGChatting} from './DocumentGChatting/DocumentGChatting'
import DocumentGContents from './DocumentGContents'

export default function DocumentGPage() {
  return (
    <div className="flex flex-row w-full h-full">
      <DocumentGContents />
      <DocumentGChatting />
    </div>
  )
}
