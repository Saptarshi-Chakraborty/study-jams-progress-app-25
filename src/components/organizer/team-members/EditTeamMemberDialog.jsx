import React, { useState, useEffect } from 'react';
import { Button } from "@/UI/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/UI/Dialog";

const EditTeamMemberDialog = ({ open, onOpenChange, member, onSuccess }) => {
    const nameRef = React.useRef();
    const emailRef = React.useRef();
    const descRef = React.useRef();

    useEffect(() => {
        if (open && member) {
            nameRef.current.value = member.name || '';
            emailRef.current.value = member.email || '';
            descRef.current.value = member.desc || '';
        }
    }, [open, member]);

    async function handleSubmit(event) {
        event.preventDefault();

        const authToken = localStorage.getItem('authToken');
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const API = `${BASE_URL}/team-members/edit`;

        const name = nameRef.current.value.trim();
        const email = emailRef.current.value.trim();
        const desc = descRef.current.value.trim();

        if (!name || !email) {
            alert('Please fill all required fields.');
            return;
        }

        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ id: member.id, name, email, desc }),
        };

        try {
            const response = await fetch(API, params);
            const data = await response.json();

            if (response.ok) {
                alert('Team member updated successfully!');
                if (onSuccess) {
                    onSuccess();
                }
                onOpenChange(false);
            } else {
                alert(`Error: ${data.message || 'Failed to update team member.'}`);
            }
        } catch (error) {
            alert(`Error: ${error.message || 'Failed to update team member.'}`);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-gray-900 dark:text-gray-100">Edit Team Member</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400">
                        Update the team member's information. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form id="edit-team-member-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 -mr-2">
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="edit-name" className="text-sm font-medium text-gray-900 dark:text-gray-100">Full Name <span className="text-red-500">*</span></label>
                            <input id="edit-name" placeholder="John Doe" required className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" ref={nameRef} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="edit-email" className="text-sm font-medium text-gray-900 dark:text-gray-100">Email <span className="text-red-500">*</span></label>
                            <input id="edit-email" type="email" placeholder="john.doe@example.com" required className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" ref={emailRef} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="edit-desc" className="text-sm font-medium text-gray-900 dark:text-gray-100">Description</label>
                            <textarea id="edit-desc" placeholder="Optional description" rows={3} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none" ref={descRef} />
                        </div>
                    </div>
                </form>
                <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700 -mx-6 -mb-6 px-6 pb-6">
                    <DialogClose asChild>
                        <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" form="edit-team-member-form" className="bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer">
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default EditTeamMemberDialog;
