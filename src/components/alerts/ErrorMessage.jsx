import React from 'react'

function Errors({ error }) {
    return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
                Try Again
            </button>
        </div>
    );
}

export default Errors