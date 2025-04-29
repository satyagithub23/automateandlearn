import { Editor } from '@monaco-editor/react'
import React, { useState, useRef, useEffect } from 'react'
import LanguageSelector from './LanguageSelector'
import { CodeSnippets } from './LanguageConstants'
import styles from '@/styles/Codeeditor.module.css'
import CodeOutput from './CodeOutput'


const CodeEditor = () => {

  const editorref = useRef()
  const [value, setvalue] = useState('')
  const [language, setlanguage] = useState("javascript")

  const onMount = (editor) => {
    editorref.current = editor
    editor.focus()
  }


  const onSelect = (language) => {
    setlanguage(language)
    setvalue(CodeSnippets[language])
  }



  return (
    <div className={styles.maincontainer}>
      <div className={styles.editorcontentcontainer}>
        <div className={styles.languageselectorcontainer}>
          <LanguageSelector language={language} onSelect={onSelect} />
        </div>
        <div className={styles.editorcontainer}>
          <Editor
            height="100%"
            theme='vs-dark'
            language={language}
            defaultValue={CodeSnippets[language]}
            value={value}
            onChange={(value) => setvalue(value)}
            onMount={onMount} />
        </div>
      </div>
      <div className={styles.outputcontainer}>
        <CodeOutput editorRef={editorref} lang={language} />
      </div>
    </div>
  )
}

export default CodeEditor