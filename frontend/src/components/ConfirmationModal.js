import { Dialog,
         DialogTitle,
         DialogContent,
         DialogContentText,
         DialogActions,
         Button, } from '@mui/material';

export default function ConfirmationModal({ open, onCancel, onConfirm, title = "Are you sure?", text = "This action cannot be undone." }) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} autoFocus>Cancel</Button>
        <Button onClick={onConfirm} color="error">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
