import React, { useState } from 'react';
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
import { ROLES } from '@/context/GlobalContext';

const AddNewTeamMemberDialog = ({ onSuccess, currentUser }) => {
    const [open, setOpen] = useState(false);

    const nameRef = React.useRef();
    const emailRef = React.useRef();

    async function handleSubmit(event) {
        event.preventDefault();

        const authToken = localStorage.getItem('authToken');
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const API = `${BASE_URL}/team-members/create-new`;

        const name = nameRef.current.value.trim();
        const email = emailRef.current.value.trim();

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
            body: JSON.stringify({ name, email }),
        };

        try {
            const response = await fetch(API, params);
            const data = await response.json();

            if (response.ok) {
                alert('Team member created successfully!');
                resetForm();
                if (onSuccess) {
                    onSuccess();
                }
                setOpen(false);
            } else {
                alert(`Error: ${data.message || 'Failed to create team member.'}`);
            }
        } catch (error) {
            alert(`Error: ${error.message || 'Failed to create team member.'}`);
        }
    }

    function resetForm() {
        nameRef.current.value = '';
        emailRef.current.value = '';
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={!currentUser} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Add New Team Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-gray-900 dark:text-gray-100">Add New Team Member</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400">
                        Add a new team member to your chapter. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form id="add-team-member-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 -mr-2">
                    <div className="grid gap-4 py-4 ">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-100">Full Name <span className="text-red-500">*</span></label>
                            <input id="name" placeholder="John Doe" required className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" ref={nameRef} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-gray-100">Email <span className="text-red-500">*</span></label>
                            <input id="email" type="email" placeholder="john.doe@example.com" required className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" ref={emailRef} />
                        </div>
                    </div>
                </form>
                <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700 -mx-6 -mb-6 px-6 pb-6">
                    <DialogClose asChild>
                        <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" form="add-team-member-form" className="bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer">
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AddNewTeamMemberDialog;
