import { MemoryModalProps } from "@/app/types";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { ChangeEvent, ChangeEventHandler, useState } from "react";

const AddMemoryModal: React.FC<MemoryModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    location: "",
    tags: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      setImage(files[0]);
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    onSubmit(formData.location, formData.tags, image);
    setIsLoading(false);
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="memory-modal"
      aria-describedby="add-new-memory"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Add New Memory
        </Typography>
        <TextField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Tags"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          placeholder="Enter tags separated by commas"
        />
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          style={{ marginTop: "1rem" }}
        />
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddMemoryModal;
