"use client";
import {
  Box,
  Button,
  CardMedia,
  Chip,
  Grid2,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CloudArrowUp, Trash } from "@phosphor-icons/react";
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

interface Memory {
  id: string;
  date: string;
  location: string;
  tags: string;
  image: {
    filePath: string;
    fileLocator: string;
    fileName: string;
    uploadDate: string;
  };
  created_at: string;
  updated_at: string;
}

function MemoryVaultUI() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    tags: "",
  });
  const [image, setImage] = useState<File | null>(null);

  const getBlobStorageUrl = (filePath: string): string => {
    const storageAccountName = "memoryvaultblobstore"; // blob store account name
    const cleanFilePath = filePath.startsWith("/")
      ? filePath.slice(1)
      : filePath;
    return `https://${storageAccountName}.blob.core.windows.net/${cleanFilePath}`;
  };

  // Fetch all memories on load
  useEffect(() => {
    fetchAllMemories();
  }, []);

  const fetchAllMemories = async () => {
    try {
      const response = await axios.get<Memory[]>(
        "https://prod-03.northcentralus.logic.azure.com:443/workflows/53e0e2a806f348d19527a9eb34912130/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=JbfovVK1z3LO8mtFVYL9TzukBvv1DRzHFHnAbpzZFEc"
      );
      setMemories(response.data);
      console.log("Memories: ", response.data);
    } catch (error) {
      console.error("Error fetching memories:", error);
      alert("Failed to fetch memories");
    }
  };

  const parseTags = (tagsString: string) => {
    return tagsString ? tagsString.split(",").map((tag) => tag.trim()) : [];
  };

  // Open modal to add memories
  const handleOpen = () => {
    setOpenModal(true);
  };

  // Close modal
  const handleClose = () => {
    setOpenModal(false);
  };

  // Handle form data change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      setImage(files[0]);
    }
  };

  // Function to upload image and metadata. this is working except images displaying correctly

  const handleSubmit = async () => {
    if (!image) {
      alert("Please select an image to upload");
      return;
    }

    try {
      // Create FormData with exact field names matching Logic App
      const formDataToSend = new FormData();
      formDataToSend.append("File", image);
      formDataToSend.append("Location", formData.location);
      formDataToSend.append("Tags", formData.tags);
      formDataToSend.append("UserID", "1");
      formDataToSend.append("UserName", "destiny");

      // Add current timestamp
      const currentDate = new Date().toISOString();
      formDataToSend.append("Created_at", currentDate);
      formDataToSend.append("Updated_at", currentDate);

      // Create the complete URL with query parameters
      const baseUrl =
        "https://prod-28.eastus.logic.azure.com/workflows/9c1b18692fad47aea0deb906e263f2c5/triggers/When_a_HTTP_request_is_received/paths/invoke";
      const queryParams = new URLSearchParams({
        "api-version": "2016-10-01",
        sp: "/triggers/When_a_HTTP_request_is_received/run",
        sv: "1.0",
        sig: "8pK2TDtF3rNtFoNDzBeBtnQeiWZ_miqSpP1m2X9RUxo",
      }).toString();

      const fullUrl = `${baseUrl}?${queryParams}`;

      const response = await axios.post(fullUrl, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // Reset form and close modal on success
        setFormData({
          location: "",
          tags: "",
        });
        setImage(null);
        setOpenModal(false);

        // Refresh the memories list
        await fetchAllMemories();
      }
    } catch (error) {
      console.error("Error uploading memory:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message ||
          "Failed to upload memory. Please try again.";
        alert(errorMessage);
      } else {
        alert("Failed to upload memory. Please try again.");
      }
    }
  };

  const deleteMemory = async (memoryId: string) => {
    try {
      await axios.delete(`https://your-delete-memory-api-endpoint/${memoryId}`);
      fetchAllMemories();
    } catch (error) {
      console.error("Error deleting memory:", error);
      alert("Failed to delete memory");
    }
  };

  function formatTicksToTime(ticks: string | number): string {
    const ticksNumber = typeof ticks === "string" ? Number(ticks) : ticks;
    const milliseconds = ticksNumber / 10000;
    const date = new Date(milliseconds);

    return format(date, "hh:mm a");
  }

  return (
    <>
      <Grid2
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        m={4}
      >
        <Box>
          <Typography variant="h4">Memory Vault</Typography>
          <Typography variant="subtitle2">
            Your AI-powered memory archive
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<CloudArrowUp size={24} />}
          onClick={handleOpen}
        >
          Add Memory
        </Button>
        <Modal
          open={openModal}
          onClose={handleClose}
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
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>
      </Grid2>

      <Grid2 container spacing={2} justifyContent="center" mx={4}>
        {memories.map((memory, index) => (
          <Card
            key={`memory-${index}`}
            sx={{ maxWidth: 400, my: 2, mx: 2, borderRadius: 4, boxShadow: 5 }}
          >
            <CardMedia
              component="img"
              height="200"
              image={getBlobStorageUrl(memory.image.filePath)}
              alt={memory.image.fileName}
            />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">
                  {formatTicksToTime(memory.created_at)}
                </Typography>
                <Tooltip title="Delete Memory">
                  <IconButton onClick={() => deleteMemory(memory.id)}>
                    <Trash />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="body2" color="textSecondary">
                {memory.location}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {parseTags(memory.tags).map((tag: string, idx: number) => (
                  <Chip key={idx} label={tag} />
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Grid2>
    </>
  );
}

export default MemoryVaultUI;
