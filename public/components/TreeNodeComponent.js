import React from 'react';
import Image from 'next/image';
import styles from '@/styles/Compiler.module.css';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socket from '@/socket';

function buildPath(node) {
  let finalPath = "";
  function build(node) {
    let nodeType = (node.data.id);
    let renameFile = (node.data.name);
    if (nodeType.startsWith('f')) {
      finalPath = `${renameFile}`;
    } else {
      finalPath = `${renameFile}/${finalPath}`;
    }
    if (node.level != 0) {
      build(node.parent);
    }
  }
  build(node);
  return finalPath;
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
                socket.emit('file:rename', { path: filePath, renameTo: renameTo });
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
              socket.emit('file:delete', { path: toBeDeletedFilePath, type: type });
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

export default Node;
