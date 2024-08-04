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
  // starRow, endRow : 수정사항이 없으면 null 이 되도록 한다.
  const [startRow, setStartRow] = useState<number | null>(null)
  const [endRow, setEndRow] = useState<number | null>(null)

  const [focusRowAfterRender, setFocusRowAfterRender] = useState<number | null>(null)
  const [cursorAfterRender, setCursorAfterRender] = useState<number>(0)

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

  // AREA2: onKeyDownInput_something area
  const onKeyDownInput_ArrowUp = useCallback(
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      const selectionStart = e.currentTarget.selectionStart
      const selectionEnd = e.currentTarget.selectionEnd
      const selectionDirection = e.currentTarget.selectionDirection
      const cursorCol = (selectionDirection === 'forward' ? selectionEnd : selectionStart) || 0
      if (index > 0) {
        e.preventDefault()
        setCursorAfterRender(cursorCol)
        setFocusRowAfterRender(index - 1)
      }
    },
    []
  )
  const onKeyDownInput_ArrowDown = useCallback(
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      const selectionStart = e.currentTarget.selectionStart
      const selectionEnd = e.currentTarget.selectionEnd
      const selectionDirection = e.currentTarget.selectionDirection
      const cursorCol = (selectionDirection === 'forward' ? selectionEnd : selectionStart) || 0
      if (index < ((contents && contents.length) || 0)) {
        e.preventDefault()
        setCursorAfterRender(cursorCol)
        setFocusRowAfterRender(index + 1)
      }
    },
    [contents]
  )
  const onKeyDownInput_ArrowLeft = useCallback(
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      const selectionEnd = e.currentTarget.selectionEnd
      if (selectionEnd === 0 && index > 0) {
        const upperContents = (contents && contents[index - 1]) || ''
        const upperLen = upperContents.length
        e.preventDefault()
        setFocusRowAfterRender(index - 1)
        setCursorAfterRender(upperLen)
      }
    },
    [contents]
  )
  const onKeyDownInput_ArrowRight = useCallback(
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      const contentsLen = (contents && contents.length) || 0
      const nowContent = (contents && contents[index]) || ''
      const selectionStart = e.currentTarget.selectionStart || 0
      if (selectionStart >= nowContent.length && index < contentsLen) {
        e.preventDefault()
        setFocusRowAfterRender(index + 1)
        setCursorAfterRender(0)
      }
    },
    [contents]
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
        addInfoToChangeQ('contents', startRow, endRow, [e.currentTarget.value])
        setStartRow(null)
        setEndRow(null)
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
      setFocusRowAfterRender(index)
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
      // NOTE: 클릭 안하고 focus 가 들어오는 경우도 있다보니 가급적 여기서 뭐 하지 말자
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
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowUp': {
          onKeyDownInput_ArrowUp(index)(e)
          return
        }
        case 'ArrowDown': {
          onKeyDownInput_ArrowDown(index)(e)
          return
        }
        case 'ArrowLeft': {
          onKeyDownInput_ArrowLeft(index)(e)
          return
        }
        case 'ArrowRight': {
          onKeyDownInput_ArrowRight(index)(e)
          return
        }
      }

      // selection 활성화때
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

          // 얘네는 내용이 바뀔때만 호출되어야 한다.
          // 방향키등을 눌렀을때는 변함 없어야 한다.
          setStartRow(rangeStartRow)
          setEndRow(rangeEndRow)
        }
        setIsMouseOutDuringDown(false)
      }
    },
    [
      isMouseOutDuringDown,
      rangeStartRow,
      rangeEndRow,
      setContents,
      onKeyDownInput_ArrowUp,
      onKeyDownInput_ArrowDown,
      onKeyDownInput_ArrowLeft,
      onKeyDownInput_ArrowRight
    ]
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

  // Set focus after render
  useEffect(() => {
    if (focusRowAfterRender !== null) {
      const inputRef = inputRefs.current[focusRowAfterRender]
      if (inputRef) {
        inputRef.focus()
        inputRef.selectionStart = cursorAfterRender
        inputRef.selectionEnd = cursorAfterRender
      }
      setCursorAfterRender(0)
      setFocusRowAfterRender(null)
    }
  }, [cursorAfterRender, focusRowAfterRender, inputRefs])

  const DocumentGContent = (index: number) => (
    <input
      className="INPUT_CONTENT outline-none w-full focus:bg-gkd-sakura-bg "
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
        {DocumentGContent((contents && contents.length) || 0)}
      </div>
      <Button onClick={onClickTest}>yes</Button>
    </div>
  )
}
