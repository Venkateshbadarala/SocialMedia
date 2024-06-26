"use client";
import React, { useState } from 'react';
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

export function Regular({ onImageChange }) {
  const [files, setFiles] = useState([]);

  const handleChangeEvent = (files) => {
    console.log('change event payload:', files);
    const successfulFiles = files.allEntries.filter(f => f.status === 'success');
    const imageUrls = successfulFiles.map(file => file.cdnUrl);
    setFiles(successfulFiles);
    onImageChange(imageUrls); // Pass image URLs to the parent component
  }

  const formatSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  }

  return (
    <div>
      <FileUploaderRegular onChange={handleChangeEvent} pubkey="a6ca334c3520777c0045" />
      <div>
        {files.map((file) => (
          <div key={file.uuid}>
            <img
              src={`${file.cdnUrl}/-/preview/-/resize/x400/`}
              width="200"
              height="200"
              alt={file.fileInfo.originalFilename || ''}
              title={file.fileInfo.originalFilename || ''}
            />
            <p>{file.fileInfo.originalFilename}</p>
            <p>{formatSize(file.fileInfo.size)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
