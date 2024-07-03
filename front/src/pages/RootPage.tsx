import {Title} from '../components/RootPage/Title'

export default function RootPage() {
  const className_main = [
    'flex',
    'justify-center',
    'items-center',
    'h-screen',
    'bg-gkd-sakura-bg'
  ].join(' ')
  const className_centerElement = [
    'flex flex-col',
    'p-2',
    'bg-white',
    'border-gkd-sakura-border border-4 rounded-2xl'
  ].join(' ')

  const style_centerElemet = {
    width: '400px',
    height: '300px'
  }

  return (
    <div className={className_main}>
      <div className={className_centerElement} style={style_centerElemet}>
        <div className="flex justify-center">
          <Title className="bg-gray-200" />
        </div>
        <div className="bg-gray-200">ID Element</div>
        <div className="bg-gray-300">PW Element</div>
        <div className="flex flex-row">
          <div>Login Button</div>
          <div>SignUp Button</div>
        </div>
      </div>
    </div>
  )
}
