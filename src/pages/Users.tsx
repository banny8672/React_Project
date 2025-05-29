import { useState, useMemo } from 'react';
import { useAuth, User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Users = () => {
  const { users, addUser, updateUser, deleteUser, user: currentUser } = useAuth();
  const { toast } = useToast();

  // Filter users based on current user's role and store
  const filteredUsers = useMemo(() => {
    if (!currentUser) return [];

    // Manager can see all users
    if (currentUser.role.toLowerCase() === 'manager') {
      return users;
    }

    // Store admins can only see users from their store
    if (currentUser.role.toLowerCase().includes('admin') && currentUser.store) {
      return users.filter(u => u.store === currentUser.store);
    }

    // Default: return empty array for other roles
    return [];
  }, [users, currentUser]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Store Keeper',
    password: '',
    store: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.role || !formData.password) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    // Set store based on role if it's a store-specific role
    let store = formData.store;
    if (formData.role === 'store-1-admin' || formData.role === 'keeper-1') {
      store = 'Store-1';
    } else if (formData.role === 'store-2-admin' || formData.role === 'keeper-2') {
      store = 'Store-2';
    }

    const success = await addUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password,
      store
    });

    if (success) {
      toast({
        title: "Success",
        description: "User added successfully"
      });
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        role: 'Store Keeper',
        password: '',
        store: ''
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive"
      });
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '', // Password is not pre-filled for security
      store: user.store || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Error",
        description: "Name, email and role are required",
        variant: "destructive"
      });
      return;
    }

    // Set store based on role if it's a store-specific role
    let store = formData.store;
    if (formData.role === 'store-1-admin' || formData.role === 'keeper-1') {
      store = 'Store-1';
    } else if (formData.role === 'store-2-admin' || formData.role === 'keeper-2') {
      store = 'Store-2';
    }

    const userData: Partial<User> = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      store
    };

    const success = await updateUser(selectedUser.id, userData);

    if (success) {
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } else {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const success = await deleteUser(id);

      if (success) {
        toast({
          title: "Success",
          description: "User deleted successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users Management</CardTitle>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Store</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.store || '-'}</TableCell>
                  <TableCell className="text-right">
                    {/* Only show edit button if user can edit this user */}
                    {currentUser && currentUser.id !== user.id && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleAddUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {/* Manager can see all roles */}
                    {currentUser?.role.toLowerCase() === 'manager' && (
                      <>
                        <option value="Manager">Manager</option>
                        <option value="Store Keeper">Store Keeper</option>
                        <option value="store-1-admin">Store 1 Admin</option>
                        <option value="store-2-admin">Store 2 Admin</option>
                        <optgroup label="Store 1">
                          <option value="keeper-1">Keeper 1</option>
                        </optgroup>
                        <optgroup label="Store 2">
                          <option value="keeper-2">Keeper 2</option>
                        </optgroup>
                      </>
                    )}

                    {/* Store-1-admin can only see Store 1 roles */}
                    {currentUser?.role.toLowerCase() === 'store-1-admin' && (
                      <>
                        <optgroup label="Store 1">
                          <option value="keeper-1">Keeper 1</option>
                        </optgroup>
                      </>
                    )}

                    {/* Store-2-admin can only see Store 2 roles */}
                    {currentUser?.role.toLowerCase() === 'store-2-admin' && (
                      <>
                        <optgroup label="Store 2">
                          <option value="keeper-2">Keeper 2</option>
                        </optgroup>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add User</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {/* Manager can see all roles */}
                    {currentUser?.role.toLowerCase() === 'manager' && (
                      <>
                        <option value="Manager">Manager</option>
                        <option value="Store Keeper">Store Keeper</option>
                        <option value="store-1-admin">Store 1 Admin</option>
                        <option value="store-2-admin">Store 2 Admin</option>
                        <optgroup label="Store 1">
                          <option value="keeper-1">Keeper 1</option>
                        </optgroup>
                        <optgroup label="Store 2">
                          <option value="keeper-2">Keeper 2</option>
                        </optgroup>
                      </>
                    )}

                    {/* Store-1-admin can only see Store 1 roles */}
                    {currentUser?.role.toLowerCase() === 'store-1-admin' && (
                      <>
                        <optgroup label="Store 1">
                          <option value="keeper-1">Keeper 1</option>
                        </optgroup>
                      </>
                    )}

                    {/* Store-2-admin can only see Store 2 roles */}
                    {currentUser?.role.toLowerCase() === 'store-2-admin' && (
                      <>
                        <optgroup label="Store 2">
                          <option value="keeper-2">Keeper 2</option>
                        </optgroup>
                      </>
                    )}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update User</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;