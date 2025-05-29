import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  store?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasAccess: (pageId: string) => boolean;
  canAccessStore: (store: string) => boolean;
  canEditUser: (targetUserId: string) => boolean;
  users: User[];
  addUser: (user: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  updateUser: (id: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  getUserById: (id: string) => User | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define role permissions
interface RolePermission {
  id: string;
  name: string;
  pages: string[];
}

const defaultRolePermissions: RolePermission[] = [
  {
    id: 'manager',
    name: 'Manager',
    pages: ['dashboard', 'products', 'add-product', 'access', 'users']
  },
  {
    id: 'storekeeper',
    name: 'Store Keeper',
    pages: ['products', 'add-product']
  },
  {
    id: 'store-1-admin',
    name: 'Store 1 Admin',
    pages: ['dashboard', 'products', 'users', 'add-product']
  },
  {
    id: 'store-2-admin',
    name: 'Store 2 Admin',
    pages: ['dashboard', 'products', 'users', 'add-product']
  },
  {
    id: 'store-1-keeper',
    name: 'Keeper 1',
    pages: ['products', 'add-product']
  },
  {
    id: 'store-2-keeper',
    name: 'Keeper 2',
    pages: ['products', 'add-product']
  }
];

// Mock users for demonstration
const mockUsers: Record<string, { password: string; user: User }> = {
  'manager@inventory.com': {
    password: 'manager123',
    user: {
      id: '1',
      email: 'manager@inventory.com',
      role: 'Manager',
      name: 'Banny',
      store: 'all'
    }
  },
  'store1@inventory.com': {
    password: 'store1pass',
    user: {
      id: '4',
      email: 'store1@inventory.com',
      role: 'store-1-admin',
      name: 'admin-1',
      store: 'Store-1'
    }
  },
  'store2@inventory.com': {
    password: 'store2pass',
    user: {
      id: '5',
      email: 'store2@inventory.com',
      role: 'store-2-admin',
      name: 'admin-2',
      store: 'Store-2'
    }
  },
  'keeper1@inventory.com': {
    password: 'keeper1pass',
    user: {
      id: '6',
      email: 'keeper1@inventory.com',
      role: 'store-1-keeper',
      name: 'Keeper 1',
      store: 'Store-1'
    }
  },
  'keeper2@inventory.com': {
    password: 'keeper2pass',
    user: {
      id: '7',
      email: 'keeper2@inventory.com',
      role: 'store-2-keeper',
      name: 'Keeper 2',
      store: 'Store-2'
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(defaultRolePermissions);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem('inventory_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load custom role permissions if available
    const storedPermissions = localStorage.getItem('role_permissions');
    if (storedPermissions) {
      setRolePermissions(JSON.parse(storedPermissions));
    }

    // Load users from localStorage or initialize from mockUsers
    const storedUsers = localStorage.getItem('inventory_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize users from mockUsers
      const initialUsers = Object.values(mockUsers).map(item => item.user);
      setUsers(initialUsers);
      localStorage.setItem('inventory_users', JSON.stringify(initialUsers));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userCredentials = mockUsers[email];

    if (userCredentials && userCredentials.password === password) {
      setUser(userCredentials.user);
      localStorage.setItem('inventory_user', JSON.stringify(userCredentials.user));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('inventory_user');
  };

  // Function to check if current user has access to a specific page
  const hasAccess = (pageId: string): boolean => {
    if (!user) return false;

    // Debug log to see what's happening
    console.log(`Checking access for user: ${user.name}, role: ${user.role}, page: ${pageId}`);
    
    // Special case for store admins to access dashboard
    if (pageId === 'dashboard' && 
        (user.role.toLowerCase().includes('admin') || user.role.toLowerCase() === 'manager')) {
      return true;
    }

    // Find the role permission for the current user's role
    const rolePermission = rolePermissions.find(
      rp => rp.name.toLowerCase() === user.role.toLowerCase() || rp.id.toLowerCase() === user.role.toLowerCase()
    );

    if (!rolePermission) {
      console.log(`No role permission found for role: ${user.role}`);
      return false;
    }

    // Check if the page is in the allowed pages for this role
    const hasPageAccess = rolePermission.pages.includes(pageId);
    console.log(`Role: ${user.role}, Page: ${pageId}, Access: ${hasPageAccess}`);
    return hasPageAccess;
  };

  // User management functions
  const addUser = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate a unique ID
      const newId = String(Date.now());

      // Create new user
      const newUser: User = {
        id: newId,
        email: userData.email,
        role: userData.role,
        name: userData.name
      };

      // Update mockUsers for login functionality
      mockUsers[userData.email] = {
        password: userData.password,
        user: newUser
      };

      // Update users state
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);

      // Save to localStorage
      localStorage.setItem('inventory_users', JSON.stringify(updatedUsers));

      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find and update user
      const updatedUsers = users.map(user =>
        user.id === id ? { ...user, ...userData } : user
      );

      // Update mockUsers if email exists
      const userToUpdate = updatedUsers.find(user => user.id === id);
      if (userToUpdate) {
        const existingEntry = Object.entries(mockUsers).find(
          ([_, value]) => value.user.id === id
        );

        if (existingEntry) {
          const [email] = existingEntry;
          mockUsers[email].user = { ...mockUsers[email].user, ...userData };

          // If user email is changed, update the mockUsers key
          if (userData.email && email !== userData.email) {
            const { password } = mockUsers[email];
            delete mockUsers[email];
            mockUsers[userData.email] = { password, user: { ...userToUpdate } };
          }
        }
      }

      setUsers(updatedUsers);
      localStorage.setItem('inventory_users', JSON.stringify(updatedUsers));

      // If the current user is being updated, update the current user state
      if (user && user.id === id) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('inventory_user', JSON.stringify(updatedUser));
      }

      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find user to delete
      const userToDelete = users.find(user => user.id === id);
      if (!userToDelete) return false;

      // Remove from mockUsers
      Object.keys(mockUsers).forEach(email => {
        if (mockUsers[email].user.id === id) {
          delete mockUsers[email];
        }
      });

      // Update users state
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);

      // Save to localStorage
      localStorage.setItem('inventory_users', JSON.stringify(updatedUsers));

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  };

  const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };

  // Function to check if user can access a specific store's products
  const canAccessStore = (store: string): boolean => {
    if (!user) return false;

    // Only manager role can access store selection
    if (store === 'store-selection') {
      return user.role.toLowerCase() === 'manager';
    }

    // Managers with 'all' store access can see all products
    if (user.store === 'all') return true;

    // Store admins can access their assigned store
    if (user.role.toLowerCase().includes('admin') && user.store === store) {
      return true;
    }

    // Keepers can access their assigned store
    if (user.role.toLowerCase().includes('keeper') && user.store === store) {
      return true;
    }

    // Users can only see products from their assigned store
    return user.store === store;
  };

  // Function to check if user can edit another user
  const canEditUser = (targetUserId: string): boolean => {
    if (!user) return false;

    // Manager can edit anyone
    if (user.role.toLowerCase() === 'manager') return true;

    // Store admins cannot edit themselves
    if (user.id === targetUserId) return false;

    // By default, return false for safety
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      hasAccess,
      canAccessStore,
      canEditUser,
      users,
      addUser,
      updateUser,
      deleteUser,
      getUserById
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};