import {TextXL, Title} from '../../components'
import {useLayoutContext} from '../../contexts/LayoutContext'

export default function MainPage() {
  const {testCnt} = useLayoutContext()
  return (
    <div className="flex flex-col items-center h-full">
      <Title>Main Page</Title>
      <TextXL>Test Result : {testCnt}</TextXL>
    </div>
  )
}
