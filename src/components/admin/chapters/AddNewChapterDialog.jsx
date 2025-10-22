"use client"

import React from 'react'
import { Button } from "@/UI/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/UI/Dialog";

const AddNewChapterDialog = ({ onSuccess }) => {
    const nameRef = React.useRef();
    const urlRef = React.useRef();
    const cityRef = React.useRef();
    const descriptionRef = React.useRef();


    async function handleSubmit(event) {
        event.preventDefault();

        const authToken = localStorage.getItem('authToken');

        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const API = `${BASE_URL}/chapters/create-new`;

        const name = nameRef.current.value.trim();
        const url = urlRef.current.value.trim();
        const city = cityRef.current.value.trim();
        const description = descriptionRef.current.value.trim();

        // Prepare request parameters
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                name,
                gdgCommunityPageUrl: url,
                city,
                description,
            }),
        };

        try {
            const response = await fetch(API, params);
            const data = await response.json();

            if (response.ok) {
                alert('Chapter created successfully!');
                resetForm();
                if (onSuccess) {
                    onSuccess()
                }
            } else {
                alert(`Error: ${data.message || 'Failed to create chapter.'}`);
            }
        } catch (error) {
            alert(`Error: ${error.message || 'Failed to create chapter.'}`);

        }
    }


    function resetForm() {
        nameRef.current.value = '';
        urlRef.current.value = '';
        cityRef.current.value = '';
        descriptionRef.current.value = '';
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Add New Chapter
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-gray-100">Add New Chapter</DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-400">
                            Add a new GDG chapter to the list. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="name"
                                className="text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                                GDGoC Chapter Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                placeholder="GDGoC London College"
                                required
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                ref={nameRef}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="url"
                                className="text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                                Chapter URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="url"
                                placeholder="https://gdg.community.dev/gdg-cloud-london/"
                                required
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                ref={urlRef}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="city"
                                className="text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                                City <span className="text-gray-400 text-xs">(Optional)</span>
                            </label>
                            <input
                                id="city"
                                placeholder="London"
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                ref={cityRef}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="description"
                                className="text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                                Description <span className="text-gray-400 text-xs">(Optional)</span>
                            </label>
                            <textarea
                                id="description"
                                placeholder="Brief description of the chapter..."
                                rows={2}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                ref={descriptionRef}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer">
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
export default AddNewChapterDialog