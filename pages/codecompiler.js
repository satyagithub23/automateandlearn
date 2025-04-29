import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from '@/styles/Compiler.module.css'
import NewTerminal from '@/public/components/newTerminal'
import { Tree } from 'react-arborist'
import Image from 'next/image'
import AceEditor from 'react-ace';
import Head from 'next/head'

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import { ToastContainer, toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import GLOBAL_CONSTANTS from '@/global_constants'
import { io } from 'socket.io-client'
import { useRouter } from 'next/router'
// import { cookies } from 'next/headers'



let socketGlobal;

const CodeCompiler = (props) => {
  const router = useRouter();
  const [filetree, setfiletree] = useState()
  const [selectedFileData, setSelectedFileData] = useState(null)
  const treeRef = useRef(null)
  const [term, setTerm] = useState("");
  const [code, setCode] = useState('')
  const [selectedFileContent, setSelectedFileContent] = useState('')
  const [isSaved, setIsSaved] = useState(true)
  const terminalContainerRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState('100%');
  const [initialOpenState, setInitialOpenState] = useState({})
  const [searchURL, setSearchURL] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const socketRef = useRef(null)
  const [browserVisibility, setbrowserVisibility] = useState(true);


  useEffect(() => {
    console.log(props.fileTree);
    const nodeModuleId = getEachFolder(props.fileTree);
    const initialOpenStateObj = {};
    if (nodeModuleId) {
      initialOpenStateObj[nodeModuleId] = false;
    }

    setfiletree(props.fileTree);
    setInitialOpenState(initialOpenStateObj);
  }, [props.fileTree]);

  useEffect(() => {
    if (!props.port) {
      console.error('Port is undefined');
      return;
    }

    try {
      const portString = props.port.toString();
      console.log(`Port to be sent in headers: ${portString}`);

      const socket = io('https://dockermanager.automateandlearn.fun', {
        // transports: ['websocket'],
        extraHeaders: {
          port: portString
        }
      });

      socket.on('connect', () => {
        console.log("Connected to socket");
        socketGlobal = socket;
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      socketRef.current = socket;
    } catch (error) {
      console.error('Socket connection error:', error);
    }
    window.addEventListener('beforeunload', (event) => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    })
    return () => {
      if (socketRef.current) {
        console.log("Disconnecting socket");
        socketRef.current.disconnect();
        socketRef.current = null; // Explicitly set to null
        socketGlobal = null;      // Explicitly set to null
      }
    };
  }, [props.port]);

  useEffect(() => {
    if (!socketRef.current) return;

    const handleFileRefresh = async () => {
      let data = await fetch(`https://dockermanager.automateandlearn.fun/files`, {
        headers: {
          port: `${props.port}`
        }
      })
      let result = await data.json()

      const nodeModuleId = getEachFolder(result);
      const initialOpenStateObj = {};
      if (nodeModuleId) {
        initialOpenStateObj[nodeModuleId] = false;
      }

      setfiletree(result);
      setInitialOpenState(initialOpenStateObj);
    };

    socketRef.current.on('file:refresh', handleFileRefresh);


    // Cleanup function
    return () => {
      socketRef.current.off('file:refresh', handleFileRefresh);
    };
  }, [setfiletree]);

  const getFileContents = useCallback(async () => {
    if (!selectedFileData) {
      return
    }
    if (selectedFileData.data.id.startsWith('f')) {
      setCode('')
      const path = buildPath(selectedFileData)
      let data = await fetch(`https://dockermanager.automateandlearn.fun/files/content?path=${path}`, {
        headers: {
          port: `${props.port}`
        }
      })
      let result = await data.json()
      setSelectedFileContent(result.content)
    }
  }, [code, selectedFileData, isSaved])

  useEffect(() => {
    if (selectedFileData && selectedFileContent) {
      setCode(selectedFileContent)
    }
  }, [selectedFileData, selectedFileContent])

  useEffect(() => {
    if (code && !isSaved) {
      const filePath = buildPath(selectedFileData)
      const timer = setTimeout(() => {
        socketRef.current.emit('file:change', { path: filePath, code: code })
        setIsSaved(true)
      }, 5 * 1000);
      return () => {
        clearTimeout(timer)
      }
    }
  }, [code, selectedFileData, isSaved])

  useEffect(() => {
    getFileContents()
  }, [selectedFileData])

  useEffect(() => {
    if (selectedFileContent !== code) {
      setIsSaved(false);
    } else {
      setIsSaved(true);
    }
  }, [code, selectedFileContent]);

  useEffect(() => {
    const updateEditorHeight = () => {
      if (terminalContainerRef.current) {
        const terminalHeight = terminalContainerRef.current.offsetHeight;
        setEditorHeight(`calc(100% - ${terminalHeight}px)`);
      }
    };

    window.addEventListener('resize', updateEditorHeight);
    updateEditorHeight();

    return () => {
      window.removeEventListener('resize', updateEditorHeight);
    };
  }, []);

  const onCreate = ({ parentId, index, type }) => { };
  const onRename = ({ id, name }) => { };
  const onMove = ({ dragIds, parentId, index }) => { };
  const onDelete = ({ ids }) => { };
  const onFocus = (e) => { setSelectedFileData(e); console.log(treeRef.current) }


  const createFileFolder = (
    <>
      <span>Create New...</span>
      <div className={styles.fileCreateActionButtonContainer}>
        <button className={styles.fileActionButton} onClick={() => {
          let parentPath = ""
          let id = ""
          if (Object.keys(selectedFileData).length == 0) {
            parentPath = "/"
          } else {
            let
              currentPath = buildPath(selectedFileData)
            if (selectedFileData.data.id.startsWith('d')) {
              parentPath = currentPath
              id = selectedFileData.data.id
            }
            if (selectedFileData.data.id.startsWith('f')) {
              parentPath = currentPath.substring(0, currentPath.lastIndexOf('/', currentPath.lastIndexOf('/'))) + '/'
              id = selectedFileData.parent.data.id
            }
          }
          socketRef.current.emit('file:create-folder', { path: parentPath, id: id })
        }} title="New Folder...">
          <Image src={`/images/new_folder.png`} alt='' width={20} height={20} />
        </button>
        <button className={styles.fileActionButton} onClick={() => {
          let parentPath = ""
          let id = ""
          if (Object.keys(selectedFileData).length == 0) {
            parentPath = "/"
          } else {
            let currentPath = buildPath(selectedFileData)
            if (selectedFileData.data.id.startsWith('d')) {
              parentPath = currentPath
              id = selectedFileData.data.id
            }
            if (selectedFileData.data.id.startsWith('f')) {
              parentPath = currentPath.substring(0, currentPath.lastIndexOf('/', currentPath.lastIndexOf('/'))) + '/'
              id = selectedFileData.parent.data.id
            }
          }
          socketRef.current.emit('file:create-file', { path: parentPath, id: id })
        }} title="New File...">
          <Image src={`/images/new_file.png`} alt='' width={20} height={20} />
        </button>
      </div>
    </>
  );
  const handleInputChange = (e) => {
    setSearchURL(e.target.value);
  };

  const fetchWebViewData = async () => {
    try {
      const response = await fetch(`https://dockermanager.automateandlearn.fun/browse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'url': searchURL,
          'port': props.port,
        },
      });

      const data = await response.text();
      setHtmlContent(data); // Store the fetched data in the state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const closeWindow = async (e) => {
    setbrowserVisibility(false);
  }

  const createMarkup = () => {
    return { __html: htmlContent };
  };


  return (
    <>
      <Head>
        <title>Cloud IDE</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.playgroundContainer}>
        <ToastContainer />
        <div className={styles.editorContainer}>
          <div className={styles.filesContainer}>
            <div className={styles.fileCreateActionContainer}>
              {createFileFolder}
            </div>

            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <Tree
              ref={treeRef}
              data={filetree}
              onCreate={onCreate}
              onRename={onRename}
              onMove={onMove}
              onFocus={onFocus}
              onDelete={onDelete}
              initialOpenState={initialOpenState}
              searchTerm={term}
              searchMatch={(node, term) =>
                node.data.name.toLowerCase().includes(term.toLowerCase())
              }
              key={JSON.stringify(initialOpenState)}
            >
              {Node}
            </Tree>
          </div>
          <div className={styles.editor}>
            {selectedFileData && <div className={styles.editorComponentsContainer}>
              <div className={styles.displayFileNameWithState}>
                {selectedFileData && <span>{selectedFileData.data.name} {isSaved ? '' : '⚪'} </span>}
              </div>
              <div>
                {selectedFileData && <p className={styles.displayFilePath}>{displayCurrentFile(selectedFileData)}</p>}
              </div>
              <AceEditor
                width='100%'
                height={editorHeight}
                fontSize={18}
                value={code}
                onChange={(e) => setCode(e)}
                className={styles.aceEditor}
                setOptions={{ scrollPastEnd: true }}
              />
            </div>}
            <div className={styles.bottomContainers}>
              <div className={styles.terminalContainer} ref={terminalContainerRef}>
                {socketRef.current &&
                  <NewTerminal socket={socketRef.current} />}
              </div>

            </div>
          </div>
          {browserVisibility && <div className={styles.browser}>
            <div className={styles.windowTitleBar}>
              <div className={styles.titleBarButtons}>
                <button className={styles.closeButton} onClick={closeWindow}>✕</button>
              </div>
            </div>
            <div className={styles.browserTopbar}>
              <input type="text" className={styles.inputBox} name='searchURL' placeholder='Enter URL here' value={searchURL} onChange={handleInputChange} />
              <button className={styles.searchbtn} onClick={fetchWebViewData}>Search</button>
            </div>
            <div className={styles.resultBox} dangerouslySetInnerHTML={createMarkup()}></div>
          </div>}

        </div>
      </div>
    </>
  )

}

export async function getServerSideProps(context) {

  const { req } = context
  var token = null
  try {
    const cookies = req.headers.cookie
    const tokenData = cookies.split('=')
    token = tokenData[1]
  } catch (error) {
    return {
      redirect: {
        destination: `${GLOBAL_CONSTANTS.base_url}/login`,
        permanent: false,
      },
    };
  }
  
  const containerPortData = await fetch(`${GLOBAL_CONSTANTS.base_url}/api/startContainer`, {
    headers: {
      token: token
    }
  })
  const result = await containerPortData.json()

  const port = result.port
  const fileTreeData = await fetch(`https://dockermanager.automateandlearn.fun/files`, {
    headers: {
      port: port
    }
  })
  const fileTree = await fileTreeData.json()
  return {
    props: { fileTree, port }
  }
}

function Node({ node, style, dragHandle, tree }) {
  return (
    <div style={style} className={styles.folderTree} ref={dragHandle} onClick={() => {
      node.isInternal && node.toggle();
    }}>
      <div>
        {node.isLeaf ? (
          <span>📜</span>
        ) : (
          <div className={styles.folderNameContainer}>
            <span>
              {node.isOpen ? <Image src={`/images/down_arrow.png`} alt='' width={24} height={24} /> : <Image src={`/images/right_arrow.png`} alt='' width={24} height={24} />}
            </span>
            <span>📂</span>
          </div>
        )}
      </div>
      <span>
        {node.isEditing ? (
          <input
            type="text"
            defaultValue={node.data.name}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={() => node.reset()}
            onKeyDown={(e) => {
              if (e.key === "Escape") node.reset();
              if (e.key === "Enter") {
                node.submit(e.currentTarget.value);
                let renameTo = "";
                let filePath = buildPath(node);
                if (node.data.id.startsWith("d")) {
                  renameTo = filePath.substring(0, filePath.lastIndexOf('/', filePath.lastIndexOf('/') - 1)) + '/';
                  renameTo += e.currentTarget.value + '/';
                } else {
                  renameTo = filePath.substring(0, filePath.lastIndexOf('/')) + '/';
                  renameTo += e.currentTarget.value;
                }
                socketGlobal.emit('file:rename', { path: filePath, renameTo: renameTo });
              }
            }}
            autoFocus
          />
        ) : (
          <span className={styles.dataName}>{node.data.name}</span>
        )}
      </span>
      <div className={styles.fileActionContainer}>
        <div className="file-actions">
          <div className="folderFileActions">
            <button className={styles.fileActionButton} onClick={() => node.edit()} title="Rename...">
              <Image src={`/images/edit.png`} alt='' width={20} height={20} />
            </button>
            <button className={styles.fileActionButton} onClick={() => {
              let toBeDeletedFilePath = buildPath(node);
              let type = "";
              if (node.data.name == 'user') {
                toast.error("Permission Denied", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                  transition: Bounce,
                });
                return;
              }
              if (node.data.id.startsWith('d')) {
                type = 'directory';
              } else {
                type = 'file';
              }
              socketGlobal.emit('file:delete', { path: toBeDeletedFilePath, type: type });
            }}
              title="Delete">
              <Image src={`/images/delete.png`} alt='' width={20} height={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildPath(node) {
  let finalPath = ""
  function build(node) {
    let nodeType = (node.data.id)
    let renameFile = (node.data.name)
    if (nodeType.startsWith('f')) {
      finalPath = `${renameFile}`
    } else {
      finalPath = `${renameFile}/${finalPath}`
    }
    if (node.level != 0) {
      build(node.parent)
    }
  }
  build(node)
  return finalPath
}

function displayCurrentFile(node) {
  if (node) {
    if (node.data.id.startsWith('f')) {
      const path = buildPath(node)
      return path.replaceAll('/', ' > ')
    }
  } else {
    return null
  }
}

function getEachFolder(items) {
  let elementId = '';
  function search(items) {
    for (const element of items) {
      if (element.children && element.children.length > 10) {
        elementId = element.id;
        return;
      }
      if (element.children) {
        search(element.children);
      }
    }
  }
  search(items);
  return elementId;
}

export default CodeCompiler