import React from 'react'
import PDFFileManager from '../../components/cms/file/PDFFileManger'
import { useLocation } from "react-router-dom";

function Files() {
  const location = useLocation();
  const { data, refModel } = location.state || {};
  const refId = data._id
  return (
    <div className="container mx-auto py-8">
      <PDFFileManager refModel={refModel} refId={refId} />
    </div>
  )
}

export default Files