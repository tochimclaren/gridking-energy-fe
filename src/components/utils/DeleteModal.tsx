import React, { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X } from 'lucide-react';

type DeleteModalProps = {
    data: any | null;
    show: boolean;
    title?: string;
    onClose: () => void;
    onConfirmDelete: (data:any) => void;
};

const DeleteModal: React.FC<DeleteModalProps> = ({ data, show, title, onClose, onConfirmDelete }) => {
    return (
        <Transition show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-100"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

                </TransitionChild>

                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-100"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <DialogTitle className="text-lg font-semibold text-center mb-4">
                                Confirm Deletion
                            </DialogTitle>
                            <div className="text-center text-gray-700 mb-6">
                                Are you sure you want to delete{' '}
                                <strong>{title ? data?.name : ''}</strong>?
                            </div>

                            <div className="flex justify-center gap-4">
                                <button
                                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                    onClick={() => data && onConfirmDelete(data)}
                                >
                                    Delete
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DeleteModal;
