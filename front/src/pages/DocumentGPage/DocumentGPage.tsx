import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import {Button, Title} from '../../components'
import {useAuth, useDocumentGContext} from '../../contexts'
import {DocContentType} from '../../common'

export default function DocumentGPage() {
  /* eslint-disable */
  const {dOId, title, contents, addInfoToChangeQ, onBlurTitle, onChangeTitle, setContents} =
    useDocumentGContext()
  const {uOId} = useAuth()

  const [contentsLen, setContentsLen] = useState<number>(0)
  const [contentLastRow, setContentLastRow] = useState<DocContentType>('')
  const [focusRow, setFocusRow] = useState<number | null>(null)
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [isMousePressed, setIsMousePressed] = useState<boolean>(false)
  const [isMouseOutAndPressed, setIsMouseOutAndPressed] = useState<boolean>(false)
  const [isSelectionActivated, setIsSelectionActivated] = useState<boolean>(false)
  const [mouseDownRow, setMouseDownRow] = useState<number | null>(null)
  const [mouseUpRow, setMouseUpRow] = useState<number | null>(null)
  const [mouseOverRow, setMouseOverRow] = useState<number | null>(null)
  const [rangeStartRow, setRangeStartRow] = useState<number | null>(null)
  const [rangeEndRow, setRangeEndRow] = useState<number | null>(null)
  const [selectionRowStart, setSelectionRowStart] = useState<number | null>(null)
  const [selectionRowEnd, setSelectionRowEnd] = useState<number | null>(null)
  const [shiftMouseDownRow, setShiftMouseDownRow] = useState<number | null>(null)

  // contents 가 변했을때 바꾼다.
  const [startRow, setStartRow] = useState<number | null>(null)
  const [endRow, setEndRow] = useState<number | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const divRefs = useRef<(HTMLDivElement | null)[]>([])
  /* eslint-enable */

  const onClickTest = useCallback((e: MouseEvent) => {
    //
  }, [])

  // AREA1: Div Page Area
  const onDragEnterPage = useCallback((e: MouseEvent) => {
    // 이거 해줘야 onDropPage 가 실행된다.
    e.preventDefault()
  }, [])
  const onDragOverPage = useCallback((e: MouseEvent) => {
    // 이거 해줘야 onDropPage 가 실행된다.
    e.preventDefault()
  }, [])
  const onDropPage = useCallback((e: MouseEvent) => {
    e.preventDefault()
    setIsMousePressed(false)
    setMouseUpRow(null)
  }, [])
  const onMouseDownPage = useCallback((e: MouseEvent) => {
    setIsMousePressed(true)
    setMouseDownRow(null)
    setShiftMouseDownRow(null)
  }, [])
  const onMouseOverPage = useCallback((e: MouseEvent) => {
    setMouseOverRow(null)
  }, [])
  const onMouseUpPage = useCallback((e: MouseEvent) => {
    setIsMousePressed(false)
    setMouseUpRow(null)
  }, [])

  // AREA3: input Element Area
  const onBlurInput = useCallback(
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setFocusRow(null)
      setIsChanged(false)
      if (isChanged && startRow !== null && endRow !== null) {
        if (index === contentsLen) {
          setContents(prev => {
            const newPrev = [...prev]
            newPrev.push(e.target.value)
            return newPrev
          })
          setContentLastRow(null)
        }
        addInfoToChangeQ('contents', startRow, endRow, [e.target.value])
      }
    },
    [contentsLen, isChanged, startRow, endRow, addInfoToChangeQ, setContents]
  )
  const onChangeInput = useCallback(
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setIsChanged(true)
      setStartRow(rangeStartRow)
      setEndRow(rangeEndRow)
      if (index < contentsLen) {
        setContents(prev => {
          const newPrev = [...prev]
          newPrev[index] = e.target.value
          return newPrev
        })
      } else {
        // 여기서 setContents 하면 커서 위치 오류가 난다.
        setContentLastRow(e.target.value)
      }
    },
    [contentsLen, rangeStartRow, rangeEndRow, setContents]
  )
  const onClickInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      // NOTE: 클릭 안하고 focus 가 들어오는 경우도 있다보니 가급적 여기서 뭐 하지 말자
    },
    []
  )
  const onDropInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.preventDefault()
      setIsMousePressed(false)
      setMouseUpRow(index)
    },
    []
  )
  const onFocusInput = useCallback(
    (index: number) => (e: FocusEvent) => {
      setFocusRow(index)
    },
    []
  )
  const onKeyDownInput = useCallback(
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      // NOTE: selection 이랑 상관 없이 돌아가는 경우에는 return 해준다.
      switch (e.key) {
        case 'ArrowUp':
          break
        case 'ArrowDown':
          break
      }

      if (isSelectionActivated) {
        if (!e.altKey && !e.ctrlKey && !e.shiftKey && e.key.length === 1) {
          e.preventDefault()
          setIsChanged(true)
          setStartRow(rangeStartRow)
          setEndRow(rangeEndRow)
          setSelectionRowStart(null)
          setSelectionRowEnd(null)
          setContents(prev => {
            const newPrev = [...prev]
            const deleteLen = (rangeEndRow || index) - (rangeStartRow || index) + 1
            newPrev.splice(rangeStartRow || index, deleteLen, e.key)
            return newPrev
          })
        }
      }
    },
    [isSelectionActivated, rangeStartRow, rangeEndRow, setContents]
  )
  const onMouseDownInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.stopPropagation()
      setIsMousePressed(true)
      setMouseDownRow(index)
      if (e.shiftKey) {
        setShiftMouseDownRow(index)
      } else {
        setShiftMouseDownRow(null)
      }
    },
    []
  )
  const onMouseOutInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      if (isMousePressed) {
        setIsMouseOutAndPressed(true)
      }
    },
    [isMousePressed]
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
      setIsMousePressed(false)
      setMouseUpRow(index)
    },
    []
  )

  // Set contentsLen
  useEffect(() => {
    setContentsLen(contents ? contents.length : 0)
  }, [contents])

  // Set isMouseOutAndPressed false
  useEffect(() => {
    setIsMouseOutAndPressed(false)
  }, [focusRow])

  // Set isMouseOutAndPressed false 2
  useEffect(() => {
    if (!isMousePressed) {
      setIsMouseOutAndPressed(false)
    }
  }, [isMousePressed])

  // Set selectionRowStart
  useEffect(() => {
    setSelectionRowStart(focusRow)
  }, [focusRow])

  // Set selectionRowEnd
  useEffect(() => {
    const selectionDrag = isMouseOutAndPressed && isMousePressed

    const justMouseDown = isMousePressed && !isMouseOutAndPressed
    const setNullCondition = justMouseDown || false
    if (selectionDrag) {
      setSelectionRowEnd(mouseOverRow)
    } //
    else if (shiftMouseDownRow !== null) {
      setSelectionRowEnd(shiftMouseDownRow)
    } //
    else if (setNullCondition) {
      setSelectionRowEnd(null)
    }
  }, [isMouseOutAndPressed, isMousePressed, mouseOverRow, shiftMouseDownRow])

  // Set selection
  useEffect(() => {
    if (selectionRowStart !== null && selectionRowEnd !== null && divRefs) {
      const selection = window.getSelection()
      if (selection) {
        const range = document.createRange()

        const lowIndex = Math.min(selectionRowStart, selectionRowEnd)
        const highIndex = Math.max(selectionRowStart, selectionRowEnd)

        const divRefLow = divRefs.current[lowIndex]
        const divRefHigh = divRefs.current[highIndex]

        if (divRefLow !== null && divRefHigh !== null) {
          range.setStart(divRefLow, 0)
          range.setEnd(divRefHigh, 1)

          setRangeStartRow(lowIndex)
          setRangeEndRow(highIndex)

          setIsSelectionActivated(true)
        }

        selection.removeAllRanges()
        selection.addRange(range)
      }
    } else {
      setIsSelectionActivated(false)
    }
  }, [divRefs, selectionRowStart, selectionRowEnd])

  // Set rangeRowStart & And
  useEffect(() => {
    setRangeStartRow(focusRow)
    setRangeEndRow(focusRow)
  }, [focusRow])

  const classNameContent = ['outline-none w-full focus:bg-gkd-sakura-bg'].join(' ')

  const DocumentGContent = (index: number) => (
    <input
      className={classNameContent}
      key={`contents:${index}`}
      onBlur={onBlurInput(index)}
      onChange={onChangeInput(index)}
      onClick={onClickInput(index)}
      onDrop={onDropInput(index)}
      onFocus={onFocusInput(index)}
      onKeyDown={onKeyDownInput(index)}
      onMouseDown={onMouseDownInput(index)}
      onMouseOut={onMouseOutInput(index)}
      onMouseOver={onMouseOverInput(index)}
      onMouseUp={onMouseUpInput(index)}
      ref={el => (inputRefs.current[index] = el)}
      value={index < contentsLen ? (contents && contents[index]) || '' : contentLastRow || ''}
    />
  )

  return (
    <div
      className="flex flex-col items-center h-full "
      onDragEnter={onDragEnterPage}
      onDragOver={onDragOverPage}
      onDrop={onDropPage}
      onMouseDown={onMouseDownPage}
      onMouseOver={onMouseOverPage}
      onMouseUp={onMouseUpPage}>
      <Title>DocumentG Page</Title>
      <Title>MousePressed : {isMousePressed ? 'true' : 'false'}</Title>
      <Title>OutPressed : {isMouseOutAndPressed ? 'true' : 'false'}</Title>
      <Title>selection : {`${selectionRowStart}, ${selectionRowEnd}`}</Title>
      <input
        className="INPUT_TITLE border-2 text-gkd-sakura-text m-2 p-2 text-3xl w-1/3"
        onChange={onChangeTitle}
        onBlur={onBlurTitle}
        value={title}
      />
      <div className="flex flex-col w-1/2 border-gkd-sakura-text border-2">
        {contents &&
          contents.map((content, index) => {
            return (
              <div
                className="DIV_CONTENT w-full selection:bg-gkd-sakura-bg"
                key={`contentsDiv:${index}`}
                ref={el => (divRefs.current[index] = el)}>
                {DocumentGContent(index)}
              </div>
            )
          })}
        <div
          className="DIV_CONTENT w-full selection:bg-gkd-sakura-bg"
          key={`contentsDiv:${contentsLen}`}
          ref={el => (divRefs.current[contentsLen] = el)}>
          {DocumentGContent(contentsLen)}
        </div>
      </div>
      <Button onClick={onClickTest}>yes</Button>
    </div>
  )
}
