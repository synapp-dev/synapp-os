# Permissions System

This permissions system provides a centralized way to check user permissions with caching and loading states.

## Features

- **Caching**: Permission results are cached to avoid repeated RPC calls
- **Loading States**: Built-in loading states for better UX
- **Type Safety**: Full TypeScript support
- **React Hooks**: Easy integration with React components

## Usage

### Basic Permission Check

```tsx
import { usePermission } from '@/lib/permissions';

function MyComponent() {
  const canCreateProject = usePermission('create_project');
  
  return (
    <div>
      {canCreateProject && <button>Create Project</button>}
    </div>
  );
}
```

### Permission Check with Loading State

```tsx
import { usePermissionWithLoading } from '@/lib/permissions';

function MyComponent() {
  const { allowed, loading } = usePermissionWithLoading('create_project');
  
  if (loading) {
    return <div>Checking permissions...</div>;
  }
  
  return (
    <div>
      {allowed && <button>Create Project</button>}
    </div>
  );
}
```

### Conditional Rendering Component

```tsx
import { IfCan } from '@/lib/permissions';

function MyComponent() {
  return (
    <div>
      <IfCan action="create_project">
        <button>Create Project</button>
      </IfCan>
      
      <IfCan action="delete_project" fallback={<p>You cannot delete projects</p>}>
        <button>Delete Project</button>
      </IfCan>
    </div>
  );
}
```

### Direct Permission Check (Non-React)

```tsx
import { canPerform } from '@/lib/permissions';

async function handleAction() {
  const canDoAction = await canPerform('some_action');
  if (canDoAction) {
    // Perform action
  }
}
```

### Cache Management

```tsx
import { clearPermissionsCache, clearPermissionCache } from '@/lib/permissions';

// Clear all cached permissions (useful when user roles change)
clearPermissionsCache();

// Clear specific permission cache
clearPermissionCache('create_project');
```

## Store API

The permissions store provides the following methods:

- `checkPermission(actionName: string)`: Check a permission and cache the result
- `getCachedPermission(actionName: string)`: Get cached permission result
- `clearCache()`: Clear all cached permissions
- `clearPermission(actionName: string)`: Clear specific permission cache

## Available Actions

The system uses the `check_action_permission` RPC function. Common actions include:

- `create_organisation`
- `create_project`
- `delete_project`
- `edit_project`
- `view_reports`
- `manage_users`

## Performance Benefits

1. **Caching**: Permission results are cached in memory
2. **Deduplication**: Multiple components checking the same permission won't trigger multiple RPC calls
3. **Loading States**: Prevents UI flicker during permission checks
4. **Automatic Cleanup**: Cache can be cleared when needed

## Best Practices

1. Use `usePermission` for simple boolean checks
2. Use `usePermissionWithLoading` when you need loading states
3. Use `IfCan` for conditional rendering
4. Clear cache when user roles or permissions change
5. Handle loading states gracefully in your UI 