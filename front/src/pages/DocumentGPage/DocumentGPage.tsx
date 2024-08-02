import {ChangeEvent, MouseEvent, useCallback, useEffect, useRef, useState} from 'react'
import {Button, Title} from '../../components'
import {useDocumentGContext} from '../../contexts'

export default function DocumentGPage() {
  /* eslint-disable */
  const {title, contents, addInfoToChangeQ, onBlurTitle, onChangeTitle} = useDocumentGContext()
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false)
  const [mouseDownStart, setMouseDownStart] = useState<number>(-1)
  const [mouseDownEnd, setMouseDownEnd] = useState<number>(-1)
  const [isSelectContents, setIsSelectContents] = useState<boolean>(false)

  // inputRefs : 이걸 써야 blur 가 된다.
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const divRefs = useRef<(HTMLDivElement | null)[]>([])

  /* eslint-enable */

  // AREA2: Test button Area
  const onClickTestButton = useCallback((e: MouseEvent) => {
    if (divRefs.current.length > 3) {
      const selection = window.getSelection()
      const range = document.createRange()

      range.setStart(divRefs.current[1]!, 0)
      range.setEnd(divRefs.current[3]!, 1)

      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [])

  // AREA1: div's Event Area
  const divOnMouseDown = useCallback((e: MouseEvent) => {
    setIsMouseDown(true)
    setMouseDownStart(-1)
    setIsSelectContents(false)
  }, [])
  const divOnMouseUp = useCallback(
    (e: MouseEvent) => {
      setIsMouseDown(false)
      if (isSelectContents) {
        // FUTURE: 나중에 0 혹은 끝으로 바꿔야 한다.
        setMouseDownEnd(0)
      }
    },
    [isSelectContents]
  )

  // AREA2: input_content's event area
  const inputOnChange = useCallback(
    (index: number) => (e: ChangeEvent) => {
      //
    },
    []
  )
  const inputOnMouseDown = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.stopPropagation()
      setIsMouseDown(true)
      setMouseDownStart(index)
      setIsSelectContents(false)
    },
    []
  )
  const inputOnMouseUp = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.stopPropagation()
      setIsMouseDown(false)
      if (isSelectContents) {
        setMouseDownEnd(index)
      }
    },
    [isSelectContents]
  )
  const inputOnMouseOut = useCallback(
    (index: number) => (e: MouseEvent) => {
      if (isMouseDown) {
        setIsSelectContents(true)
      }
    },
    [isMouseDown]
  )
  const inputOnMouseOver = useCallback(
    (index: number) => (e: MouseEvent) => {
      if (isSelectContents) {
        setMouseDownEnd(index)
      }
    },
    [isSelectContents]
  )

  useEffect(() => {
    if (isSelectContents) {
      const lowerIndex = Math.min(mouseDownStart, mouseDownEnd)
      const higherIndex = Math.max(mouseDownStart, mouseDownEnd)

      const selection = window.getSelection()
      if (selection) {
        const range = document.createRange()
        range.setStart(divRefs.current[lowerIndex]!, 0)
        range.setEnd(divRefs.current[higherIndex]!, 1)

        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }, [mouseDownStart, mouseDownEnd, isSelectContents])

  return (
    <div
      className="flex flex-col items-center h-full"
      onMouseDown={divOnMouseDown}
      onMouseUp={divOnMouseUp}>
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
              <div ref={el => (divRefs.current[index] = el)}>
                <input
                  key={`contents:${index}`}
                  onChange={inputOnChange(index)}
                  onMouseDown={inputOnMouseDown(index)}
                  onMouseUp={inputOnMouseUp(index)}
                  onMouseOut={inputOnMouseOut(index)}
                  onMouseOver={inputOnMouseOver(index)}
                  ref={el => (inputRefs.current[index] = el)}
                  value={content || ''}></input>
              </div>
            )
          })}
        <input onChange={inputOnChange((contents && contents.length) || 0)} />
      </div>
      <Button onClick={onClickTestButton}>yes</Button>
    </div>
  )
}
