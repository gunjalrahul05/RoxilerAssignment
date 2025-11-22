import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  useGetAllStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} from "../../store/api/storeApi";
import { toast } from "react-toastify";

const Stores = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const {
    data: storesData,
    isLoading,
    refetch,
  } = useGetAllStoresQuery({
    page: page + 1,
    limit: rowsPerPage,
    ...filters,
  });

  const [createStore] = useCreateStoreMutation();
  const [updateStore] = useUpdateStoreMutation();
  const [deleteStore] = useDeleteStoreMutation();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewStoreChange = (e) => {
    const { name, value } = e.target;
    setNewStore((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateStore = async () => {
    try {
      await createStore(newStore).unwrap();
      toast.success("Store created successfully");
      setCreateDialogOpen(false);
      setNewStore({
        name: "",
        email: "",
        address: "",
        owner_id: "",
      });
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to create store");
    }
  };

  const handleEditStore = async () => {
    try {
      const { id, ...updateData } = selectedStore;
      await updateStore({ id, ...updateData }).unwrap();
      toast.success("Store updated successfully");
      setEditDialogOpen(false);
      setSelectedStore(null);
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to update store");
    }
  };

  const handleDeleteStore = async () => {
    try {
      await deleteStore(selectedStore.id).unwrap();
      toast.success("Store deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedStore(null);
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete store");
    }
  };

  const openEditDialog = (store) => {
    setSelectedStore(store);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (store) => {
    setSelectedStore(store);
    setDeleteDialogOpen(true);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Store Management
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
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
        <TextField
          label="Address"
          name="address"
          value={filters.address}
          onChange={handleFilterChange}
          size="small"
        />
        <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
          Add Store
        </Button>
      </Box>

      {/* Stores Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : storesData?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No stores found
                </TableCell>
              </TableRow>
            ) : (
              storesData?.data.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>{store.email}</TableCell>
                  <TableCell>{store.address}</TableCell>
                  <TableCell>
                    {store.average_rating} ({store.rating_count} ratings)
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => openEditDialog(store)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => openDeleteDialog(store)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={storesData?.pagination?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Create Store Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      >
        <DialogTitle>Create New Store</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            <TextField
              label="Name"
              name="name"
              value={newStore.name}
              onChange={handleNewStoreChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={newStore.email}
              onChange={handleNewStoreChange}
              fullWidth
              required
            />
            <TextField
              label="Address"
              name="address"
              value={newStore.address}
              onChange={handleNewStoreChange}
              fullWidth
              required
            />
            <TextField
              label="Owner ID"
              name="owner_id"
              value={newStore.owner_id}
              onChange={handleNewStoreChange}
              helperText="Enter the user ID of the store owner"
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateStore}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Store Dialog */}
      {selectedStore && (
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Store</DialogTitle>
          <DialogContent>
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <TextField
                label="Name"
                name="name"
                value={selectedStore.name}
                onChange={(e) =>
                  setSelectedStore({ ...selectedStore, name: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={selectedStore.email}
                onChange={(e) =>
                  setSelectedStore({ ...selectedStore, email: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Address"
                name="address"
                value={selectedStore.address}
                onChange={(e) =>
                  setSelectedStore({
                    ...selectedStore,
                    address: e.target.value,
                  })
                }
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditStore}>Save</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Store Dialog */}
      {selectedStore && (
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Store</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete store: {selectedStore.name}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteStore} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Stores;
