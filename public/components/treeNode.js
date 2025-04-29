import React from 'react'
import styles from '@/styles/FileTreeNode.module.css'
import { Tree } from 'react-arborist'

const FileTreeNode = ({ filename, nodes }) => {
  const data = [{
    "id": "4",
    "name": "user",
    "children": [
      {
        "id": "0",
        "name": "app.js"
      },
      {
        "id": "1",
        "name": "test",
        "children": [
          {
            "id": "0",
            "name": "inner-test",
            "children": [
              {
                "id": "0",
                "name": "testFile.js"
              }
            ]
          }
        ]
      },
      {
        "id": "2",
        "name": "test2",
        "children": []
      },
      {
        "id": "3",
        "name": "test3",
        "children": []
      }
    ]
  }]
  return (
    <div>
      <Tree initialData={ data } />
    </div>
  )
}

export default FileTreeNode