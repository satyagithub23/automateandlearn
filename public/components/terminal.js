import React, { useRef, useState, useEffect } from 'react'
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'




const TerminalWindow = () => {

    const terminalRef = useRef(null)
    const [command, setcommand] = useState('cd')
    const [inputValue, setInputValue] = useState('');
    const [folder, setfolder] = useState('')

    useEffect(() => {
        const term = new Terminal({
            fontSize: 13,
            fontFamily: '"Menlo for Powerline", Menlo, Consolas, "Liberation Mono", Courier, monospace',
            theme: {
                foreground: '#d2d2d2',
                background: '#2b2b2b',
                cursor: '#adadad',
                black: '#000000',
                red: '#d81e00',
                green: '#5ea702',
                yellow: '#cfae00',
                blue: '#427ab3',
                magenta: '#89658e',
                cyan: '#00a7aa',
                white: '#dbded8',
                brightBlack: '#686a66',
                brightRed: '#f54235',
                brightGreen: '#99e343',
                brightYellow: '#fdeb61',
                brightBlue: '#84b0d8',
                brightMagenta: '#bc94b7',
                brightCyan: '#37e6e8',
                brightWhite: '#f1f1f0'
            },
            convertEol: true
        })
        term.open(terminalRef.current)

        let currLine = "";
        let entries = [];
        term.onKey((ev) => {
            if (ev.domEvent.key == "Enter") {
                if (currLine) {
                    entries.push(currLine);
                    fetchTerminalCommand(currLine).then((response) => {
                        term.write('\r\n')
                        term.writeln(`${response.output}`);
                        term.write(`${folder}>`)
                    })
                }
                currLine = '';
                setInputValue('')
            } else if (ev.domEvent.key == "Backspace") {
                if (currLine) {
                    currLine = currLine.slice(0, currLine.length - 1);
                    term.write("\b \b");
                }
            } else {
                currLine += ev.key
                term.write(ev.key);
                console.log(`Current line: ${currLine}`);
                setInputValue(currLine)
            }
        });

        fetchTerminalCommand(command).then((response) => {
            term.write(`${response.output.trim()}>`)
            term.focus()
            setfolder(response.output.trim())
        }).catch((error) => {
            console.log(error);
        })

        return () => {
            term.dispose()
        }
    }, [])

    useEffect(() => {
        console.log('Updated inputValue:', inputValue);
    }, [inputValue]);


    const fetchTerminalCommand = async (command) => {
        console.log(`encoded command ${encodeURIComponent(command)}`);
        const response = await fetch(`/api/terminalCommandExec?command=${encodeURIComponent(command)}\n`);
        if (!response.ok) {
            console.log(response.error);
            return response.json()
        }
        return response.json();
    };




    return (
        <div ref={terminalRef}>
        </div>
    )
}

export async function getServerSideProps() {
    let commandRes = await fetch(`http://localhost:3000/api/terminalCommandExec?command=${command}`)
    let message = await commandRes.json()
    return {
        props: message
    };
}

export default TerminalWindow

