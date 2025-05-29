import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Pencil, Plus, Save, Trash } from "lucide-react";
import { useAuth, User } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";

interface Role {
  id: string;
  name: string;
  description: string;
  pages: string[];
}

// Define available pages and their descriptions
const availablePages = [
  { id: 'dashboard', name: 'Dashboard', description: 'Main dashboard with analytics' },
  { id: 'products', name: 'Products', description: 'Product management' },
  { id: 'add-product', name: 'Add Product', description: 'Create new products' },
  { id: 'users', name: 'Users', description: 'User management and profiles' },
  { id: 'access', name: 'Role Management', description: 'Manage user roles and permissions' }
];

// Define initial roles
const initialRoles = [
  {
    id: 'manager',
    name: 'Manager',
    description: 'Full access to all features',
    pages: ['dashboard', 'products', 'add-product', 'users', 'access']
  },
  {
    id: 'store-1-admin',
    name: 'Store-1-Admin',
    description: 'Access to product and users management',
    pages: ['products', 'add-product', 'users']
  },
  {
    id: 'store-2-admin',
    name: 'Store-2-Admin',
    description: 'Access to product and users management',
    pages: ['products', 'add-product', 'users']
  },
  {
    id: 'store-1-keeper',
    name: 'Store-1-Keeper',
    description: 'Access to product management',
    pages: ['products', 'add-product']
  },
  {
    id: 'store-2-keeper',
    name: 'Store-2-Keeper',
    description: 'Access to product management',
    pages: ['products', 'add-product']
  }
];

export default function RoleBase() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [activeTab, setActiveTab] = useState("roles");
  const [newRole, setNewRole] = useState<Role>({ id: '', name: '', description: '', pages: [] });
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const { users } = useAuth();
  const { toast } = useToast();
  const { translations } = useContext(LanguageContext);

  // Load saved roles from localStorage on component mount
  useEffect(() => {
    const savedRoles = localStorage.getItem('role_permissions');
    if (savedRoles) {
      try {
        setRoles(JSON.parse(savedRoles));
      } catch (error) {
        console.error('Failed to parse saved roles:', error);
      }
    }
  }, []);

  // Save roles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('role_permissions', JSON.stringify(roles));
  }, [roles]);

  const handlePageToggle = (pageId: string, isChecked: boolean, roleToUpdate: Role | null) => {
    if (roleToUpdate) {
      // Editing existing role
      const updatedPages = isChecked
        ? [...roleToUpdate.pages, pageId]
        : roleToUpdate.pages.filter((id: string) => id !== pageId);
      setEditingRole({ ...roleToUpdate, pages: updatedPages });
    } else {
      // Creating new role
      const updatedPages = isChecked
        ? [...newRole.pages, pageId]
        : newRole.pages.filter(id => id !== pageId);
      setNewRole({ ...newRole, pages: updatedPages });
    }
  };

  const handleSaveRole = () => {
    if (!newRole.id || !newRole.name) return;

    // Check if role ID already exists
    if (roles.some(role => role.id === newRole.id)) {
      toast({
        title: "Error",
        description: "Role ID already exists. Please choose a different ID.",
        variant: "destructive"
      });
      return;
    }

    setRoles([...roles, newRole]);
    setNewRole({ id: '', name: '', description: '', pages: [] });

    toast({
      title: "Success",
      description: `Role "${newRole.name}" has been created.`,
    });
    setActiveTab("roles");
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(role => role.id !== roleId));

    toast({
      title: "Success",
      description: "Role has been deleted.",
    });
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setActiveTab("edit-role");
  };

  const handleUpdateRole = () => {
    if (!editingRole) return;

    const updatedRoles = roles.map(role =>
      role.id === editingRole.id ? editingRole : role
    );

    setRoles(updatedRoles);

    toast({
      title: "Success",
      description: `Role "${editingRole.name}" has been updated.`,
    });

    setEditingRole(null);
    setActiveTab("roles");
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6 gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold">{translations.roleManagement}</h2>
        <Button onClick={() => setActiveTab("new-role")}>
          <Plus className="h-4 w-4 mr-2" />
          {translations.createNewRole}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="roles">{translations.roles}</TabsTrigger>
          <TabsTrigger value="new-role">{translations.createNewRole}</TabsTrigger>
          <TabsTrigger value="users">{translations.users}</TabsTrigger>
          {editingRole && <TabsTrigger value="edit-role">Edit Role</TabsTrigger>}
        </TabsList>

        <TabsContent value="roles">
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Accessible Pages</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.pages.map(pageId => {
                            const page = availablePages.find(p => p.id === pageId);
                            return page ? (
                              <span key={pageId} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                                {page.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {role.id !== 'manager' && role.id !== 'storekeeper' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new-role">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Role ID</label>
                  <Input
                    placeholder="Enter role ID (e.g. admin)"
                    value={newRole.id}
                    onChange={(e) => setNewRole({ ...newRole, id: e.target.value.toLowerCase() })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role Name</label>
                  <Input
                    placeholder="Enter role name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  placeholder="Enter role description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Page Access</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availablePages.map((page) => (
                    <div key={page.id} className="flex items-center space-x-2 border p-3 rounded-md">
                      <Checkbox
                        id={`page-${page.id}`}
                        checked={newRole.pages.includes(page.id)}
                        onCheckedChange={(checked) => handlePageToggle(page.id, checked as boolean, null)}
                      />
                      <div>
                        <label
                          htmlFor={`page-${page.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {page.name}
                        </label>
                        <p className="text-xs text-gray-500">{page.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    setNewRole({ id: '', name: '', description: '', pages: [] });
                    setActiveTab("roles");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveRole}
                  disabled={!newRole.id || !newRole.name}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Role
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Access</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const userRole = roles.find(role =>
                      role.id.toLowerCase() === user.role.toLowerCase() ||
                      role.name.toLowerCase() === user.role.toLowerCase()
                    );

                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {userRole?.pages.map(pageId => {
                              const page = availablePages.find(p => p.id === pageId);
                              return page ? (
                                <span key={pageId} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                                  {page.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {editingRole && (
          <TabsContent value="edit-role">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Role ID</label>
                    <Input
                      value={editingRole.id}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Role Name</label>
                    <Input
                      value={editingRole.name}
                      onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                      disabled={editingRole.id === 'manager' || editingRole.id === 'storekeeper'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input
                    value={editingRole.description}
                    onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Page Access</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availablePages.map((page) => (
                      <div key={page.id} className="flex items-center space-x-2 border p-3 rounded-md">
                        <Checkbox
                          id={`edit-page-${page.id}`}
                          checked={editingRole.pages.includes(page.id)}
                          onCheckedChange={(checked) => handlePageToggle(page.id, checked as boolean, editingRole)}
                        />
                        <div>
                          <label
                            htmlFor={`edit-page-${page.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {page.name}
                          </label>
                          <p className="text-xs text-gray-500">{page.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => {
                      setEditingRole(null);
                      setActiveTab("roles");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateRole}>
                    <Save className="h-4 w-4 mr-2" />
                    Update Role
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}