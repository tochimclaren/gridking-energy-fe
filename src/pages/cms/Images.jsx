import React, { useState } from 'react';
import ImageGallery from '../../components/cms/images/ImageGallery'
import ImageDelete from '../../components/cms/images/ImageDelete'
import ImageUpload from '../../components/cms/images/UploadImage'
import { useLocation } from "react-router-dom";


const Images = () => {
    const [activeTab, setActiveTab] = useState('view');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const location = useLocation();
    const { data, refModel } = location.state || {};
    const refId = data._id

    // Function to refresh components after operations
    const refreshData = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-6 text-center">Images</h1>
                        
            <div className="container mx-auto py-6 px-4 min-w-fit">
                <div className="mb-6">
                    <div className="flex border-b overflow-x-auto">
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === 'view'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('view')}
                        >
                            View Images
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === 'upload'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('upload')}
                        >
                            Upload
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === 'delete'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('delete')}
                        >
                            Manage
                        </button>
                    </div>
                </div>

                <div className="transition-opacity duration-300">
                    {activeTab === 'view' && <ImageGallery key={`gallery-${refreshTrigger}`} refModel={refModel} refId={refId} />}
                    {activeTab === 'upload' && (
                        <ImageUpload key={`upload-${refreshTrigger}`} onUploadComplete={() => {
                                refreshData(); setActiveTab('view'); }} refModel={refModel} refId={refId}/>
                    )}
                    {activeTab === 'delete' && (
                        <ImageDelete key={`delete-${refreshTrigger}`}
                            onDeleteComplete={() => { refreshData(); }} refModel={refModel} refId={refId} />
                    )}
                </div>
            </div>
        </>
    );
};

export default Images;