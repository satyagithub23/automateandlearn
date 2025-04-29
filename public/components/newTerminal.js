import React, { useRef, useEffect, useState } from 'react'
import { Terminal as XTerminal } from '@xterm/xterm'
// import { FitAddon } from '@xterm/addon-fit'
// import socket from '@/socket'
import '@xterm/xterm/css/xterm.css'


const NewTerminal = ({ socket }) => {

    const terminalRef = useRef()
    const [terminal, setTerminal] = useState(null);
    const fitAddonRef = useRef(null);

    useEffect(() => {
        console.log('socket in terminal', socket);
        
        const initializeTerminal = async () => {
            const { FitAddon } = await import('@xterm/addon-fit');
            const { WebLinksAddon } = await import('@xterm/addon-web-links');

            const term = new XTerminal({
                rows: 24,
                cols: 100,
                theme: {
                    background: '#140633'
                }
            });

            const fitAddon = new FitAddon();
            term.loadAddon(fitAddon);
            term.loadAddon(new WebLinksAddon());
            term.open(terminalRef.current);
            fitAddon.fit();
            fitAddonRef.current = fitAddon;
            const { rows, cols } = fitAddonRef.current.proposeDimensions() || {};
            if (rows && cols) {
                term.resize(cols, rows);
                socket.emit('terminal:resize', { cols, rows });
            }
            setTerminal(term);

            term.onData((data) => {
                socket.emit("terminal:write", data)
            })

            socket.on('terminal:data', data => {
                term.write(data)
            })
        }
        if (typeof window !== 'undefined') {
            initializeTerminal();
        }
    }, [])

    useEffect(() => {
        const handleResize = () => {
            if (terminal && terminalRef.current) {
                const { offsetWidth, offsetHeight } = terminalRef.current;
                const cols = Math.floor(offsetWidth / terminal._core._renderService.dimensions.actualCellWidth);
                const rows = Math.floor(offsetHeight / terminal._core._renderService.dimensions.actualCellHeight);

                terminal.resize(cols, rows);
                socket.emit('terminal:resize', { cols, rows });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [terminal]);


    return (
        <div ref={terminalRef} style={{ height: '100%', width: '100%', overflow: 'auto' }}
            onResize={() => {
                if (terminal && terminalRef.current) {
                    const { offsetWidth, offsetHeight } = terminalRef.current;
                    const cols = Math.floor(offsetWidth / terminal._core._renderService.dimensions.actualCellWidth);
                    const rows = Math.floor(offsetHeight / terminal._core._renderService.dimensions.actualCellHeight);

                    terminal.resize(cols, rows);
                    socket.emit('terminal:resize', { cols, rows });
                }
            }}></div>
    )
}

export default NewTerminal