import {MouseEvent, useCallback, useEffect, useRef, useState} from 'react'
import {Button, Title} from '../../components'
import {useDocumentGContext} from '../../contexts'

export default function DocumentGPage() {
  /* eslint-disable */
  const {title, contents, addInfoToChangeQ, onBlurTitle, onChangeTitle} = useDocumentGContext()

  const [mouseDownRow, setMouseDownRow] = useState<number | null>(null)
  const [mouseUpRow, setMouseUpRow] = useState<number | null>(null)
  const [mouseOverRow, setMouseOverRow] = useState<number | null>(null)
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false)
  const [isMouseOutDuringDown, setIsMouseOutDuringDown] = useState<boolean>(false)

  // inputRefs : 이걸 써야 blur 가 된다.
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const divRefs = useRef<(HTMLDivElement | null)[]>([])
  /* eslint-enable */

  // AREA1: Div Page Area
  const onMouseDownPage = useCallback((e: MouseEvent) => {
    setIsMouseDown(true)
    setIsMouseOutDuringDown(false)
    setMouseDownRow(null)
    setMouseUpRow(null)
  }, [])
  const onMouseOverPage = useCallback((e: MouseEvent) => {
    setMouseOverRow(null)
  }, [])
  const onMouseUpPage = useCallback((e: MouseEvent) => {
    setIsMouseDown(false)

    // NOTE: 이 상태는 MouseDown 된 상태로 MouseOut 된적이 있는지 저장하는 상태다.
    // NOTE: MouseUp 이 되었다고 해서 그 상태가 사라지는건 아니다.
    // setIsMouseOutDuringDown(false)
    setMouseDownRow(null)
    setMouseUpRow(null)
  }, [])

  // AREA2: input Element Area
  const onClickInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      // MouseDown -> MouseOut -> MouseEnter -> MouseUp 이어도 실행된다.
      // console.log('Click')
    },
    []
  )
  const onMouseDownInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.stopPropagation()
      // console.log('MouseDown')
      setIsMouseDown(true)
      setIsMouseOutDuringDown(false)
      setMouseDownRow(index)
    },
    []
  )
  const onMouseOutInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      if (isMouseDown) {
        setIsMouseOutDuringDown(true)
      }
    },
    [isMouseDown]
  )
  const onMouseOverInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.stopPropagation()
      setMouseOverRow(index)
    },
    []
  )
  const onMouseUpInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.stopPropagation()
      // console.log('MouseUp')
      setIsMouseDown(false)
      setMouseUpRow(index)
    },
    []
  )

  useEffect(() => {
    if (divRefs.current && isMouseOutDuringDown && isMouseDown) {
      const selection = window.getSelection()

      if (selection) {
        const range = document.createRange()

        if (mouseDownRow !== null && mouseOverRow !== null) {
          const lowIndex = Math.min(mouseDownRow, mouseOverRow)
          const highIndex = Math.max(mouseDownRow, mouseOverRow)
          const lowRef = divRefs.current[lowIndex]
          const highRef = divRefs.current[highIndex]

          if (lowRef && highRef) {
            range.setStart(lowRef, 0)
            range.setEnd(highRef, 1)
          }
        }

        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }, [divRefs, isMouseDown, isMouseOutDuringDown, mouseDownRow, mouseOverRow])

  return (
    <div
      className="flex flex-col items-center h-full"
      onMouseDown={onMouseDownPage}
      onMouseOver={onMouseOverPage}
      onMouseUp={onMouseUpPage}>
      <Title>DocumentG Page</Title>
      <input
        className="border-2 text-gkd-sakura-text m-2 p-2 text-3xl w-1/3"
        onChange={onChangeTitle}
        onBlur={onBlurTitle}
        value={title}
      />
      <div className="flex flex-col w-1/2 border-2">
        {contents &&
          contents.map((content, index) => {
            return (
              <div
                className="w-full selection:bg-gkd-sakura-bg"
                ref={el => (divRefs.current[index] = el)}>
                <input
                  className="w-full border-2 focus:bg-gkd-sakura-bg"
                  key={`contents:${index}`}
                  onChange={e => {}}
                  onClick={onClickInput(index)}
                  onMouseDown={onMouseDownInput(index)}
                  onMouseOut={onMouseOutInput(index)}
                  onMouseOver={onMouseOverInput(index)}
                  onMouseUp={onMouseUpInput(index)}
                  ref={el => (inputRefs.current[index] = el)}
                  value={content || ''}
                />
              </div>
            )
          })}
        <input />
      </div>
      <Button>yes</Button>
    </div>
  )
}
