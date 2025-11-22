import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Button, TextField, MenuItem, Select, FormControl, 
  InputLabel, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useGetAllUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../../store/api/userApi';
import { toast } from 'react-toastify';

const Users = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    role: ''
  });
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER'
  });
  
  // RTK Query hooks
  const { data: usersData, isLoading, refetch } = useGetAllUsersQuery({
    page: page + 1,
    limit: rowsPerPage,
    ...filters
  });
  
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  
  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCreateUser = async () => {
    try {
      await createUser(newUser).unwrap();
      toast.success('User created successfully');
      setCreateDialogOpen(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'USER'
      });
      refetch();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to create user');
    }
  };
  
  const handleEditUser = async () => {
    try {
      const { id, ...updateData } = selectedUser;
      await updateUser({ id, ...updateData }).unwrap();
      toast.success('User updated successfully');
      setEditDialogOpen(false);
      setSelectedUser(null);
      refetch();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update user');
    }
  };
  
  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser.id).unwrap();
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      refetch();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete user');
    }
  };
  
  const openEditDialog = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };
  
  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };
  
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Name"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          size="small"
        />
        <TextField
          label="Email"
          name="email"
          value={filters.email}
          onChange={handleFilterChange}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Role</InputLabel>
          <Select
            label="Role"
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="STORE_OWNER">Store Owner</MenuItem>
          </Select>
        </FormControl>
        <Button 
          variant="contained" 
          onClick={() => setCreateDialogOpen(true)}
        >
          Add User
        </Button>
      </Box>
      
      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Rating</TableCell> {/* Add this */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : usersData?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No users found</TableCell>
              </TableRow>
            ) : (
              usersData?.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.role === 'STORE_OWNER'
                      ? (user.ranking !== null ? Number(user.ranking).toFixed(1) : '0.0')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => openEditDialog(user)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => openDeleteDialog(user)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={usersData?.pagination?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      
      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={newUser.name}
              onChange={handleNewUserChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={newUser.email}
              onChange={handleNewUserChange}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={newUser.password}
              onChange={handleNewUserChange}
              fullWidth
              required
            />
            <TextField
              label="Address"
              name="address"
              value={newUser.address}
              onChange={handleNewUserChange}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                name="role"
                value={newUser.role}
                onChange={handleNewUserChange}
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="STORE_OWNER">Store Owner</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateUser}>Create</Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Name"
                name="name"
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                fullWidth
                disabled
              />
              <TextField
                label="Address"
                name="address"
                value={selectedUser.address}
                onChange={(e) => setSelectedUser({...selectedUser, address: e.target.value})}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  name="role"
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="STORE_OWNER">Store Owner</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditUser}>Save</Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* Delete User Dialog */}
      {selectedUser && (
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete user: {selectedUser.name}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteUser} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Users;