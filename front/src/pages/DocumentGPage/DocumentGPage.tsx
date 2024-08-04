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

export default function DocumentGPage() {
  /* eslint-disable */
  const {dOId, title, contents, addInfoToChangeQ, onBlurTitle, onChangeTitle, setContents} =
    useDocumentGContext()
  const {uOId} = useAuth()

  const [mouseDownRow, setMouseDownRow] = useState<number | null>(null)
  const [mouseUpRow, setMouseUpRow] = useState<number | null>(null)
  const [mouseOverRow, setMouseOverRow] = useState<number | null>(null)
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false)
  const [isMouseOutDuringDown, setIsMouseOutDuringDown] = useState<boolean>(false)
  const [rangeStartRow, setRangeStartRow] = useState<number | null>(null)
  const [rangeEndRow, setRangeEndRow] = useState<number | null>(null)
  const [startRow, setStartRow] = useState<number | null>(null)
  const [endRow, setEndRow] = useState<number | null>(null)

  // inputRefs : 이걸 써야 blur 가 된다.
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const divRefs = useRef<(HTMLDivElement | null)[]>([])
  /* eslint-enable */

  const onClickTest = useCallback(
    (e: MouseEvent) => {
      inputRefs.current[1]?.focus()
    },
    [inputRefs]
  )

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
    setIsMouseDown(false)
    setMouseUpRow(null)
  }, [])
  const onMouseDownPage = useCallback((e: MouseEvent) => {
    setIsMouseDown(true)
    setIsMouseOutDuringDown(false)
    setMouseDownRow(null)
    setMouseUpRow(null)
    setRangeStartRow(null)
    setRangeEndRow(null)
    // 이거 여기서 하면 안된다.
    // 여기서 null 이 되고 blur 가 실행된다.
    // setStartRow(null)
    // setEndRow(null)
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
  const onBlurInput = useCallback(
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      if (startRow && endRow) {
        console.log(`Add info to Queue in Page`)
        addInfoToChangeQ('contents', startRow, endRow, [e.currentTarget.value])
      }
    },
    [startRow, endRow, addInfoToChangeQ]
  )
  const onChangeInput = useCallback(
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setStartRow(rangeStartRow || index)
      setEndRow(rangeEndRow || index)

      setContents(prev => {
        if (prev && prev.length > 0) {
          const newPrev = [...prev]
          newPrev[index] = e.target.value
          return newPrev
        } else {
          return [e.target.value]
        }
      })
    },
    [rangeStartRow, rangeEndRow, setContents]
  )
  const onClickInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      // MouseDown -> MouseOut -> MouseEnter -> MouseUp 이어도 실행된다.
      // Chagne 되었을때만 blur 가 실행되게끔 하기위해 여기서 이거 설정 안한다.
      // setMouseDownRow(index)
      // setMouseOverRow(index)
      // setMouseUpRow(index)
    },
    []
  )
  const onDropInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.preventDefault()
      setIsMouseDown(false)
      setMouseUpRow(index)
    },
    []
  )
  const onFocusInput = useCallback(
    (index: number) => (e: FocusEvent) => {
      setStartRow(null)
      setEndRow(null)
    },
    []
  )
  const onKeyDownInput = useCallback(
    (index: number) => (e: KeyboardEvent) => {
      if (isMouseOutDuringDown) {
        // 입력키가 들어왔을 때
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.key.length === 1) {
          e.preventDefault()

          const deleteLen = (rangeEndRow ?? index) - (rangeStartRow ?? index) + 1

          setContents(prev => {
            const newPrev = [...prev]
            newPrev.splice(rangeStartRow ?? index, deleteLen, e.key)
            return newPrev
          })
        }
        setIsMouseOutDuringDown(false)
        setStartRow(rangeStartRow)
        setEndRow(rangeEndRow)
      }
    },
    [isMouseOutDuringDown, rangeStartRow, rangeEndRow, setContents]
  )
  const onMouseDownInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.stopPropagation()
      // console.log('MouseDown')
      setIsMouseDown(true)
      setIsMouseOutDuringDown(false)
      setMouseDownRow(index)
      setRangeStartRow(null)
      setRangeEndRow(null)

      // 이거 여기서 하면 안된다.
      // 여기서 null 이 되고 blur 가 실행된다.
      // setStartRow(null)
      // setEndRow(null)
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

  // Set selection
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
            // onKeyDown 이벤트 어디서 실행할지 결정하기 위해서 필요하다.
            inputRefs.current[lowIndex]?.focus()

            range.setStart(lowRef, 0)
            range.setEnd(highRef, 1)
            setRangeStartRow(lowIndex)
            setRangeEndRow(highIndex)
          }
        }

        selection.removeAllRanges()
        selection.addRange(range)
      }
    }

    return () => {
      // 이거 하면 안된다.
      // selection 이 사라진게 아닌데 rangeStart,End 를 null 로 하면 안된다.
      // setRangeStartRow(null)
      // setRangeEndRow(null)
    }
  }, [divRefs, inputRefs, isMouseDown, isMouseOutDuringDown, mouseDownRow, mouseOverRow])

  const DocumentGContent = (index: number) => (
    <input
      className="INPUT_CONTENT outline-none w-full border-2 focus:bg-gkd-sakura-bg "
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
      value={(contents && contents[index]) || ''}
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
      <Title>Range : {`${rangeStartRow}, ${rangeEndRow}`}</Title>
      <Title>STED : {`${startRow}, ${endRow}`}</Title>
      <input
        className="INPUT_TITLE border-2 text-gkd-sakura-text m-2 p-2 text-3xl w-1/3"
        onChange={onChangeTitle}
        onBlur={onBlurTitle}
        value={title}
      />
      <div className="flex flex-col w-1/2">
        {contents &&
          contents.map((content, index) => {
            return (
              <div
                className="DIV_CONTENT w-full selection:bg-blue-300"
                key={`contentsDiv:${index}`}
                ref={el => (divRefs.current[index] = el)}>
                {DocumentGContent(index)}
              </div>
            )
          })}
        {/* // FUTURE: 여기서 입력을 하면 focus 가 사라진다. */}
        {DocumentGContent((contents && contents.length) || 0)}
      </div>
      <Button onClick={onClickTest}>yes</Button>
    </div>
  )
}
