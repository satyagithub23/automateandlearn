import React, { useState, useEffect, useRef } from 'react'
import styles from '@/styles/Codeoutput.module.css'
import { getServerSideProps } from '@/pages'
import { executeCode } from '@/pages/api/codeExecutor'
import TerminalWindow from './terminal'
import { Terminal } from '@xterm/xterm'
import NewTerminal from '@/public/components/newTerminal'


const CodeOutput = ({ editorRef, lang }) => {

    const [output, setoutput] = useState(null)
    const [command, setcommand] = useState("")

    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;
        try {
            const {run:result} = await executeCode(lang, sourceCode);
            setoutput(result.output)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.maincontainer}>
            <button type="submit" onClick={runCode} className={styles.coderunbtn}>Run Code</button>
            <div className={styles.outputcontainer}>
                {/* {
                    output ? output : "Click Run Code Button To Execute The Code"
                } */}
                <NewTerminal />
            </div>
        </div>
        
    )
}

export default CodeOutput

// export async function getServerSideProps() {
//     let data = await fetch('')
// }