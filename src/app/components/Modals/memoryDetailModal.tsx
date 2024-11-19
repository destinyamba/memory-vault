import { Memory, MemoryDetailModalProps } from "@/app/types";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  X as CancelIcon,
  CloudArrowUp as CloudArrowUpIcon,
  PencilSimple as EditIcon,
} from "@phosphor-icons/react";
import { getBlobStorageUrl } from "@/app/apiService/memory-apis";

const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  open,
  memory,
  onClose,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLocation, setEditedLocation] = useState("");
  const [editedTags, setEditedTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (memory) {
      setEditedLocation(memory.location);
      setEditedTags(memory.tags);
      setIsEditing(false);
    }
  }, [memory]);

  const handleSave = async () => {
    if (memory) {
      setIsLoading(true);
      try {
        const updateData: Partial<Memory> = {
          location: editedLocation,
          tags: editedTags,
        };
        await onUpdate(memory.id, updateData);
        setIsEditing(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!memory) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="memory-detail-modal"
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "transparent",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Memory Details</Typography>
          <IconButton onClick={onClose}>
            <CancelIcon />
          </IconButton>
        </Box>

        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img
            src={getBlobStorageUrl(memory.image.filePath)}
            alt={memory.image.fileName}
            style={{
              maxWidth: "100%",
              maxHeight: 300,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        </Box>

        {isEditing ? (
          <>
            <TextField
              label="Location"
              fullWidth
              margin="normal"
              value={editedLocation}
              onChange={(e) => setEditedLocation(e.target.value)}
            />
            <TextField
              label="Tags"
              fullWidth
              margin="normal"
              value={editedTags}
              onChange={(e) => setEditedTags(e.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                startIcon={<CloudArrowUpIcon />}
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="subtitle1">
              <strong>Location:</strong> {memory.location}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              <strong>Tags:</strong> {memory.tags}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Edit Memory
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default MemoryDetailModal;
