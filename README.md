# BrightSide Developer

BrightSide Developer is a TypeScript package designed to provide an easy-to-use interface for interacting with Supabase. It includes utilities for authentication, CRUD operations, real-time updates, and theming, making it a versatile tool for developers working with Supabase in their React applications.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
  - [Initialization](#initialization)
  - [Authentication](#authentication)
  - [CRUD Operations](#crud-operations)
  - [Real-time](#real-time)
  - [Theming](#theming)
  - [Utility Functions](#utility-functions)
- [Example Usage](#example-usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install BrightSide Developer, simply run:

```bash
npm install brightside-developer
```

See typedoc here: https://brightside-developer-docs.vercel.app

## Features

### Initialization

Before using any of the BrightBase features, you need to initialize it with your Supabase URL and key.

```typescript
import { initBrightBase } from 'brightside-developer'

const SUPABASE_URL = 'https://your-supabase-url'
const SUPABASE_ANON_KEY = 'your-anon-key'

initBrightBase(SUPABASE_URL, SUPABASE_ANON_KEY)

### Authentication

BrightBaseAuth provides methods for handling user authentication, including signing up, signing in, and managing user sessions. It supports multiple authentication methods like email/password and OAuth providers such as Google and Apple.

#### Example
```

```typescript
import { BrightBaseAuth } from 'brightside-developer'

const auth = new BrightBaseAuth()

// Sign up with email and password
auth.signUpWithEmail('user@example.com', 'password123')
  .then(user => console.log(user))
  .catch(err => console.error(err))

// Sign in with Google
auth.signInWithGoogle()
  .then(user => console.log(user))
  .catch(err => console.error(err))

### CRUD Operations

BrightBaseCRUD simplifies interacting with Supabase tables by providing a clean interface for performing Create, Read, Update, and Delete operations.

#### Example
```

```typescript
interface Todo {
  id: string
  created_at: string
  todo: string
  done: boolean
}

const todosTable = new BrightBaseCRUD<Todo, { OmitOnCreate: 'id' | 'created_at'; OptionalOnCreate: 'done' }>('todos')

// Create a new todo
todosTable
  .create({ todo: 'Write documentation', done: false })
  .then((data) => console.log('Todo created:', data))
  .catch((err) => console.error('Error creating todo:', err))

// Read todos
todosTable
  .read({ done: false })
  .then((data) => console.log('Todos:', data))
  .catch((err) => console.error('Error reading todos:', err))

// Update a todo
todosTable
  .update('some-todo-id', { done: true })
  .then((data) => console.log('Todo updated:', data))
  .catch((err) => console.error('Error updating todo:', err))

// Delete a todo
todosTable
  .delete('some-todo-id')
  .then(() => console.log('Todo deleted'))
  .catch((err) => console.error('Error deleting todo:', err))
```

### Real-time

BrightBaseRealtime allows you to subscribe to real-time updates on a channel and emit events. It's built to work seamlessly with Supabase's real-time features.

#### Example

```typescript
interface DemoEvents {
  message: { message: string; name: string }
  toggle: { isOn: boolean }
}

const channel = new BrightBaseRealtime<DemoEvents>('demo-channel')

// Subscribe to events
channel.on('message', (data) => {
  console.log('Message received:', data)
})

// Emit an event
channel.emit('message', { message: 'Hello, world!', name: 'BrightSide' })
```

### Theming

BrightWebTheme is a utility that helps manage theming in your web application. It allows you to initialize themes based on system preferences, set themes manually, and listen to changes in the system's color scheme.

#### Example

```typescript
import { BrightWebTheme } from 'brightside-developer'

// Initialize the theme
BrightWebTheme.initializeTheme()

// Set the theme to dark mode
BrightWebTheme.setTheme('dark')

// Listen for changes in system preferences
BrightWebTheme.mediaThemeEventListener()
```

### Utility Functions

- **wetToast:** A utility that wraps around `react-hot-toast` to display consistent and theme-aware toast notifications in your application.

#### Example

```typescript
import { wetToast } from 'brightside-developer'

// Display a success toast
wetToast('Todo added successfully!', { icon: '🎉' })

// Display an error toast
wetToast('Failed to add todo.', { icon: '❌' })
```

### Example Usage

Here is an example of how you can use the various components provided by BrightSide Developer in a React application:

```tsx
import { Loader2, Trash } from 'lucide-react'
import { Suspense, useState, useCallback } from 'react'
import { BrightBaseCRUD, BrightBaseRealtime, initBrightBase, useSuspenseQuery, wetToast } from 'brightside-developer'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

initBrightBase(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function App() {
  const [page, setPage] = useState('')

  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      {page === 'realtime' ? <Realtime /> : <CRUD />}
      <div>
        <button onClick={() => setPage('crud')}>CRUD</button>
        <button onClick={() => setPage('realtime')}>Realtime</button>
      </div>
    </Suspense>
  )
}

function CRUD() {
  const todosTable = new BrightBaseCRUD<{ id: string; todo: string; done: boolean }>('todos')
  const [text, setText] = useState('')

  const createTodo = useCallback(() => {
    todosTable
      .create({ todo: text, done: false })
      .then(() => wetToast('Todo added!', { icon: '🎉' }))
      .catch((err) => wetToast(err.message, { icon: '❌' }))
  }, [text])

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New Todo" />
      <button onClick={createTodo}>Add Todo</button>
    </div>
  )
}

function Realtime() {
  const channel = new BrightBaseRealtime<{ message: string }>('room1')

  return (
    <div>
      <button onClick={() => channel.emit('message', { message: 'Hello, world!' })}>Send Message</button>
    </div>
  )
}
```

### Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue on the [GitHub repository](https://github.com/yourusername/brightside-developer).

If you'd like to contribute code, please fork the repository, make your changes in a new branch, and submit a pull request. Be sure to include tests for any new features or changes to existing code.

### License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/yourusername/brightside-developer/blob/main/LICENSE) file for details.
