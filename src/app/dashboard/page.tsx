'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import {trpc} from '@/app/_trpc/client';
import Container from '@/components/Container';

export default function Dashboard() {
    const { isLoaded, isSignedIn } = useUser();
    const [content, setContent] = useState('');
    
    const todosQuery = trpc.getTodos.useQuery();
    const addTodoMutation = trpc.addTodo.useMutation({
        onSuccess: () => {
            todosQuery.refetch();
        },
        onError: (error) => {
            console.error('Error adding todo:', error);
        }
    });
    const toggleTodoMutation = trpc.toggleTodo.useMutation({
        onSuccess: () => {
            todosQuery.refetch();
        }
    });
    const clearTodosMutation = trpc.clearTodos.useMutation({
        onSuccess: () => {
            todosQuery.refetch();
        }
    });
    
    // Show loading state while auth is loading
    if (!isLoaded) {
        return (
            <Container className="flex items-center justify-center min-h-screen">
                <div>Loading...</div>
            </Container>
        );
    }
    
    // Redirect to sign in if not authenticated
    if (!isSignedIn) {
        redirect('/sign-in');
    }
    
    const handleAddTodo = async () => {
        if (content.trim().length) {
            addTodoMutation.mutate(content);
            setContent('');
        }
    };
    
    const handleToggleTodo = (id: number) => {
        toggleTodoMutation.mutate({ id });
    };
    
    const handleClearTodos = () => {
        if (window.confirm('Are you sure you want to clear all todos? This action cannot be undone.')) {
            clearTodosMutation.mutate();
        }
    };
    
    return (
        <Container className="flex flex-col items-center min-h-screen py-10">
            <h2 className='text-4xl font-bold text-center mb-8'>To-do List</h2>
            
            <div className='p-6 bg-white rounded-lg shadow-md w-full max-w-2xl'>
                <div className='mb-6'>
                    <h3 className='text-xl font-semibold mb-4 text-center'>Add New Todo</h3>
                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                        <input
                            id='content'
                            value={content}
                            placeholder="Enter your todo item..."
                            onChange={(e) => setContent(e.target.value)}
                            className='flex-grow text-black bg-white border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddTodo();
                                }
                            }}
                        />
                        <button 
                            onClick={handleAddTodo}                      
                            className='py-3 px-6 bg-blue-500 text-white font-bold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto'
                            disabled={addTodoMutation.isPending}
                        >
                            {addTodoMutation.isPending ? 'Adding...' : 'Add Todo'}
                        </button>
                    </div>
                </div>
                
                <div className='mt-8'>
                    <h3 className='text-xl font-semibold mb-4 text-center'>Your Todos</h3>
                    
                    {todosQuery.isPending ? (
                        <div className='text-center py-4'>Loading your todos...</div>
                    ) : todosQuery.error ? (
                        <div className='text-red-500 py-4 text-center'>Error loading todos: {todosQuery.error.message}</div>
                    ) : todosQuery.data?.length === 0 ? (
                        <div className='text-center py-8 text-gray-500'>You have no todos yet. Add one above!</div>
                    ) : (
                        <>
                            <ul className='space-y-3 mb-6'>
                                {todosQuery.data?.map((todo) => (
                                    <li key={todo.id} className='flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50'>
                                        <input 
                                            type="checkbox" 
                                            checked={todo.done} 
                                            onChange={() => handleToggleTodo(todo.id)}
                                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className={`flex-grow ${todo.done ? 'line-through text-gray-400' : ''}`}>
                                            {todo.content}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            
                            <div className='flex justify-center mt-6'>
                                <button
                                    onClick={handleClearTodos}
                                    disabled={clearTodosMutation.isPending}
                                    className='py-2 px-4 bg-red-500 text-white font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors'
                                >
                                    {clearTodosMutation.isPending ? 'Clearing...' : 'Clear To-Do List'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
}